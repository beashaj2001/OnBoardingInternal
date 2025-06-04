import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ModuleRoadmap from '../components/features/ModuleRoadmap';
import { 
  BookOpen, 
  Award,
  CheckCircle,
  Clock,
  PlayCircle,
  MessageSquare,
  Filter,
  Search,
  ChevronRight,
  ArrowRight,
  Star,
  BarChart2
} from 'lucide-react';
import { getCourses, getModuleById, getProgress, getTraineeAchievements, getTraineeModules, getTraineeStats, getQuizById, submitQuiz, completeSubModule } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import ChatbotInterface from '../components/features/ChatbotInterface';
import SubModuleContent from '../components/features/SubModuleContent';
import QuizComponent from '../components/features/QuizComponent';
import VisionStatement from './VisionStatement';

interface Resource {
  title: string;
  description: string;
  type: string;
  url: string;
}

interface UserSubModuleView {
  id: string;
  title: string;
  type: '3d' | 'video' | 'text';
  duration?: string; // Made optional as per backend DTO
  videoUrl?: string;
  thumbnail?: string;
  resources?: Resource[]; // Using the new Resource interface
  // User Progress Fields
  userProgressId?: string;
  completionPercentage?: number; // Submodule completion for the user
  status: 'completed' | 'locked' | 'in-progress'; // User's status for the submodule
  lastAccessedAt?: string; // Using String for simplicity
  videoProgress?: number; // Specific progress for video submodules
  contentProgress?: string; // Specific progress for text/other content types
}

interface UserModuleView {
  id: string;
  title: string;
  type: '3d' | 'video' | 'text'; // Type from backend
  image: string;
  description: string;
  duration?: string; // Made optional as per backend DTO
  displayTag?: string; // Added displayTag
  completionMode?: string; // Added completionMode
  // User Progress Fields
  userProgressId?: string;
  completionPercentage?: number; // Overall module completion for the user
  status?: 'completed' | 'locked' | 'in-progress'; // User's status for the module - Make type more specific
  lastAccessedAt?: string; // Using String for simplicity
  // Assessment Fields
  quizId?: string;
  assessmentCompleted?: boolean;
  assessmentScore?: number;

  subModules?: UserSubModuleView[]; // Submodules with user progress
}

interface Progress {
  completed: number;
  inProgress: number;
  notStarted: number;
}

interface TraineeStats {
  overallProgress: number;
  badgesEarned: number;
  totalBadges: number;
  completedAssessments: number;
  completedModulesCount: number;
  inProgressModulesCount: number;
  notStartedModulesCount: number;
  userName?: string; // Added user name
}

const mockModulesWithSections: UserModuleView[] = [
  {
    id: '1',
    title: 'Safety Training',
    type: 'video',
    image: '/images/safety.jpg',
    completionPercentage: 75,
    description: 'Essential safety protocols and procedures',
    duration: '2 hours',
    subModules: [
      {
        id: '1-1',
        title: 'Introduction to Safety',
        type: 'video',
        duration: '30 mins',
        completionPercentage: 100,
        videoUrl: '/videos/safety-intro.mp4',
        thumbnail: '/images/safety-intro.jpg',
        status: 'completed'
      }
    ]
  }
];

