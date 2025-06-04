import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import Card from '../components/common/Card';
import { 
  Award, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Calendar,
  Filter,
  Search
} from 'lucide-react';
import { getLeaderboardData } from '../utils/api.js';
import { useAuth } from '../contexts/AuthContext';

// Define the expected structure of a leaderboard entry from the backend
interface LeaderboardEntry {
  id: string;
  userId: string;
  userName: string;
  score: number;
  completedModules: number;
  totalModules: number;
  lastUpdatedAt: string;
  // Add fields needed for frontend rendering, e.g., avatar, rank
  avatar?: string; // Assuming avatar might be needed and fetched separately or added later
  rank?: number; // Rank will likely be calculated on the frontend based on score
}

const Leaderboard: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('week');
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadLeaderboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getLeaderboardData();
        const leaderboardEntries = response.data.map((entry: any, index: number) => ({
          ...entry,
          rank: index + 1,
        }));
        setEntries(leaderboardEntries);
      } catch (error) {
        console.error('Error loading leaderboard data:', error);
        setError('Failed to load leaderboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadLeaderboard();
  }, [timeRange]);

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-amber-500 text-white';
      case 2: return 'bg-gray-300 text-gray-800';
      case 3: return 'bg-amber-700 text-white';
      default: return 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-red-500 text-center">
            <p className="text-xl font-semibold mb-2">Error</p>
            <p>{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leaderboard</h1>
            <div className="flex space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Score</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {entries.map((entry) => {
                  const isCurrentUser = currentUser?.name === entry.userName;
                  
                  return (
                    <tr 
                      key={entry.id} 
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${isCurrentUser ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getMedalColor(entry.rank || 0)}`}>
                          {entry.rank}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 relative">
                            <img className="h-10 w-10 rounded-full" src={entry.avatar || "https://via.placeholder.com/80"} alt={entry.userName} />
                            {isCurrentUser && (
                              <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full h-4 w-4 border-2 border-white dark:border-gray-800"></div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {entry.userName} {isCurrentUser && <span className="text-xs text-blue-600 dark:text-blue-400">(You)</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {entry.completedModules} / {entry.totalModules} Modules
                        </div>
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(entry.completedModules / entry.totalModules) * 100}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{entry.score} pts</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Leaderboard;