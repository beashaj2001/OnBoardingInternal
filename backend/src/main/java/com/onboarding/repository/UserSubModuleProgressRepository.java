package com.onboarding.repository;

import com.onboarding.model.UserSubModuleProgress;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;
import java.util.List;

public interface UserSubModuleProgressRepository extends MongoRepository<UserSubModuleProgress, String> {
    Optional<UserSubModuleProgress> findByUser_IdAndSubModule_Id(String userId, String submoduleId);

    List<UserSubModuleProgress> findByUser_IdAndSubModule_Module_Id(String userId, String moduleId);

    List<UserSubModuleProgress> findByUser_Id(String userId);
}