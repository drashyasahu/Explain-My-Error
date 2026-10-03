package com.explainmyerror.controller;

import com.explainmyerror.dto.AnalysisRequest;
import com.explainmyerror.dto.AnalysisResponse;
import com.explainmyerror.dto.ApiResponse;
import com.explainmyerror.service.analysis.AnalysisService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/code")
@RequiredArgsConstructor
public class CodeController {

    private final AnalysisService analysisService;

    @PostMapping("/explain")
    public ResponseEntity<ApiResponse<AnalysisResponse>> explain(
            @Valid @RequestBody AnalysisRequest request,
            @AuthenticationPrincipal UserDetails principal) {
        request.setMode("CODE_EXPLANATION");
        AnalysisResponse result = analysisService.createAnalysis(request, null);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PostMapping("/review")
    public ResponseEntity<ApiResponse<AnalysisResponse>> review(
            @Valid @RequestBody AnalysisRequest request,
            @AuthenticationPrincipal UserDetails principal) {
        request.setMode("CODE_REVIEW");
        AnalysisResponse result = analysisService.createAnalysis(request, null);
        return ResponseEntity.ok(ApiResponse.success(result));
    }
}
