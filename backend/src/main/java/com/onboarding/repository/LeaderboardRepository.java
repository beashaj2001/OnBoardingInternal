package com.onboarding.repository;

import com.onboarding.model.Leaderboard;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface LeaderboardRepository extends MongoRepository<Leaderboard, String> {
    Optional<Leaderboard> findByUserId(String userId);

    List<Leaderboard> findAllByOrderByScoreDesc();

    List<Leaderboard> findTop10ByOrderByScoreDesc();
}