package com.explainmyerror.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "probable_causes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProbableCause {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "analysis_id", nullable = false)
    private ErrorAnalysis analysis;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String cause;

    @Column(precision = 5, scale = 2)
    private BigDecimal confidence;

    @Column(nullable = false)
    private Integer rank;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
