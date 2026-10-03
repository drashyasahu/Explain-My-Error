package com.explainmyerror.repository;

import com.explainmyerror.entity.FollowUpMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FollowUpMessageRepository extends JpaRepository<FollowUpMessage, Long> {
    List<FollowUpMessage> findByAnalysisIdOrderByCreatedAtAsc(Long analysisId);
}
