package com.explainmyerror.service.analysis;

import com.explainmyerror.dto.*;
import com.explainmyerror.entity.*;
import com.explainmyerror.exception.AccessDeniedException;
import com.explainmyerror.exception.NotFoundException;
import com.explainmyerror.exception.RateLimitException;
import com.explainmyerror.repository.*;
import com.explainmyerror.service.ai.AIAnalysisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalysisService {

    private final AIAnalysisService aiService;
    private final ErrorAnalysisRepository analysisRepo;
    private final UserRepository userRepo;
    private final FollowUpMessageRepository followUpRepo;

    @Value("${app.rate-limit.analyses-per-day:10}")
    private int analysesPerDay;

    // -------------------------------------------------------------------------
    // Create analysis
    // -------------------------------------------------------------------------

    @Transactional
    public AnalysisResponse createAnalysis(AnalysisRequest request, Long userId) {
        // Rate limiting
        if (userId != null) {
            checkRateLimit(userId);
        }

        User user = userId != null ? userRepo.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found")) : null;

        // Dispatch to the correct AI method based on mode
        AIAnalysisResult aiResult;
        String mode = request.getMode() != null ? request.getMode().toUpperCase() : "ERROR_ANALYSIS";
        aiResult = switch (mode) {
            case "CODE_EXPLANATION" -> aiService.explainCode(request);
            case "CODE_REVIEW" -> aiService.reviewCode(request);
            default -> aiService.analyzeError(request);
        };

        // Persist the analysis
        ErrorAnalysis analysis = buildAnalysisEntity(request, aiResult, user, mode);
        analysis = analysisRepo.save(analysis);

        log.info("Analysis created id={} language={} errorName={}",
                analysis.getId(), analysis.getLanguage(), analysis.getErrorName());

        return toResponse(analysis);
    }

    // -------------------------------------------------------------------------
    // Read
    // -------------------------------------------------------------------------

    @Transactional(readOnly = true)
    public Page<AnalysisResponse> listAnalyses(Long userId, String language, String severity,
                                               String mode, String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        // Build null-safe filter params
        String langFilter = (language != null && !language.isBlank()) ? language : null;
        String sevFilter = (severity != null && !severity.isBlank()) ? severity : null;
        String modeFilter = (mode != null && !mode.isBlank()) ? mode : null;
        String searchFilter = (search != null && !search.isBlank()) ? search : null;

        Page<ErrorAnalysis> page_ = analysisRepo.search(userId, langFilter, sevFilter, modeFilter, searchFilter, pageable);
        return page_.map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public AnalysisResponse getAnalysis(Long id, Long userId) {
        ErrorAnalysis analysis = findAndAuthorise(id, userId);
        return toResponse(analysis);
    }

    // -------------------------------------------------------------------------
    // Delete
    // -------------------------------------------------------------------------

    @Transactional
    public void deleteAnalysis(Long id, Long userId) {
        ErrorAnalysis analysis = findAndAuthorise(id, userId);
        analysisRepo.delete(analysis);
        log.info("Analysis deleted id={}", id);
    }

    // -------------------------------------------------------------------------
    // Follow-up chat
    // -------------------------------------------------------------------------

    @Transactional
    public String addFollowUp(Long analysisId, Long userId, String question) {
        ErrorAnalysis analysis = findAndAuthorise(analysisId, userId);
        List<FollowUpMessage> history = followUpRepo.findByAnalysisIdOrderByCreatedAtAsc(analysisId);

        String answer = aiService.answerFollowUp(analysis, history, question);

        // Persist both user message and AI answer
        followUpRepo.save(FollowUpMessage.builder()
                .analysis(analysis).role("USER").message(question).build());
        followUpRepo.save(FollowUpMessage.builder()
                .analysis(analysis).role("ASSISTANT").message(answer).build());

        return answer;
    }

    @Transactional(readOnly = true)
    public List<FollowUpMessage> getFollowUpHistory(Long analysisId, Long userId) {
        findAndAuthorise(analysisId, userId);
        return followUpRepo.findByAnalysisIdOrderByCreatedAtAsc(analysisId);
    }

    // -------------------------------------------------------------------------
    // Recent analyses for dashboard
    // -------------------------------------------------------------------------

    @Transactional(readOnly = true)
    public List<AnalysisResponse> getRecentAnalyses(Long userId) {
        return analysisRepo.findTop5ByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::toSummaryResponse).collect(Collectors.toList());
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private void checkRateLimit(Long userId) {
        LocalDateTime since = LocalDateTime.now().minusDays(1);
        long count = analysisRepo.countByUserIdAndCreatedAtAfter(userId, since);
        if (count >= analysesPerDay) {
            throw new RateLimitException(
                "Daily analysis limit of " + analysesPerDay + " reached. Please try again tomorrow.");
        }
    }

    private ErrorAnalysis findAndAuthorise(Long id, Long userId) {
        ErrorAnalysis analysis = analysisRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Analysis not found: " + id));
        if (userId != null && analysis.getUser() != null && !analysis.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("You do not have access to this analysis.");
        }
        return analysis;
    }

    private ErrorAnalysis buildAnalysisEntity(AnalysisRequest request, AIAnalysisResult ai, User user, String mode) {
        ErrorAnalysis analysis = ErrorAnalysis.builder()
                .user(user)
                .language(ai.getLanguage() != null ? ai.getLanguage() : request.getLanguage())
                .framework(ai.getTechnology() != null ? ai.getTechnology() : request.getFramework())
                .problemType(ai.getProblemType())
                .inputText(request.getInput())
                .expectedBehavior(request.getExpectedBehavior())
                .explanationLevel(request.getExplanationLevel())
                .mode(mode)
                .errorName(ai.getErrorName())
                .severity(ai.getSeverity())
                .confidence(ai.getConfidence())
                .whatHappened(ai.getWhatHappened())
                .whyItHappened(ai.getWhyItHappened())
                .rootCause(ai.getRootCause())
                .prevention(ai.getPrevention())
                .status("COMPLETED")
                .build();

        // Error location
        if (ai.getErrorLocation() != null) {
            analysis.setErrorFile(ai.getErrorLocation().getFile());
            analysis.setErrorLine(ai.getErrorLocation().getLine());
            analysis.setErrorLocationDescription(ai.getErrorLocation().getDescription());
        }

        // Suggested fix
        if (ai.getSuggestedFix() != null) {
            analysis.setSuggestedFixExplanation(ai.getSuggestedFix().getExplanation());
            analysis.setSuggestedFixCode(ai.getSuggestedFix().getFixedCode());
            analysis.setOriginalCode(ai.getSuggestedFix().getOriginalCode());
        }

        // Probable causes
        if (ai.getProbableCauses() != null) {
            List<ProbableCause> causes = new ArrayList<>();
            for (int i = 0; i < ai.getProbableCauses().size(); i++) {
                var pc = ai.getProbableCauses().get(i);
                causes.add(ProbableCause.builder()
                        .analysis(analysis)
                        .cause(pc.getCause())
                        .confidence(pc.getConfidence())
                        .rank(i + 1)
                        .build());
            }
            analysis.getProbableCauses().addAll(causes);
        }

        // Debugging steps
        if (ai.getDebuggingSteps() != null) {
            List<DebuggingStep> steps = new ArrayList<>();
            for (int i = 0; i < ai.getDebuggingSteps().size(); i++) {
                steps.add(DebuggingStep.builder()
                        .analysis(analysis)
                        .stepNumber(i + 1)
                        .description(ai.getDebuggingSteps().get(i))
                        .build());
            }
            analysis.getDebuggingSteps().addAll(steps);
        }

        // Alternative fixes
        if (ai.getAlternativeFixes() != null) {
            List<AlternativeFix> fixes = new ArrayList<>();
            for (int i = 0; i < ai.getAlternativeFixes().size(); i++) {
                var af = ai.getAlternativeFixes().get(i);
                fixes.add(AlternativeFix.builder()
                        .analysis(analysis)
                        .fixType(af.getFixType())
                        .description(af.getDescription())
                        .rank(i + 1)
                        .build());
            }
            analysis.getAlternativeFixes().addAll(fixes);
        }

        // Related concepts
        if (ai.getRelatedConcepts() != null) {
            List<RelatedConcept> concepts = new ArrayList<>();
            for (String concept : ai.getRelatedConcepts()) {
                concepts.add(RelatedConcept.builder().analysis(analysis).concept(concept).build());
            }
            analysis.getRelatedConcepts().addAll(concepts);
        }

        return analysis;
    }

    /** Full response including all nested data */
    public AnalysisResponse toResponse(ErrorAnalysis a) {
        var builder = AnalysisResponse.builder()
                .id(a.getId())
                .language(a.getLanguage())
                .framework(a.getFramework())
                .problemType(a.getProblemType())
                .mode(a.getMode())
                .errorName(a.getErrorName())
                .severity(a.getSeverity())
                .confidence(a.getConfidence())
                .whatHappened(a.getWhatHappened())
                .whyItHappened(a.getWhyItHappened())
                .rootCause(a.getRootCause())
                .prevention(a.getPrevention())
                .explanationLevel(a.getExplanationLevel())
                .status(a.getStatus())
                .createdAt(a.getCreatedAt())
                .updatedAt(a.getUpdatedAt());

        // Error location
        if (a.getErrorFile() != null || a.getErrorLine() != null || a.getErrorLocationDescription() != null) {
            builder.errorLocation(AnalysisResponse.ErrorLocation.builder()
                    .file(a.getErrorFile())
                    .line(a.getErrorLine())
                    .description(a.getErrorLocationDescription())
                    .build());
        }

        // Suggested fix
        if (a.getSuggestedFixExplanation() != null) {
            builder.suggestedFix(AnalysisResponse.SuggestedFix.builder()
                    .explanation(a.getSuggestedFixExplanation())
                    .originalCode(a.getOriginalCode())
                    .fixedCode(a.getSuggestedFixCode())
                    .build());
        }

        // Probable causes
        if (a.getProbableCauses() != null) {
            builder.probableCauses(a.getProbableCauses().stream()
                    .map(pc -> AnalysisResponse.ProbableCauseDto.builder()
                            .cause(pc.getCause())
                            .confidence(pc.getConfidence())
                            .rank(pc.getRank())
                            .build())
                    .collect(Collectors.toList()));
        }

        // Debugging steps
        if (a.getDebuggingSteps() != null) {
            builder.debuggingSteps(a.getDebuggingSteps().stream()
                    .map(DebuggingStep::getDescription)
                    .collect(Collectors.toList()));
        }

        // Alternative fixes
        if (a.getAlternativeFixes() != null) {
            builder.alternativeFixes(a.getAlternativeFixes().stream()
                    .map(af -> AnalysisResponse.AlternativeFixDto.builder()
                            .fixType(af.getFixType())
                            .description(af.getDescription())
                            .rank(af.getRank())
                            .build())
                    .collect(Collectors.toList()));
        }

        // Related concepts
        if (a.getRelatedConcepts() != null) {
            builder.relatedConcepts(a.getRelatedConcepts().stream()
                    .map(RelatedConcept::getConcept)
                    .collect(Collectors.toList()));
        }

        return builder.build();
    }

    /** Summary response (for list/history, without huge text fields) */
    private AnalysisResponse toSummaryResponse(ErrorAnalysis a) {
        return AnalysisResponse.builder()
                .id(a.getId())
                .language(a.getLanguage())
                .framework(a.getFramework())
                .problemType(a.getProblemType())
                .mode(a.getMode())
                .errorName(a.getErrorName())
                .severity(a.getSeverity())
                .confidence(a.getConfidence())
                .status(a.getStatus())
                .createdAt(a.getCreatedAt())
                .build();
    }
}
