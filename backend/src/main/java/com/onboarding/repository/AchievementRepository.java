package com.onboarding.repository;

import com.onboarding.model.Achievement;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AchievementRepository extends MongoRepository<Achievement, String> {
    // Add custom queries if needed later
}