package com.explainmyerror.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AnalysisRequest {

    /** Language or "AUTO" */
    private String language = "AUTO";

    private String framework;

    private String problemType;

    /** The mode: ERROR_ANALYSIS, CODE_EXPLANATION, CODE_REVIEW */
    private String mode = "ERROR_ANALYSIS";

    @NotBlank(message = "Input text is required")
    @Size(max = 50000, message = "Input is too large. Maximum 50,000 characters allowed.")
    private String input;

    private String expectedBehavior;

    /** BEGINNER | INTERMEDIATE | ADVANCED */
    private String explanationLevel = "INTERMEDIATE";
}
