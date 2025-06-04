import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ThreeDModuleViewer from '../components/features/ThreeDModuleViewer';
import ModuleRoadmap from '../components/features/ModuleRoadmap';
import QuizComponent from '../components/features/QuizComponent';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  Download, 
  Share2, 
  BookOpen,
  Award,
  Play,
  Pause,
  ChevronRight
} from 'lucide-react';
import { getModuleById } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

interface SubModule {
  id: string;
  title: string;
  type: '3d' | 'video' | 'text';
  duration: string;
  progress: number;
  status: 'completed' | 'in-progress' | 'locked';
  videoUrl?: string;
  thumbnail?: string;
  resources?: Array<{ title: string; description: string; url: string; type: string }>;
}

interface Module {
  id: string;
  title: string;
  type: '3d' | 'video' | 'text';
  image: string;
  completionRate: number;
  description: string;
  duration: string;
  displayTag?: string;
  subModules: SubModule[];
  quizId?: string;
  assessmentCompleted?: boolean;
  prerequisites?: string[];
  skills?: string[];
}

const ModuleDetail: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('content');
  const [isPlaying, setIsPlaying] = useState(false);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { currentUser } = useAuth();

  const loadModule = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getModuleById(moduleId as string);
      const foundModule = response.data;
      
      if (foundModule) {
        setModule(foundModule);
      }
    } catch (error) {
      console.error('Error loading module:', error);
      setModule(null);
    } finally {
      setLoading(false);
    }
  }, [moduleId]);

  useEffect(() => {
    if (moduleId) {
       loadModule();
    }
    
    // Clean up interval on unmount
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [moduleId, loadModule]);

  const calculateOverallProgress = (moduleData: Module | null): number => {
    if (!moduleData || !moduleData.subModules) return 0;
    const totalSections = moduleData.subModules.length + (moduleData.quizId ? 1 : 0);
    if (totalSections === 0) return 0;

    const completedSections = moduleData.subModules.filter(sub => sub.status === 'completed').length
      + (moduleData.quizId && (moduleData.assessmentCompleted ?? false) ? 1 : 0);

    return (completedSections / totalSections) * 100;
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
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

  if (!module) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Module Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The module you're looking for could not be found.
          </p>
          <Button as={Link} to="/dashboard">
            Return to Dashboard
          </Button>
        </div>
      </Layout>
    );
  }

  const overallProgress = calculateOverallProgress(module);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
        {/* Module header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link to="/dashboard" className="mr-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{module.title}</h1>
              <div className="flex flex-wrap items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center mr-4">
                  <Clock size={16} className="mr-1" />
                  <span>{module.duration}</span>
                </div>
                <div className="flex items-center mr-4">
                  <BookOpen size={16} className="mr-1" />
                  <span>{module.type === '3d' ? '3D Interactive' : module.type === 'video' ? 'Video' : 'Text'}</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle size={16} className="mr-1" />
                  <span>{Math.round(overallProgress)}% Complete</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                overallProgress === 100 
                  ? 'bg-green-600' 
                  : overallProgress > 0 
                    ? 'bg-blue-600' 
                    : 'bg-gray-300 dark:bg-gray-600'
              }`} 
              style={{ width: `${overallProgress}%`, transition: 'width 0.5s ease-in-out' }}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {activeTab === 'content' && module.subModules && (
                <ModuleRoadmap 
                  moduleId={module.id} 
                  subModules={module.subModules} 
                  userId={currentUser?.id}
                  onSubModuleComplete={loadModule}
                />
              )}

            {activeTab === 'resources' && (
              <Card className="mb-8 p-0 overflow-hidden">
                <div className="p-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      Supplementary Resources
                    </h2>

                    <div className="space-y-4">
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">Safety Manual PDF</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Complete reference guide for safety procedures</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          icon={<Download size={16} />}
                        >
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'assessment' && module.quizId && (
                 <QuizComponent 
                   quizId={module.quizId} 
                   moduleId={module.id}
                   userId={currentUser?.id}
                   onQuizComplete={loadModule}
                 />
               )}

          </div>
          
          <div>
            <Card className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Module Information</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prerequisites</h4>
                  {module.prerequisites && module.prerequisites.length > 0 ? (
                    <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400">
                      {module.prerequisites.map((prereq, index) => (
                        <li key={index}>{prereq}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-400">No prerequisites required</p>
                  )}
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Skills Covered</h4>
                  {module.skills && module.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {module.skills.map((skill, index) => (
                        <span 
                          key={index} 
                          className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-400">No specific skills listed</p>
                  )}
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Completion Time</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{module.duration}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Certification</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Certificate awarded upon completion of assessment with 80% or higher score
                  </p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  fullWidth
                  icon={<Share2 size={16} />}
                >
                  Share Module
                </Button>
              </div>
            </Card>
            
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Next in Your Path</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-16 h-12 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden mr-3">
                    <img 
                      src="https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                      alt="Machinery Operation Basics"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">Machinery Operation Basics</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">1h 15min</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-16 h-12 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden mr-3">
                    <img 
                      src="https://images.pexels.com/photos/257636/pexels-photo-257636.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                      alt="Emergency Protocols"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">Emergency Protocols</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">30 min</p>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  fullWidth
                  as={Link}
                  to="/trainee"
                >
                  View Full Curriculum
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ModuleDetail;