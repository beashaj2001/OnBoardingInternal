import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { 
  Users, 
  BookOpen, 
  BarChart2, 
  Settings, 
  PlusCircle,
  Search,
  Filter,
  ChevronRight,
  Edit,
  Eye,
  UserPlus,
  Award,
  CheckCircle
} from 'lucide-react';
import { getCourses, getLeaderboardData, getTrainerDashboardStats, getRecentTrainees, getAllUserProgress, getTraineeStats, getTraineeAchievements, getTraineeModules } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

interface Trainee {
  id: string;
  name: string;
  email: string;
  avatar: string;
  progress: number;
  completedModules: number;
  totalModules: number;
  lastActive: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  type: string;
  image: string;
  duration: string;
  status: string;
  completionMode: string;
}

interface TrainerStats {
  activeTraineesCount: number;
  activeModulesCount: number;
  averageCompletionPercentage: number;
  totalAssessmentsCount: number;
}

// Trainer Dashboard Component
const TrainerDashboard: React.FC = () => {
  const [trainees, setTrainees] = useState<Trainee[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [trainerStats, setTrainerStats] = useState<TrainerStats>({
    activeTraineesCount: 0,
    activeModulesCount: 0,
    averageCompletionPercentage: 0,
    totalAssessmentsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [coursesResponse, leaderboardResponse, trainerStatsResponse, recentTraineesResponse] = await Promise.all([
          getCourses(),
          getLeaderboardData(),
          getTrainerDashboardStats(),
          getRecentTrainees(),
        ]);
        
        setModules(coursesResponse.data);
        setLeaderboardData(leaderboardResponse.data);
        setTrainerStats(trainerStatsResponse.data);
        setTrainees(recentTraineesResponse.data);

      } catch (error) {
        console.error('Error loading trainer dashboard data:', error);
        setModules([]);
        setLeaderboardData([]);
        setTrainerStats({
          activeTraineesCount: 0,
          activeModulesCount: 0,
          averageCompletionPercentage: 0,
          totalAssessmentsCount: 0,
        });
        setTrainees([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trainer Dashboard</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Manage your training program and monitor trainee progress
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            icon={<UserPlus size={16} />}
            onClick={() => navigate('/trainer/trainees/add')}
          >
            Add Trainee
          </Button>
          <Button 
            icon={<PlusCircle size={16} />}
            onClick={() => navigate('/trainer/modules/create')}
          >
            Create Module
          </Button>
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="flex items-center slide-up" style={{animationDelay: '0.1s'}}>
          <div className="mr-4 p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
            <Users size={24} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Trainees</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{trainerStats.activeTraineesCount}</p>
          </div>
        </Card>
        
        <Card className="flex items-center slide-up" style={{animationDelay: '0.2s'}}>
          <div className="mr-4 p-3 bg-teal-100 dark:bg-teal-900 rounded-full">
            <BookOpen size={24} className="text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Modules</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{trainerStats.activeModulesCount}</p>
          </div>
        </Card>
        
        <Card className="flex items-center slide-up" style={{animationDelay: '0.3s'}}>
          <div className="mr-4 p-3 bg-amber-100 dark:bg-amber-900 rounded-full">
            <BarChart2 size={24} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Completion</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{trainerStats.averageCompletionPercentage}%</p>
          </div>
        </Card>
        
        <Card className="flex items-center slide-up" style={{animationDelay: '0.4s'}}>
          <div className="mr-4 p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
            <Settings size={24} className="text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Assessments</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{trainerStats.totalAssessmentsCount}</p>
          </div>
        </Card>
      </div>

      {/* Recent trainees */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Trainees</h2>
          <Link to="/trainer/trainees" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center">
            View all <ChevronRight size={16} />
          </Link>
        </div>
        
        <Card className="overflow-hidden rounded-lg slide-up" style={{animationDelay: '0.5s'}}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Trainee
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Progress
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Modules
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {trainees.map((trainee) => (
                  <tr key={trainee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-full" src={trainee.avatar} alt={trainee.name} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{trainee.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{trainee.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                        <div 
                          className={`h-2.5 rounded-full ${
                            trainee.progress >= 80 
                              ? 'bg-green-600' 
                              : trainee.progress >= 40 
                                ? 'bg-amber-500' 
                                : 'bg-red-500'
                          }`} 
                          style={{ width: `${trainee.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {trainee.progress}% Complete
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {trainee.completedModules} / {trainee.totalModules}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {trainee.lastActive}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          onClick={() => navigate(`/trainer/trainees/${trainee.id}`)}
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                          onClick={() => navigate(`/trainer/trainees/${trainee.id}/edit`)}
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Module Completion Overview */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Module Completion Overview</h2>
          {/* Potentially add a link to a full Modules management page */}
        </div>
        
        <Card className="overflow-hidden rounded-lg slide-up" style={{animationDelay: '0.6s'}}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Module Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Completion Progress (Trainees)
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-700">
                {/* Map over modules and display completion stats */}
                {modules.map((module) => (
                  <tr key={module.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{module.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{module.duration}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* Placeholder: Replace with actual calculated progress */}
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                        <div 
                          className="h-2.5 rounded-full bg-blue-600" 
                          style={{ width: `${Math.random() * 100}%` }} // Mock progress
                        ></div>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {`${Math.round(Math.random() * 100)}% Trainees Completed`} {/* Mock text */}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                         <button 
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          onClick={() => navigate(`/trainer/modules/${module.id}`)} // Link to module detail/edit
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Trainee Leaderboard */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Trainee Leaderboard</h2>
          <Link to="/leaderboard" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center">
            View all <ChevronRight size={16} />
          </Link>
        </div>
        
        <Card className="overflow-hidden rounded-lg slide-up" style={{animationDelay: '0.7s'}}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16">
                    Rank
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Trainee
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Completed
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Progress
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {leaderboardData.map((entry, index) => (
                  <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">#{index + 1}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-full" src={entry.avatar || 'https://ui-avatars.com/api/?name=' + entry.name} alt={entry.name} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{entry.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{entry.completedModules} / {entry.totalModules}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                        <div 
                          className={`h-2.5 rounded-full ${
                            entry.progress >= 80 
                              ? 'bg-green-600' 
                              : entry.progress >= 40 
                                ? 'bg-amber-500' 
                                : 'bg-red-500'
                          }`} 
                          style={{ width: `${entry.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {entry.progress}% Complete
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600 dark:text-blue-400">{entry.points} pts</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Modules section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Training Modules Overview</h2>
          <Link to="/trainer/modules" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center">
            View all <ChevronRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <Card 
              key={module.id} 
              className="flex flex-col h-full slide-up hover:shadow-lg transition-shadow duration-200" 
              style={{animationDelay: `${0.6 + (index * 0.1)}s`}} // Adjust animation delay as needed
              hover
              onClick={() => navigate(`/trainer/modules/${module.id}`)} // Link to module detail/edit
            >
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden">
                <img 
                  src={module.image} // Assuming module object has an image property
                  alt={module.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex-grow">
                <div className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs rounded-md mb-2">
                  {module.completionMode === 'MANDATORY' ? 'Mandatory' : module.completionMode === 'SELF_LEARNED' ? 'Self Learned' : 'Non Mandatory'}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{module.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{module.description}</p>
                
                {/* Placeholder for Trainee Completion Percentage */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Trainee Completion:</span>
                  {/* Replace with actual calculated percentage */}
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{`${Math.round(Math.random() * 100)}%`}</span>
                </div>

              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// Placeholder Component for Trainee Profile View
const TraineeProfileView: React.FC = () => {
  const { traineeId } = useParams<{ traineeId: string }>();
  const [loading, setLoading] = useState(true);
  const [traineeStats, setTraineeStats] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTraineeData = async () => {
      if (!traineeId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const [statsResponse, achievementsResponse, modulesResponse] = await Promise.all([
          getTraineeStats(traineeId),
          getTraineeAchievements(traineeId),
          getTraineeModules(traineeId)
        ]);
        
        setTraineeStats(statsResponse.data);
        setAchievements(achievementsResponse.data);
        setModules(modulesResponse.data);
      } catch (err) {
        console.error('Error fetching trainee data:', err);
        setError('Failed to load trainee data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTraineeData();
  }, [traineeId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={() => navigate('/trainer')}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trainee Profile</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Detailed view of trainee progress and achievements
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button 
            variant="outline"
            onClick={() => navigate('/trainer')}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="flex items-center slide-up" style={{animationDelay: '0.1s'}}>
          <div className="mr-4 p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
            <BarChart2 size={24} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overall Progress</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{traineeStats?.overallProgress}%</p>
          </div>
        </Card>
        
        <Card className="flex items-center slide-up" style={{animationDelay: '0.2s'}}>
          <div className="mr-4 p-3 bg-amber-100 dark:bg-amber-900 rounded-full">
            <Award size={24} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Badges Earned</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{traineeStats?.badgesEarned} / {traineeStats?.totalBadges}</p>
          </div>
        </Card>
        
        <Card className="flex items-center slide-up" style={{animationDelay: '0.3s'}}>
          <div className="mr-4 p-3 bg-green-100 dark:bg-green-900 rounded-full">
            <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Assessments</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{traineeStats?.completedAssessments}</p>
          </div>
        </Card>
      </div>

      {/* Achievements Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Achievements</h2>
        <Card className="p-6">
          {achievements.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="mr-4 p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <i className={`${achievement.iconClass} text-blue-600 dark:text-blue-400`}></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">{achievement.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-center">No achievements earned yet.</p>
          )}
        </Card>
      </div>

      {/* Module Progress Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Module Progress</h2>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Module
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Progress
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Last Activity
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {modules.map((module) => (
                  <tr key={module.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{module.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{module.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        module.status === 'COMPLETED' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : module.status === 'IN_PROGRESS'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                      }`}>
                        {module.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                        <div 
                          className={`h-2.5 rounded-full ${
                            module.progress >= 80 
                              ? 'bg-green-600' 
                              : module.progress >= 40 
                                ? 'bg-amber-500' 
                                : 'bg-red-500'
                          }`} 
                          style={{ width: `${module.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {module.progress}% Complete
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {module.lastActivity || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Placeholder Component for Trainer Modules View
// This will list all modules with trainee completion percentages
const TrainerModulesView: React.FC = () => {
   const [modules, setModules] = useState<any[]>([]);
   const [allUserProgress, setAllUserProgress] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
     const fetchData = async () => {
       setLoading(true);
       try {
         const [modulesResponse, userProgressResponse] = await Promise.all([
           getCourses(),
           getAllUserProgress(),
         ]);
         setModules(modulesResponse.data);
         setAllUserProgress(userProgressResponse.data);
       } catch (error) {
         console.error("Error fetching data for TrainerModulesView:", error);
         setModules([]);
         setAllUserProgress([]);
       } finally {
         setLoading(false);
       }
     };
     fetchData();
   }, []);

   const calculateCompletionPercentage = (moduleId: string) => {
     const moduleProgressEntries = allUserProgress.filter(up => up.moduleId === moduleId);
     
     // Get unique user IDs who have started this module
     const usersWhoStarted = new Set(moduleProgressEntries.map(up => up.userId));

     // Get unique user IDs who have completed this module
     const usersWhoCompleted = new Set(moduleProgressEntries
       .filter(up => up.status === "COMPLETED")
       .map(up => up.userId)
     );

     // To calculate the percentage of trainees who completed the module,
     // we ideally need the total number of trainees assigned to this module.
     // Since we don't have that data directly from `getAllUserProgress`,
     // and fetching all users might be inefficient for a large number of trainees,
     // we will use the number of unique users who have started the module as the base for calculation.
     // This is a simplification and might not be entirely accurate if some trainees haven't started yet.
     
     const totalRelevantUsers = usersWhoStarted.size;

     if (totalRelevantUsers === 0) return 0; // Avoid division by zero

     return (usersWhoCompleted.size / totalRelevantUsers) * 100;
   };

   if (loading) {
     return (
       <div className="flex items-center justify-center min-h-[50vh]">
         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
       </div>
     );
   }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">All Training Modules Overview</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Overview of all training modules and trainee completion progress.</p>

       <Card className="overflow-hidden rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Module Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Completion Mode
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Completion Progress (Trainees)
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-700">
                {modules.map((module) => {
                    const completionPercentage = calculateCompletionPercentage(module.id);
                    return (
                  <tr key={module.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{module.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{module.duration}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white line-clamp-2">{module.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {module.completionMode === 'MANDATORY' ? 'Mandatory' : module.completionMode === 'SELF_LEARNED' ? 'Self Learned' : 'Non Mandatory'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* Calculate and display actual completion percentage */}
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                        <div 
                          className="h-2.5 rounded-full bg-blue-600" 
                          style={{ width: `${completionPercentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                         {`${Math.round(completionPercentage)}% Trainees Completed`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                         {/* Edit Button - Dummy Functionality */}
                         <button 
                          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                          onClick={() => console.log("Edit Module clicked for:", module.id)} // Dummy edit action
                        >
                          <Edit size={16} />
                        </button>
                         {/* View Button (optional, could link to module details if needed) */}
                         {/* <button 
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          onClick={() => navigate(`/trainer/modules/${module.id}`)}
                        >
                          <Eye size={16} />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        </Card>

    </div>
  );
};

// Trainer Profile Component
const TrainerProfile: React.FC = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false); // Additional loading for data fetch if needed
  const [error, setError] = useState<string | null>(null);

  // Assuming currentUser object from AuthContext contains necessary profile info
  // If more detailed info is needed, you might fetch it here based on currentUser.id
  // useEffect(() => {
  //   const fetchTrainerData = async () => {
  //     if (!currentUser?.id) return;
  //     setLoading(true);
  //     try {
  //       // Example fetch: const response = await api.get(`/users/${currentUser.id}/profile`);
  //       // setProfileData(response.data);
  //     } catch (err) {
  //       setError('Failed to load trainer profile data.');
  //       console.error('Error fetching trainer profile:', err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchTrainerData();
  // }, [currentUser?.id]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (error) {
     return (
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         <div className="text-center">
           <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error</h2>
           <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
         </div>
       </div>
     );
   }

  if (!currentUser) {
    return (
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         <div className="text-center">
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Not Authorized</h2>
           <p className="text-gray-600 dark:text-gray-400 mb-4">Please log in to view this page.</p>
           {/* You might want a login redirect button here */}
         </div>
       </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trainer Profile</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Your personal information
          </p>
        </div>
        {/* Optionally add an edit profile button here */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar and Basic Info */}
        <div className="md:col-span-1">
          <Card className="p-6 flex flex-col items-center text-center">
            <img
              className="h-24 w-24 rounded-full mb-4 object-cover"
              src={currentUser.avatar || `https://ui-avatars.com/api/?name=${currentUser.firstName}+${currentUser.lastName}&background=random&color=fff`}
              alt={currentUser.firstName}
            />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{currentUser.firstName} {currentUser.lastName}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{currentUser.role}</p>
            {/* Optional: Add contact icons/links if needed */}
          </Card>
        </div>

        {/* Right Column: Personal Information Details */}
        <div className="md:col-span-2">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Personal Information</h3>
            <div className="space-y-3">
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="font-medium w-32">Full Name:</span>
                <span>{currentUser.firstName} {currentUser.lastName}</span>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="font-medium w-32">Email:</span>
                <span>{currentUser.email}</span>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="font-medium w-32">Role:</span>
                <span>{currentUser.role}</span>
              </div>
              {/* Assuming department and joinedDate are available on currentUser */}
              {currentUser.department && (
                 <div className="flex items-center text-gray-700 dark:text-gray-300">
                   <span className="font-medium w-32">Department:</span>
                   <span>{currentUser.department}</span>
                 </div>
              )}
               {currentUser.joinedDate && (
                 <div className="flex items-center text-gray-700 dark:text-gray-300">
                   <span className="font-medium w-32">Joined:</span>
                   {/* Format date as needed */}
                   <span>{new Date(currentUser.joinedDate).toLocaleDateString()}</span>
                 </div>
               )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Trainer View that includes routes to all trainer pages
const TrainerView: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<TrainerDashboard />} />
        {/* Route for viewing individual trainee profile - Placeholder component */}
        <Route path="/trainees/:traineeId" element={<TraineeProfileView />} />
        {/* Route for viewing all modules - Placeholder component */}
        <Route path="/modules" element={<TrainerModulesView />} />
        {/* Route for the trainer's own profile */}
        <Route path="/profile" element={<TrainerProfile />} />
        {/* Additional routes would be defined here */}
        <Route path="*" element={
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Under Construction
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This page is currently being developed
            </p>
            <Button as={Link} to="/trainer">
              Return to Trainer Dashboard
            </Button>
          </div>
        } />
      </Routes>
    </Layout>
  );
};

export default TrainerView;