// Trainee Dashboard Component
const TraineeDashboard: React.FC = () => {
  const [modules, setModules] = useState<UserModuleView[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [traineeStats, setTraineeStats] = useState<TraineeStats>({
    overallProgress: 0,
    badgesEarned: 0,
    totalBadges: 0,
    completedAssessments: 0,
    completedModulesCount: 0,
    inProgressModulesCount: 0,
    notStartedModulesCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [modulesResponse, achievementsResponse, statsResponse] = await Promise.all([
          getTraineeModules(currentUser?.id || ''),
          getTraineeAchievements(currentUser?.id || ''),
          getTraineeStats(currentUser?.id || ''),
        ]);
        
        setModules(modulesResponse.data);
        console.log('Modules data set to state:', modulesResponse.data);
        setAchievements(achievementsResponse.data);
        setTraineeStats(statsResponse.data);
      } catch (error) {
        console.error('Error loading trainee dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser?.id) {
    loadData();
    }
  }, [currentUser?.id]);

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Training</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Track your progress and complete your assigned modules
          </p>
        </div>
      </div>

      {/* Progress summary - Restored */}
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
            <Clock size={24} className="text-blue-600 dark:text-blue-400" />
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

      {/* Modules list with filters */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">My Modules</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((module, index) => (
            <Card 
              key={module.id} 
              className="flex flex-col md:flex-row md:items-center slide-up hover:shadow-lg transition-shadow duration-200" 
              style={{animationDelay: `${0.4 + (index * 0.1)}s`}}
              hover
              onClick={() => {
                if (module.id === 'introduction_module') {
                  navigate('/trainee/vision');
                } else {
                  navigate(`/trainee/modules/${module.id}`);
                }
              }}
            >
              <div className="md:w-40 h-32 md:h-full bg-gray-200 dark:bg-gray-700 rounded-t-lg md:rounded-l-lg md:rounded-tr-none overflow-hidden">
                <img 
                  src={module.image || '/images/placeholder-module.jpg'}
                  alt={module.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Circular Progress Indicator - Moved and adjusted positioning */}
              <div className="absolute top-6 right-6 w-10 h-10">
                  <svg className="h-full w-full" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" fill="none" stroke="#E5E7EB" strokeWidth="4" />
                      <circle 
                        cx="18" 
                        cy="18" 
                        r="16" 
                        fill="none" 
                        stroke={
                        module.completionPercentage === 100 
                            ? '#10B981' 
                          : module.completionPercentage > 0 
                              ? '#3B82F6' 
                              : '#D1D5DB'
                        } 
                        strokeWidth="4" 
                        strokeDasharray={100} 
                      strokeDashoffset={100 - module.completionPercentage} 
                        strokeLinecap="round"
                        transform="rotate(-90 18 18)"
                      />
                      <text 
                        x="18" 
                        y="18" 
                        dy=".3em" 
                        textAnchor="middle" 
                        fontSize="10" 
                        fill="currentColor"
                        className="text-gray-700 dark:text-gray-300"
                      >
                      {module.completionPercentage == null ? 0 : module.completionPercentage}%
                      </text>
                    </svg>
                </div>

              <div className="p-4 flex-grow">
                <div className="flex justify-between items-start">
                  <div className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs rounded-md mb-2">
                    {module.completionMode ? (module.completionMode.trim().toUpperCase() === 'MANDATORY' ? 'Mandatory' : module.completionMode.trim().toUpperCase() === 'SELF_LEARNED' ? 'Self Learned' : 'Non Mandatory') : 'Non Mandatory'}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{module.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{module.description}</p>
                <div className="flex justify-between items-center mt-auto">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{module.duration || 'N/A'}</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    icon={module.completionPercentage > 0 ? <ArrowRight size={16} /> : <PlayCircle size={16} />}
                  >
                    {module.completionPercentage === 100 
                      ? 'Review' 
                      : module.completionPercentage > 0 
                        ? 'Continue' 
                        : 'Start'
                    }
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Achievements section - Restored */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Achievements</h2>
          <Link to="/achievements" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center">
            View all <ChevronRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((achievement, index) => (
            <Card key={achievement.id} className="text-center p-6 slide-up" style={{animationDelay: `${0.8 + (index * 0.1)}s`}}>
            <div className="inline-flex items-center justify-center p-3 bg-amber-100 dark:bg-amber-900 rounded-full mb-4">
              <Star size={24} className="text-amber-600 dark:text-amber-400" />
            </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{achievement.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
          </Card>
          ))}
        </div>
      </div>

      {/* Chatbot Section */}
      {/* Conditionally render the ChatbotInterface based on a state or prop if needed later */}
      <div className="mb-8 slide-up" style={{animationDelay: '1.3s'}}>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Training Assistant</h2>
        {/* Re-adding the Card wrapper for background and styling */}
        <Card className="p-0 overflow-hidden slide-up" style={{animationDelay: '1.4s'}}>
           <ChatbotInterface />
        </Card>
      </div>
    </div>
  );
};

// Module Detail Component
const ModuleDetailView: React.FC = () => {
  const { moduleId } = useParams();
  const [module, setModule] = useState<UserModuleView | null>(null);
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null); // Clear previous errors
      try {
        const moduleResponse = await getModuleById(moduleId, currentUser?.id);
        const fetchedModule = moduleResponse.data;
        setModule(fetchedModule);

        console.log('Fetched Module:', fetchedModule); // Log fetched module
        console.log('Module quizId:', fetchedModule?.quizId); // Log module quizId

        // Load quiz data if module has a quizId
        if (fetchedModule?.quizId) {
          try {
            const quizResponse = await getQuizById(fetchedModule.quizId);
            setQuiz(quizResponse.data);
            console.log('Fetched Quiz:', quizResponse.data); // Log fetched quiz data
          } catch (quizError) {
            console.error('Error loading quiz:', quizError);
            setError('Failed to load quiz details.');
          }
        }

      } catch (error) {
        console.error('Error loading module data:', error);
        setError('Failed to load module data.');
        setModule(null);
      } finally {
    setLoading(false);
      }
    };
    
    if (moduleId) {
      loadData();
    }
  }, [moduleId, currentUser?.id]);

  const handleQuizSubmit = async (answers: any[]) => {
    if (!currentUser?.id || !quiz?.id) return;

    try {
      setLoading(true);
      setError(null); // Clear previous errors
      const submissionData = {
        quizId: quiz.id,
        userAnswers: answers
      };
      await submitQuiz(currentUser.id, submissionData);
      // Reload module and quiz data to update progress/completion status
      const moduleResponse = await getModuleById(moduleId);
      setModule(moduleResponse.data);

      if (moduleResponse.data?.quizId) {
         const quizResponse = await getQuizById(moduleResponse.data.quizId);
         setQuiz(quizResponse.data);
      }

    } catch (error) {
      console.error('Error submitting quiz:', error);
      setError('Failed to submit quiz.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (error) {
     return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-red-600 dark:text-red-400">
        <h2 className="text-2xl font-bold mb-4">Error Loading Data</h2>
        <p className="mb-8">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
     );
  }

  if (!module) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Module Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The module you're looking for could not be found.
        </p>
        <Button as={Link} to="/trainee">
          Return to Training
        </Button>
      </div>
    );
  } else {
    console.log('Module duration before rendering:', module.duration)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      <div className="mb-8">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/trainee')}
          className="mb-4"
        >
          Back to Training
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{module.title}</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">{module.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400 mr-4">{module.duration || 'N/A'}</span>
            <div className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs rounded-md">
              {module.completionMode ? (module.completionMode.trim().toUpperCase() === 'MANDATORY' ? 'Mandatory' : module.completionMode.trim().toUpperCase() === 'SELF_LEARNED' ? 'Self Learned' : 'Non Mandatory') : 'Non Mandatory'}
            </div>
          </div>
        </div>
      </div>

      {/* Module Roadmap */}
      <div className="p-6 slide-up" style={{ animationDelay: '0.2s' }}>
        <ModuleRoadmap 
          moduleId={module.id} 
          subModules={module.subModules}
          userId={currentUser?.id}
          onSubModuleComplete={() => { /* Potentially reload module data here if needed */ }}
          overallProgress={module.completionPercentage}
          quizId={module.quizId}
          assessmentCompleted={module.assessmentCompleted}
          assessmentScore={module.assessmentScore}
        />
      </div>

    </div>
  );
};

