package com.explainmyerror.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Full analysis result returned to the frontend.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AnalysisResponse {

    private Long id;
    private String language;
    private String framework;
    private String problemType;
    private String mode;
    private String errorName;
    private String severity;
    private BigDecimal confidence;

    private String whatHappened;
    private String whyItHappened;
    private String rootCause;

    private ErrorLocation errorLocation;

    private List<ProbableCauseDto> probableCauses;
    private List<String> debuggingSteps;

    private SuggestedFix suggestedFix;
    private List<AlternativeFixDto> alternativeFixes;

    private String prevention;
    private List<String> relatedConcepts;

    private String explanationLevel;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // --- Nested DTOs ---

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ErrorLocation {
        private String file;
        private Integer line;
        private String description;
        private String codeSnippet;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ProbableCauseDto {
        private String cause;
        private BigDecimal confidence;
        private Integer rank;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class SuggestedFix {
        private String explanation;
        private String originalCode;
        private String fixedCode;
        private String whyItWorks;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class AlternativeFixDto {
        private String fixType;  // RECOMMENDED | ALTERNATIVE | QUICK_WORKAROUND
        private String description;
        private Integer rank;
    }
}
