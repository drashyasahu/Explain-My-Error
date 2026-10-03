package com.explainmyerror.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "session_entries")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SessionEntry {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private DebugSession session;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "analysis_id")
    private ErrorAnalysis analysis;

    @Column(name = "step_number", nullable = false)
    private Integer stepNumber;

    /**
     * CURRENT | RESOLVED | PARTIALLY_RESOLVED | NEW_ERROR | SAME_ERROR
     */
    @Column(name = "step_status", length = 30)
    @Builder.Default
    private String stepStatus = "CURRENT";

    @Column(name = "user_input", columnDefinition = "TEXT")
    private String userInput;

    @Column(name = "ai_summary", columnDefinition = "TEXT")
    private String aiSummary;

    @Column(name = "resolution_note", columnDefinition = "TEXT")
    private String resolutionNote;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
