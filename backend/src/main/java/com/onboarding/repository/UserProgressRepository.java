package com.onboarding.repository;

import com.onboarding.model.UserProgress;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProgressRepository extends MongoRepository<UserProgress, String> {
    List<UserProgress> findByUserId(String userId);

    long countByUserIdAndStatus(String userId, String status);

    Optional<UserProgress> findByUserIdAndModuleId(String userId, String moduleId);

    List<UserProgress> findAll();
}