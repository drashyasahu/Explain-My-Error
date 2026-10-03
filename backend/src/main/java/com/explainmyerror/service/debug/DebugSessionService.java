package com.explainmyerror.service.debug;

import com.explainmyerror.dto.AnalysisRequest;
import com.explainmyerror.dto.DebugSessionDto;
import com.explainmyerror.entity.*;
import com.explainmyerror.exception.AccessDeniedException;
import com.explainmyerror.exception.NotFoundException;
import com.explainmyerror.repository.*;
import com.explainmyerror.service.ai.AIAnalysisService;
import com.explainmyerror.service.analysis.AnalysisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DebugSessionService {

    private final DebugSessionRepository sessionRepo;
    private final UserRepository userRepo;
    private final ErrorAnalysisRepository analysisRepo;
    private final AnalysisService analysisService;
    private final AIAnalysisService aiService;

    @Transactional
    public DebugSessionDto createSession(String title, AnalysisRequest firstStep, Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        DebugSession session = DebugSession.builder()
                .user(user).title(title).status("ACTIVE").build();
        session = sessionRepo.save(session);

        // Create the first analysis and attach it
        var analysis = analysisService.createAnalysis(firstStep, userId);
        ErrorAnalysis analysisEntity = analysisRepo.findById(analysis.getId())
                .orElseThrow();

        SessionEntry entry = SessionEntry.builder()
                .session(session)
                .analysis(analysisEntity)
                .stepNumber(1)
                .stepStatus("CURRENT")
                .userInput(firstStep.getInput())
                .aiSummary(analysisEntity.getWhatHappened())
                .build();
        session.getEntries().add(entry);
        session = sessionRepo.save(session);

        log.info("Debug session created id={} userId={}", session.getId(), userId);
        return toDto(session);
    }

    @Transactional
    public DebugSessionDto addStep(Long sessionId, AnalysisRequest request, Long userId) {
        DebugSession session = findAndAuthorise(sessionId, userId);
        if ("RESOLVED".equals(session.getStatus())) {
            throw new IllegalStateException("This debug session is already resolved.");
        }

        // Get the previous (most recent) step's analysis
        SessionEntry previousEntry = session.getEntries().stream()
                .max((a, b) -> a.getStepNumber() - b.getStepNumber())
                .orElseThrow();

        // Mark previous as no longer CURRENT
        previousEntry.setStepStatus("APPLIED");

        // Run debug step analysis comparing to previous
        var aiResult = aiService.analyzeDebugStep(request, previousEntry.getAnalysis());

        // Create new analysis
        var newAnalysisResponse = analysisService.createAnalysis(request, userId);
        ErrorAnalysis newAnalysis = analysisRepo.findById(newAnalysisResponse.getId()).orElseThrow();

        // Determine step status from AI
        String stepStatus = aiResult.getResolutionStatus() != null
                ? aiResult.getResolutionStatus() : "CURRENT";

        SessionEntry newEntry = SessionEntry.builder()
                .session(session)
                .analysis(newAnalysis)
                .stepNumber(previousEntry.getStepNumber() + 1)
                .stepStatus(stepStatus)
                .userInput(request.getInput())
                .aiSummary(aiResult.getWhatHappened())
                .resolutionNote(aiResult.getResolutionNote())
                .build();
        session.getEntries().add(newEntry);

        // Update session status if resolved
        if ("RESOLVED".equals(stepStatus)) {
            session.setStatus("RESOLVED");
        }

        session = sessionRepo.save(session);
        return toDto(session);
    }

    @Transactional(readOnly = true)
    public Page<DebugSessionDto> listSessions(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return sessionRepo.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::toDto);
    }

    @Transactional(readOnly = true)
    public DebugSessionDto getSession(Long sessionId, Long userId) {
        return toDto(findAndAuthorise(sessionId, userId));
    }

    @Transactional
    public void deleteSession(Long sessionId, Long userId) {
        DebugSession session = findAndAuthorise(sessionId, userId);
        sessionRepo.delete(session);
    }

    private DebugSession findAndAuthorise(Long sessionId, Long userId) {
        DebugSession session = sessionRepo.findById(sessionId)
                .orElseThrow(() -> new NotFoundException("Debug session not found: " + sessionId));
        if (session.getUser() != null && !session.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("You do not have access to this debug session.");
        }
        return session;
    }

    private DebugSessionDto toDto(DebugSession s) {
        List<DebugSessionDto.SessionEntryDto> entries = s.getEntries().stream()
                .map(e -> DebugSessionDto.SessionEntryDto.builder()
                        .id(e.getId())
                        .analysisId(e.getAnalysis() != null ? e.getAnalysis().getId() : null)
                        .stepNumber(e.getStepNumber())
                        .stepStatus(e.getStepStatus())
                        .userInput(e.getUserInput())
                        .aiSummary(e.getAiSummary())
                        .resolutionNote(e.getResolutionNote())
                        .createdAt(e.getCreatedAt())
                        .analysis(e.getAnalysis() != null ? analysisService.toResponse(e.getAnalysis()) : null)
                        .build())
                .collect(Collectors.toList());

        return DebugSessionDto.builder()
                .id(s.getId())
                .title(s.getTitle())
                .status(s.getStatus())
                .createdAt(s.getCreatedAt())
                .updatedAt(s.getUpdatedAt())
                .entries(entries)
                .build();
    }
}
