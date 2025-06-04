package com.onboarding.repository;

import com.onboarding.model.UserModuleProgress;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface UserModuleProgressRepository extends MongoRepository<UserModuleProgress, String> {
    Optional<UserModuleProgress> findByUser_IdAndModule_Id(String userId, String moduleId);

    List<UserModuleProgress> findByUser_Id(String userId);
}