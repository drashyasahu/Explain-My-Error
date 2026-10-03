package com.explainmyerror.controller;

import com.explainmyerror.dto.ApiResponse;
import com.explainmyerror.exception.AccessDeniedException;
import com.explainmyerror.exception.NotFoundException;
import com.explainmyerror.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
public class StatisticsController {

    private final ErrorAnalysisRepository analysisRepo;
    private final DebugSessionRepository sessionRepo;
    private final UserRepository userRepo;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStatistics(
            @AuthenticationPrincipal UserDetails principal) {

        Long userId = requireUserId(principal);

        long total = analysisRepo.totalForUser(userId);
        long sessions = sessionRepo.countByUserId(userId);
        long resolvedSessions = sessionRepo.countByUserIdAndStatus(userId, "RESOLVED");

        List<Object[]> byLanguage = analysisRepo.countByLanguageForUser(userId);
        List<Object[]> bySeverity = analysisRepo.countBySeverityForUser(userId);

        List<Map<String, Object>> languageStats = new ArrayList<>();
        for (Object[] row : byLanguage) {
            languageStats.add(Map.of("language", row[0] != null ? row[0] : "Unknown", "count", row[1]));
        }

        List<Map<String, Object>> severityStats = new ArrayList<>();
        for (Object[] row : bySeverity) {
            severityStats.add(Map.of("severity", row[0] != null ? row[0] : "Unknown", "count", row[1]));
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalAnalyses", total);
        stats.put("totalDebugSessions", sessions);
        stats.put("resolvedDebugSessions", resolvedSessions);
        stats.put("byLanguage", languageStats);
        stats.put("bySeverity", severityStats);

        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    private Long requireUserId(UserDetails principal) {
        if (principal == null) throw new AccessDeniedException("Authentication required.");
        return userRepo.findByEmail(principal.getUsername())
                .map(u -> u.getId())
                .orElseThrow(() -> new NotFoundException("User not found"));
    }
}
