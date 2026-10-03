package com.explainmyerror.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "error_analyses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErrorAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(length = 50)
    private String language;

    @Column(length = 100)
    private String framework;

    @Column(name = "problem_type", length = 50)
    private String problemType;

    @Column(name = "input_text", nullable = false, columnDefinition = "TEXT")
    private String inputText;

    @Column(name = "expected_behavior", columnDefinition = "TEXT")
    private String expectedBehavior;

    @Column(name = "explanation_level", length = 20)
    @Builder.Default
    private String explanationLevel = "INTERMEDIATE";

    @Column(name = "error_name", length = 255)
    private String errorName;

    @Column(length = 20)
    private String severity;

    @Column(precision = 5, scale = 2)
    private BigDecimal confidence;

    @Column(name = "what_happened", columnDefinition = "TEXT")
    private String whatHappened;

    @Column(name = "why_it_happened", columnDefinition = "TEXT")
    private String whyItHappened;

    @Column(name = "root_cause", columnDefinition = "TEXT")
    private String rootCause;

    @Column(name = "error_file", length = 500)
    private String errorFile;

    @Column(name = "error_line")
    private Integer errorLine;

    @Column(name = "error_location_description", columnDefinition = "TEXT")
    private String errorLocationDescription;

    @Column(name = "suggested_fix_explanation", columnDefinition = "TEXT")
    private String suggestedFixExplanation;

    @Column(name = "suggested_fix_code", columnDefinition = "TEXT")
    private String suggestedFixCode;

    @Column(name = "original_code", columnDefinition = "TEXT")
    private String originalCode;

    @Column(columnDefinition = "TEXT")
    private String prevention;

    @Column(length = 20)
    @Builder.Default
    private String status = "COMPLETED";

    @Column(length = 20)
    @Builder.Default
    private String mode = "ERROR_ANALYSIS";

    @Column(name = "raw_ai_response", columnDefinition = "TEXT")
    private String rawAiResponse;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "analysis", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @OrderBy("rank ASC")
    private List<ProbableCause> probableCauses = new ArrayList<>();

    @OneToMany(mappedBy = "analysis", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @OrderBy("stepNumber ASC")
    private List<DebuggingStep> debuggingSteps = new ArrayList<>();

    @OneToMany(mappedBy = "analysis", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @OrderBy("rank ASC")
    private List<AlternativeFix> alternativeFixes = new ArrayList<>();

    @OneToMany(mappedBy = "analysis", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<RelatedConcept> relatedConcepts = new ArrayList<>();

    @OneToMany(mappedBy = "analysis", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @OrderBy("createdAt ASC")
    private List<FollowUpMessage> followUpMessages = new ArrayList<>();
}
