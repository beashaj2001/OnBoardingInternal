package com.onboarding.repository;

import com.onboarding.model.UserQuiz;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserQuizRepository extends MongoRepository<UserQuiz, String> {
    List<UserQuiz> findByUserId(String userId);

    long countByUserIdAndCompleted(String userId, boolean completed);

    Optional<UserQuiz> findByUserIdAndQuizId(String userId, String quizId);

    long countByCompleted(boolean completed);
}