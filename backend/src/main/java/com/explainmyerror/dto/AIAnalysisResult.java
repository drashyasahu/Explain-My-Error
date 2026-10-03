package com.explainmyerror.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * Internal model representing the structured JSON returned by the LLM.
 * This is parsed and validated before being persisted or returned to the frontend.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIAnalysisResult {

    private String language;
    private String technology;
    private String problemType;
    private String errorName;
    private String severity;          // LOW | MEDIUM | HIGH | CRITICAL
    private BigDecimal confidence;    // 0.0 – 1.0

    private String whatHappened;
    private String whyItHappened;
    private String rootCause;

    private ErrorLocationDto errorLocation;

    private List<ProbableCauseDto> probableCauses;
    private List<String> debuggingSteps;

    private SuggestedFixDto suggestedFix;
    private List<AlternativeFixDto> alternativeFixes;

    private String prevention;
    private List<String> relatedConcepts;

    // For code explanation / review modes
    private String codeExplanation;
    private CodeQualityDto codeQuality;

    // Debug session comparison
    private String resolutionStatus;   // RESOLVED | PARTIALLY_RESOLVED | NEW_ERROR | SAME_ERROR
    private String resolutionNote;

    // --- Nested DTOs ---

    @Data @NoArgsConstructor @AllArgsConstructor @Builder @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ErrorLocationDto {
        private String file;
        private Integer line;
        private String description;
        private String codeSnippet;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ProbableCauseDto {
        private String cause;
        private BigDecimal confidence;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder @JsonIgnoreProperties(ignoreUnknown = true)
    public static class SuggestedFixDto {
        private String explanation;
        private String originalCode;
        private String fixedCode;
        private String whyItWorks;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AlternativeFixDto {
        private String fixType;
        private String description;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CodeQualityDto {
        private Integer score;
        private String readability;
        private String maintainability;
        private List<String> codeSmells;
        private List<String> improvements;
        private List<String> securityConcerns;
    }
}
