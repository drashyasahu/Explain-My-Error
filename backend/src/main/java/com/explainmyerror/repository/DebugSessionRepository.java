package com.explainmyerror.repository;

import com.explainmyerror.entity.DebugSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DebugSessionRepository extends JpaRepository<DebugSession, Long> {
    Page<DebugSession> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    Optional<DebugSession> findByIdAndUserId(Long id, Long userId);
    long countByUserId(Long userId);
    long countByUserIdAndStatus(Long userId, String status);
}