// Section Video Component
const SectionVideo = ({ section, onProgress }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      onProgress(videoRef.current.currentTime, videoRef.current.duration);
    }
  };

  return (
    <div className="mb-6">
      <video
        ref={videoRef}
        className="w-full rounded-lg shadow-md"
        controls
        poster={section.thumbnail}
        onTimeUpdate={handleTimeUpdate}
        src={section.videoUrl}
      />
      <div>
        <h4 className="font-medium text-gray-900 dark:text-white">{section.title}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">{section.duration}</p>
      </div>
    </div>
  );
};

// Section Detail Component
const SectionDetailView: React.FC = () => {
  const { sectionId, moduleId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [module, setModule] = useState<UserModuleView | null>(null);
  const [section, setSection] = useState<UserSubModuleView | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'resources' | 'assessment'>('content');
  const [videoProgress, setVideoProgress] = useState(0);

  // Add state to track if completion API has been called
  const [completionCalled, setCompletionCalled] = useState(false);

  const loadData = async () => {
    console.log('SectionDetailView - Loading data...');
    console.log('SectionDetailView - moduleId:', moduleId);
    console.log('SectionDetailView - sectionId:', sectionId);
    try {
      const moduleResponse = await getModuleById(moduleId, currentUser?.id);
      console.log('SectionDetailView - Module Response Data:', moduleResponse.data);
      const sectionResponse = moduleResponse.data?.subModules?.find((s: UserSubModuleView) => s.id === sectionId);
      console.log('SectionDetailView - Found section:', sectionResponse);
      setModule(moduleResponse.data);
      setSection(sectionResponse || null);

      // Initialize video progress based on status and fetched data
      if (sectionResponse?.status === 'completed') {
        setVideoProgress(100); // Set to 100 if completed
      } else if (sectionResponse?.videoProgress != null) {
        setVideoProgress(sectionResponse.videoProgress);
      } else {
        setVideoProgress(0); // Default to 0 if no progress data
      }

      // Reset completionCalled if the section is not completed
      if (sectionResponse?.status !== 'completed') {
          setCompletionCalled(false);
      }

    } catch (error) {
      console.error('Error loading section data:', error);
      setModule(null);
      setSection(null);
    }
  };

  useEffect(() => {
    if (moduleId && sectionId && currentUser?.id) {
      loadData();
    }
  }, [moduleId, sectionId, currentUser?.id]); // Add currentUser?.id to dependencies

  // Effect to handle video progress and trigger completion
  useEffect(() => {
     // Check if the section is already completed or if completion has been called
    if (section?.status === 'completed' || completionCalled) {
        return; // Do nothing if already completed or completion API called
    }

    // Trigger completion if video progress is 100% or very close
    if (section?.type === 'video' && videoProgress >= 99.5 && currentUser?.id && moduleId && sectionId) {
      console.log('Video progress reached 100%, marking submodule as completed.');
      setCompletionCalled(true); // Mark that completion API is being called
      completeSubModule(currentUser.id, moduleId, sectionId)
        .then(() => {
           console.log('Submodule marked as completed in backend, reloading data...');
           loadData(); // Reload data to update status and progress
        })
        .catch(error => {
           console.error('Error marking submodule as completed:', error);
           // Handle error, maybe show a message to the user
           setCompletionCalled(false); // Allow retrying if error occurred
        });
    }
    // Add other content types completion logic here if needed

  }, [videoProgress, section?.status, currentUser?.id, moduleId, sectionId, completionCalled]); // Add dependencies

  const handleVideoTimeUpdate = (current: number, duration: number) => {
    if (duration) {
      const percent = (current / duration) * 100;
      setVideoProgress(percent);
    }
  };

  if (!section) return <div>Section not found</div>;

  // Determine progress bar color based on section status
  const progressBarColor = section.status === 'completed' ? 'bg-green-600' : 'bg-blue-600';

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <button
        className="mb-6 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
        onClick={() => navigate(`/trainee/modules/${moduleId}`)}
      >
        ← Back to Roadmap
      </button>
      <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{section.title}</h1>
      <div className="flex items-center mb-6">
        <span className="text-sm text-gray-600 dark:text-gray-400 mr-4">{section.duration}</span>
        <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs rounded-md">
          {section.type === '3d' ? '3D Interactive' : section.type === 'video' ? 'Video' : 'Text'}
        </span>
      </div>
      {/* Section Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{isNaN(videoProgress) ? 0 : Math.round(videoProgress)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div
            className={`${progressBarColor} h-2.5 rounded-full transition-all duration-300`}
            style={{ width: `${isNaN(videoProgress) ? 0 : Math.round(videoProgress)}%` }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-0 bg-gray-50 dark:bg-gray-800 rounded-t-lg overflow-hidden">
        <button
          className={`py-3 px-6 focus:outline-none transition-colors duration-150 ${activeTab === 'content' ? 'border-b-2 border-blue-600 text-blue-600 font-semibold bg-white dark:bg-gray-900' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'}`}
          onClick={() => setActiveTab('content')}
        >
          Content
        </button>
        <button
          className={`py-3 px-6 focus:outline-none transition-colors duration-150 ${activeTab === 'resources' ? 'border-b-2 border-blue-600 text-blue-600 font-semibold bg-white dark:bg-gray-900' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'}`}
          onClick={() => setActiveTab('resources')}
        >
          Resources
        </button>
      </div>

      {/* Tab Content Card */}
      <div className="bg-white dark:bg-gray-900 rounded-b-lg rounded-tr-lg shadow-md border border-gray-200 dark:border-gray-800 p-6 mt-0 mb-8">
        {activeTab === 'content' && (
          <div>
            {/* Video Section */}
            {section.type === 'video' && (
              <SectionVideo section={section} onProgress={handleVideoTimeUpdate} />
            )}
            {/* Add 3D or text content here if needed */}
            {section.type === 'text' && (
               <SubModuleContent subModule={section} />
            )}
            {/* Add 3D or text content here if needed */}
            {section.type !== 'video' && section.status !== 'completed' && (
              <div className="mt-6 text-center">
                <Button onClick={() => {
                  if (currentUser?.id && moduleId && sectionId && !completionCalled) {
                    setCompletionCalled(true);
                    completeSubModule(currentUser.id, moduleId, sectionId)
                      .then(() => {
                        console.log('Submodule marked as completed in backend via button, reloading data...');
                        loadData(); // Reload data to update status and progress
                      })
                      .catch(error => {
                        console.error('Error marking submodule as completed via button:', error);
                        setCompletionCalled(false); // Allow retrying if error occurred
                      });
                  }
                }}>
                  Mark as done
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'resources' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resources</h3>
            <div className="space-y-4">
              {section.resources?.map((resource, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
                >
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{resource.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{resource.description}</p>
                  </div>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
                  >
                    {resource.type === 'link' ? 'Access' : 'Download'}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Trainee View that includes routes to all trainee pages
const TraineeView: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<TraineeDashboard />} />
        <Route path="/modules/:moduleId" element={<ModuleDetailView />} />
        <Route path="/modules/:moduleId/sections/:sectionId" element={<SectionDetailView />} />
        <Route path="/vision" element={<VisionStatement />} />
        <Route path="*" element={
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Under Construction
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This page is currently being developed
            </p>
            <Button as={Link} to="/trainee">
              Return to Training Dashboard
            </Button>
          </div>
        } />
      </Routes>
    </Layout>
  );
};

export default TraineeView;