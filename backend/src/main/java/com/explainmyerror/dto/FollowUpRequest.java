package com.explainmyerror.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class FollowUpRequest {
    @NotBlank(message = "Message is required")
    @Size(max = 5000, message = "Message too long")
    private String message;
}
