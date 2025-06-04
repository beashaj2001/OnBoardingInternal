package com.onboarding.repository;

import com.onboarding.model.SubModule;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface SubModuleRepository extends MongoRepository<SubModule, String> {

    List<SubModule> findByModule_Id(String moduleId);
}