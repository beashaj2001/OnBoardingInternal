import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';
import { 
  BookOpen, 
  Award, 
  BarChart2, 
  Clock, 
  CheckCircle, 
  ArrowUpRight,
  PlayCircle,
  MessageSquare
} from 'lucide-react';
import { getTraineeModules, getProgress, getTraineeStats, getLeaderboardData } from '../utils/api';

interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  image: string;
  type: '3d' | 'video' | 'text';
  completionPercentage: number;
}

const Dashboard: React.FC = () => {
  const { currentUser, isTrainer, isTrainee } = useAuth();
  const [recentModules, setRecentModules] = useState<Module[]>([]);
  const [traineeStats, setTraineeStats] = useState({ 
    userName: '',
    overallProgress: 0,
    badgesEarned: 0,
    totalBadges: 0,
    completedAssessments: 0,
    completedModulesCount: 0,
    inProgressModulesCount: 0,
    notStartedModulesCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Simulate API calls to fetch data
        console.log("Current User: ")
        console.log(currentUser);
        const modules = await getTraineeModules(currentUser?.id || '');
        console.log("Modules: ");
        console.log(modules);
        const userProgress = await getProgress(currentUser?.id || '');
        const traineeStatsData = await getTraineeStats(currentUser?.id || '');
        console.log(traineeStatsData);
        
        setRecentModules(modules.data.slice(0, 3));
        setTraineeStats(traineeStatsData.data);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [currentUser]);

  const renderProgressRing = (percent: number) => {
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;
    
    return (
      <svg className="w-16 h-16" viewBox="0 0 48 48">
        <circle
          className="text-gray-200 dark:text-gray-700"
          strokeWidth="4"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="24"
          cy="24"
        />
        <circle
          className="text-blue-900 dark:text-blue-500 progress-ring-circle"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="24"
          cy="24"
        />
        <text
          x="50%"
          y="50%"
          dy=".3em"
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          fill="currentColor"
          className="text-gray-700 dark:text-gray-300"
        >
          {percent}%
        </text>
      </svg>
    );
  };

  const getModuleIcon = (type: '3d' | 'video' | 'text') => {
    switch (type) {
      case '3d':
        return <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full"><BookOpen size={20} className="text-blue-900 dark:text-blue-300" /></div>;
      case 'video':
        return <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full"><PlayCircle size={20} className="text-purple-900 dark:text-purple-300" /></div>;
      case 'text':
        return <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full"><MessageSquare size={20} className="text-green-900 dark:text-green-300" /></div>;
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

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {traineeStats.userName}</h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Here's an overview of your learning progress
              </p>
            </div>
            
            {isTrainer() && (
              <div className="mt-4 md:mt-0">
                <Button 
                  as={Link} 
                  to="/trainer"
                  icon={<ArrowUpRight size={16} />}
                >
                  Go to Trainer Console
                </Button>
              </div>
            )}
            
            {isTrainee() && (
              <div className="mt-4 md:mt-0">
                <Button 
                  as={Link} 
                  to="/trainee"
                  icon={<ArrowUpRight size={16} />}
                >
                  Continue Training
                </Button>
              </div>
            )}
          </div>

          {/* Progress summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="flex items-center slide-up" style={{animationDelay: '0.1s'}}>
              <div className="mr-4 p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{traineeStats.completedModulesCount}</p>
              </div>
            </Card>
            
            <Card className="flex items-center slide-up" style={{animationDelay: '0.2s'}}>
              <div className="mr-4 p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Clock size={24} className="text-blue-900 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{traineeStats.inProgressModulesCount}</p>
              </div>
            </Card>
            
            <Card className="flex items-center slide-up" style={{animationDelay: '0.3s'}}>
              <div className="mr-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
                <BookOpen size={24} className="text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Not Started</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{traineeStats.notStartedModulesCount}</p>
              </div>
            </Card>
          </div>

          {/* Recent Activity and Achievements */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Modules</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recentModules.map((module, index) => (
                  <Card 
                    key={module.id} 
                    className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200 slide-up"
                    style={{animationDelay: `${0.1 * (index + 1)}s`}}
                    hover
                    onClick={() => {/* Navigate to module */}}
                  >
                    <div className="flex items-start mb-4">
                      {getModuleIcon(module.type)}
                      <div className="ml-3 flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{module.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{module.duration}</p>
                      </div>
                      {renderProgressRing(isNaN(module.completionPercentage) ? 0 : module.completionPercentage)}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">{module.description}</p>
                    <div className="mt-auto">
                      <Button 
                        variant="outline" 
                        size="sm"
                        fullWidth
                        as={Link}
                        to={`/modules/${module.id}`}
                        icon={<PlayCircle size={16} />}
                      >
                        {module.completionPercentage > 0 ? 'Continue' : 'Start'} Module
                      </Button>
                    </div>
                  </Card>
                ))}
                
                <Link to="/modules" className="flex justify-center items-center h-full p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-blue-900 dark:hover:border-blue-600 transition-colors duration-200 slide-up" style={{animationDelay: '0.4s'}}>
                  <div className="text-center">
                    <BookOpen size={24} className="mx-auto text-gray-400 dark:text-gray-600" />
                    <p className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-300">View All Modules</p>
                  </div>
                </Link>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Leaderboard</h2>
                <Link to="/leaderboard" className="text-sm text-blue-900 dark:text-blue-400 hover:underline">
                  View all
                </Link>
              </div>
              <Card className="slide-up" style={{animationDelay: '0.5s'}}>
                <div className="space-y-4">
                  <div className="flex items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex-shrink-0 relative">
                      <div className="w-8 h-8 flex items-center justify-center bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded-full">
                        <Award size={16} />
                      </div>
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">1</span>
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Emily Johnson</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">98 pts</p>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex-shrink-0 relative">
                      <div className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full">
                        <Award size={16} />
                      </div>
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-gray-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">2</span>
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {currentUser?.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">87 pts</p>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                        <div className="bg-gray-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex-shrink-0 relative">
                      <div className="w-8 h-8 flex items-center justify-center bg-amber-100 dark:bg-amber-900 opacity-70 text-amber-800 dark:text-amber-200 rounded-full">
                        <Award size={16} />
                      </div>
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-amber-700 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">3</span>
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Alex Chen</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">82 pts</p>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                        <div className="bg-amber-700 h-2 rounded-full" style={{ width: '82%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* More leaderboard entries would go here */}
                </div>
              </Card>
              
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Your Stats</h2>
              <Card className="slide-up" style={{animationDelay: '0.6s'}}>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="mr-3 p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                      <BarChart2 size={20} className="text-blue-900 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Overall Progress</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {traineeStats.overallProgress}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="mr-3 p-2 bg-amber-100 dark:bg-amber-900 rounded-full">
                      <Award size={20} className="text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Badges Earned</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{traineeStats.badgesEarned} / {traineeStats.totalBadges}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="mr-3 p-2 bg-green-100 dark:bg-green-900 rounded-full">
                      <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Completed Assessments</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{traineeStats.completedAssessments}</p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    fullWidth
                    as={Link}
                    to="/profile"
                  >
                    View Full Profile
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;