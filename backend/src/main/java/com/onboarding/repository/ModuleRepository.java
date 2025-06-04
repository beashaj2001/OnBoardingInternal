package com.onboarding.repository;

import com.onboarding.model.Module;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ModuleRepository extends MongoRepository<Module, String> {
    List<Module> findByType(String type);

    List<Module> findBySkillsContaining(String skill);

    List<Module> findBySkillsIn(List<String> skills);

    List<Module> findByIsMandatoryTrue();

    long count();

    // Add custom queries if needed later
}