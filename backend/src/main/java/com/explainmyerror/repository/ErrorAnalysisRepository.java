package com.explainmyerror.repository;

import com.explainmyerror.entity.ErrorAnalysis;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ErrorAnalysisRepository extends JpaRepository<ErrorAnalysis, Long> {

    Page<ErrorAnalysis> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    Optional<ErrorAnalysis> findByIdAndUserId(Long id, Long userId);

    Page<ErrorAnalysis> findByUserIdAndLanguageIgnoreCaseOrderByCreatedAtDesc(
            Long userId, String language, Pageable pageable);

    Page<ErrorAnalysis> findByUserIdAndSeverityOrderByCreatedAtDesc(
            Long userId, String severity, Pageable pageable);

    @Query("""
        SELECT a FROM ErrorAnalysis a
        WHERE a.user.id = :userId
          AND (:language IS NULL OR LOWER(a.language) = LOWER(:language))
          AND (:severity IS NULL OR a.severity = :severity)
          AND (:mode IS NULL OR a.mode = :mode)
          AND (
            :search IS NULL
            OR LOWER(a.errorName) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(a.language) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(a.framework) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(a.inputText) LIKE LOWER(CONCAT('%', :search, '%'))
          )
        ORDER BY a.createdAt DESC
        """)
    Page<ErrorAnalysis> search(
            @Param("userId") Long userId,
            @Param("language") String language,
            @Param("severity") String severity,
            @Param("mode") String mode,
            @Param("search") String search,
            Pageable pageable);

    @Query("SELECT COUNT(a) FROM ErrorAnalysis a WHERE a.user.id = :userId AND a.createdAt >= :since")
    long countByUserIdAndCreatedAtAfter(@Param("userId") Long userId, @Param("since") LocalDateTime since);

    List<ErrorAnalysis> findTop5ByUserIdOrderByCreatedAtDesc(Long userId);

    // Statistics queries
    @Query("SELECT a.language, COUNT(a) FROM ErrorAnalysis a WHERE a.user.id = :userId GROUP BY a.language ORDER BY COUNT(a) DESC")
    List<Object[]> countByLanguageForUser(@Param("userId") Long userId);

    @Query("SELECT a.severity, COUNT(a) FROM ErrorAnalysis a WHERE a.user.id = :userId GROUP BY a.severity")
    List<Object[]> countBySeverityForUser(@Param("userId") Long userId);

    @Query("SELECT COUNT(a) FROM ErrorAnalysis a WHERE a.user.id = :userId")
    long totalForUser(@Param("userId") Long userId);
}
