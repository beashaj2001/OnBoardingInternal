package com.onboarding.repository;

import com.onboarding.model.Progress;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface ProgressRepository extends MongoRepository<Progress, String> {
    List<Progress> findByUserId(String userId);

    Optional<Progress> findByUserIdAndModuleId(String userId, String moduleId);

    List<Progress> findByStatus(String status);

    List<Progress> findByModuleId(String moduleId);
}