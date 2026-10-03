package com.explainmyerror.controller;

import com.explainmyerror.dto.*;
import com.explainmyerror.entity.FollowUpMessage;
import com.explainmyerror.repository.UserRepository;
import com.explainmyerror.security.JwtUtil;
import com.explainmyerror.service.analysis.AnalysisService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/analyses")
@RequiredArgsConstructor
public class AnalysisController {

    private final AnalysisService analysisService;
    private final UserRepository userRepo;

    /** Create a new analysis — accessible without authentication (guest mode) */
    @PostMapping
    public ResponseEntity<ApiResponse<AnalysisResponse>> create(
            @Valid @RequestBody AnalysisRequest request,
            @AuthenticationPrincipal UserDetails principal) {

        Long userId = extractUserId(principal);
        AnalysisResponse result = analysisService.createAnalysis(request, userId);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    /** List analyses (requires auth) */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<AnalysisResponse>>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) String severity,
            @RequestParam(required = false) String mode,
            @RequestParam(required = false) String search,
            @AuthenticationPrincipal UserDetails principal) {

        Long userId = requireUserId(principal);
        Page<AnalysisResponse> results = analysisService.listAnalyses(
                userId, language, severity, mode, search, page, size);
        return ResponseEntity.ok(ApiResponse.success(results));
    }

    /** Get a single analysis */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AnalysisResponse>> get(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails principal) {

        Long userId = extractUserId(principal);
        return ResponseEntity.ok(ApiResponse.success(analysisService.getAnalysis(id, userId)));
    }

    /** Delete an analysis */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails principal) {

        Long userId = requireUserId(principal);
        analysisService.deleteAnalysis(id, userId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    /** Add a follow-up question */
    @PostMapping("/{id}/follow-up")
    public ResponseEntity<ApiResponse<Map<String, String>>> followUp(
            @PathVariable Long id,
            @Valid @RequestBody FollowUpRequest request,
            @AuthenticationPrincipal UserDetails principal) {

        Long userId = extractUserId(principal);
        String answer = analysisService.addFollowUp(id, userId, request.getMessage());
        return ResponseEntity.ok(ApiResponse.success(Map.of("answer", answer)));
    }

    /** Get follow-up history */
    @GetMapping("/{id}/follow-up")
    public ResponseEntity<ApiResponse<List<Map<String, String>>>> getFollowUpHistory(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails principal) {

        Long userId = extractUserId(principal);
        List<FollowUpMessage> history = analysisService.getFollowUpHistory(id, userId);
        List<Map<String, String>> result = history.stream()
                .map(m -> Map.of("role", m.getRole(), "message", m.getMessage(),
                        "createdAt", m.getCreatedAt().toString()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    /** Recent analyses for dashboard */
    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<AnalysisResponse>>> recent(
            @AuthenticationPrincipal UserDetails principal) {
        Long userId = requireUserId(principal);
        return ResponseEntity.ok(ApiResponse.success(analysisService.getRecentAnalyses(userId)));
    }

    // -------------------------------------------------------------------------
    private Long extractUserId(UserDetails principal) {
        if (principal == null) return null;
        return userRepo.findByEmail(principal.getUsername())
                .map(u -> u.getId()).orElse(null);
    }

    private Long requireUserId(UserDetails principal) {
        if (principal == null) throw new com.explainmyerror.exception.AccessDeniedException("Authentication required.");
        return userRepo.findByEmail(principal.getUsername())
                .map(u -> u.getId())
                .orElseThrow(() -> new com.explainmyerror.exception.NotFoundException("User not found"));
    }
}
