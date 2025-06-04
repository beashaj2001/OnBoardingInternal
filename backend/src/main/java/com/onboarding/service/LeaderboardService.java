package com.onboarding.service;

import com.onboarding.dto.LeaderboardDTO;
import java.util.List;

/**
 * Service interface for managing leaderboard data
 */
public interface LeaderboardService {
    List<LeaderboardDTO> getAllLeaderboards();

    List<LeaderboardDTO> getTopLeaderboards();

    LeaderboardDTO getLeaderboardByUserId(String userId);

    LeaderboardDTO createOrUpdateLeaderboard(LeaderboardDTO leaderboardDTO);

    void deleteLeaderboard(String id);
}