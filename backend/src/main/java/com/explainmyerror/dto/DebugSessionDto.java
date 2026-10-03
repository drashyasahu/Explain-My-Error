package com.explainmyerror.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DebugSessionDto {

    private Long id;
    private String title;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<SessionEntryDto> entries;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class SessionEntryDto {
        private Long id;
        private Long analysisId;
        private Integer stepNumber;
        private String stepStatus;
        private String userInput;
        private String aiSummary;
        private String resolutionNote;
        private LocalDateTime createdAt;
        private AnalysisResponse analysis;
    }

    @Data
    public static class CreateRequest {
        private String title;
        private AnalysisRequest firstStep;
    }

    @Data
    public static class AddStepRequest {
        private AnalysisRequest analysis;
    }
}
