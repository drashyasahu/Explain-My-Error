package com.explainmyerror.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "related_concepts")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RelatedConcept {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "analysis_id", nullable = false)
    private ErrorAnalysis analysis;

    @Column(nullable = false, length = 255)
    private String concept;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
