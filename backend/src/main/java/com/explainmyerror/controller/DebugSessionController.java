package com.explainmyerror.controller;

import com.explainmyerror.dto.*;
import com.explainmyerror.exception.AccessDeniedException;
import com.explainmyerror.exception.NotFoundException;
import com.explainmyerror.repository.UserRepository;
import com.explainmyerror.service.debug.DebugSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/debug-sessions")
@RequiredArgsConstructor
public class DebugSessionController {

    private final DebugSessionService sessionService;
    private final UserRepository userRepo;

    @PostMapping
    public ResponseEntity<ApiResponse<DebugSessionDto>> create(
            @RequestBody DebugSessionDto.CreateRequest request,
            @AuthenticationPrincipal UserDetails principal) {

        Long userId = requireUserId(principal);
        DebugSessionDto session = sessionService.createSession(
                request.getTitle(), request.getFirstStep(), userId);
        return ResponseEntity.ok(ApiResponse.success(session));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<DebugSessionDto>>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserDetails principal) {

        Long userId = requireUserId(principal);
        return ResponseEntity.ok(ApiResponse.success(sessionService.listSessions(userId, page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DebugSessionDto>> get(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails principal) {

        Long userId = requireUserId(principal);
        return ResponseEntity.ok(ApiResponse.success(sessionService.getSession(id, userId)));
    }

    @PostMapping("/{id}/steps")
    public ResponseEntity<ApiResponse<DebugSessionDto>> addStep(
            @PathVariable Long id,
            @RequestBody DebugSessionDto.AddStepRequest request,
            @AuthenticationPrincipal UserDetails principal) {

        Long userId = requireUserId(principal);
        return ResponseEntity.ok(ApiResponse.success(
                sessionService.addStep(id, request.getAnalysis(), userId)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails principal) {

        Long userId = requireUserId(principal);
        sessionService.deleteSession(id, userId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    private Long requireUserId(UserDetails principal) {
        if (principal == null) throw new AccessDeniedException("Authentication required.");
        return userRepo.findByEmail(principal.getUsername())
                .map(u -> u.getId())
                .orElseThrow(() -> new NotFoundException("User not found"));
    }
}
