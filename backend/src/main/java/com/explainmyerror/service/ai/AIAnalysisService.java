package com.explainmyerror.service.ai;

import com.explainmyerror.dto.AIAnalysisResult;
import com.explainmyerror.dto.AnalysisRequest;
import com.explainmyerror.entity.ErrorAnalysis;
import com.explainmyerror.entity.FollowUpMessage;
import com.explainmyerror.exception.AIAnalysisException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class AIAnalysisService {

    private final ChatClient chatClient;
    private final PromptTemplateService promptTemplateService;
    private final ObjectMapper objectMapper;

    /**
     * Analyze an error / code submission. Returns structured AI result.
     */
    public AIAnalysisResult analyzeError(AnalysisRequest request) {
        String prompt = promptTemplateService.buildErrorAnalysisPrompt(request);
        log.debug("Sending error analysis prompt to AI (input length={})", request.getInput().length());

        String rawResponse = callAI(prompt);
        log.debug("Raw AI response received (length={})", rawResponse.length());

        return parseAndValidate(rawResponse, "Error analysis");
    }

    /**
     * Explain code without an error.
     */
    public AIAnalysisResult explainCode(AnalysisRequest request) {
        String prompt = promptTemplateService.buildCodeExplanationPrompt(request);
        String rawResponse = callAI(prompt);
        return parseAndValidate(rawResponse, "Code explanation");
    }

    /**
     * Review code quality.
     */
    public AIAnalysisResult reviewCode(AnalysisRequest request) {
        String prompt = promptTemplateService.buildCodeReviewPrompt(request);
        String rawResponse = callAI(prompt);
        return parseAndValidate(rawResponse, "Code review");
    }

    /**
     * Answer a follow-up question in the context of a previous analysis.
     */
    public String answerFollowUp(ErrorAnalysis analysis, List<FollowUpMessage> history, String question) {
        String prompt = promptTemplateService.buildFollowUpPrompt(analysis, history, question);
        log.debug("Follow-up prompt built for analysis id={}", analysis.getId());
        return callAI(prompt);
    }

    /**
     * Compare previous and current states in a debug session step.
     */
    public AIAnalysisResult analyzeDebugStep(AnalysisRequest request, ErrorAnalysis previousAnalysis) {
        String prompt = promptTemplateService.buildDebugStepPrompt(request, previousAnalysis);
        String rawResponse = callAI(prompt);
        return parseAndValidate(rawResponse, "Debug step analysis");
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    private String callAI(String prompt) {
        try {
            return chatClient.prompt()
                    .user(prompt)
                    .call()
                    .content();
        } catch (Exception e) {
            log.error("AI provider call failed: {}", e.getMessage(), e);
            throw new AIAnalysisException("AI service is temporarily unavailable. Please try again in a moment.");
        }
    }

    private AIAnalysisResult parseAndValidate(String rawResponse, String context) {
        try {
            String json = extractJson(rawResponse);
            AIAnalysisResult result = objectMapper.readValue(json, AIAnalysisResult.class);
            validateResult(result);
            return result;
        } catch (AIAnalysisException e) {
            throw e;
        } catch (Exception e) {
            log.error("{}: Failed to parse AI response: {}", context, e.getMessage());
            log.debug("Raw AI response that failed to parse: {}", rawResponse);
            throw new AIAnalysisException(
                "The AI returned an unexpected response format. Please try again or rephrase your input.");
        }
    }

    /**
     * Extract the first JSON object from the AI response (which may contain
     * markdown code fences or extra prose).
     */
    private String extractJson(String response) {
        if (response == null || response.isBlank()) {
            throw new AIAnalysisException("AI returned an empty response.");
        }

        // Try to find JSON inside ```json ... ``` fences first
        Pattern fencedPattern = Pattern.compile("```(?:json)?\\s*(\\{[\\s\\S]*?})\\s*```",
                Pattern.CASE_INSENSITIVE);
        Matcher fencedMatcher = fencedPattern.matcher(response);
        if (fencedMatcher.find()) {
            return fencedMatcher.group(1).trim();
        }

        // Try to find raw JSON object
        int start = response.indexOf('{');
        int end = response.lastIndexOf('}');
        if (start >= 0 && end > start) {
            return response.substring(start, end + 1);
        }

        throw new AIAnalysisException("Could not extract structured JSON from AI response.");
    }

    private void validateResult(AIAnalysisResult result) {
        if (result == null) {
            throw new AIAnalysisException("AI returned a null result.");
        }
        // Clamp confidence to valid range
        if (result.getConfidence() != null) {
            var conf = result.getConfidence();
            if (conf.doubleValue() > 1.0) {
                // LLM sometimes returns 0-100 scale; normalise
                result.setConfidence(conf.movePointLeft(2));
            }
        }
        // Validate severity
        if (result.getSeverity() != null) {
            String s = result.getSeverity().toUpperCase();
            if (!s.equals("LOW") && !s.equals("MEDIUM") && !s.equals("HIGH") && !s.equals("CRITICAL")) {
                result.setSeverity("MEDIUM");
            } else {
                result.setSeverity(s);
            }
        }
    }
}
