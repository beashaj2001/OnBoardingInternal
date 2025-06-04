import React from 'react';
import Layout from '../components/Layout/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { 
  User, 
  Mail, 
  Award, 
  Calendar, 
  Clock, 
  CheckCircle,
  Briefcase,
  Edit,
  Settings
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Not Logged In</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Please log in to view your profile.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Profile sidebar */}
          <div className="lg:w-1/3">
            <Card className="mb-6 text-center">
              <div className="relative inline-block mb-4">
                <img 
                  src={currentUser.avatar || 'https://via.placeholder.com/150'} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full mx-auto border-4 border-white dark:border-gray-800 shadow-lg"
                />
                <button className="absolute bottom-0 right-0 bg-blue-900 dark:bg-blue-700 text-white p-2 rounded-full shadow-md hover:bg-blue-800 dark:hover:bg-blue-600">
                  <Edit size={16} />
                </button>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{currentUser.name}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{currentUser.role === 'TRAINER' ? 'Training Specialist' : 'Trainee'}</p>
              
              <div className="flex justify-center space-x-4 mb-6">
                <button className="flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-400 p-2 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50">
                  <Mail size={20} />
                </button>
                <button className="flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-400 p-2 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50">
                  <Calendar size={20} />
                </button>
                <button className="flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-400 p-2 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50">
                  <Settings size={20} />
                </button>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">87</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">5</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Badges</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">2</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Rank</p>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <User size={18} className="mr-2" /> Personal Information
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Full Name</p>
                  <p className="font-medium text-gray-900 dark:text-white">{currentUser.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                  <p className="font-medium text-gray-900 dark:text-white">{currentUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Role</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {currentUser.role === 'TRAINER' ? 'Training Specialist' : 'Trainee'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Department</p>
                  <p className="font-medium text-gray-900 dark:text-white">Operations</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Joined</p>
                  <p className="font-medium text-gray-900 dark:text-white">January 15, 2025</p>
                </div>
              </div>
            </Card>
            
            {/* <Card>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Briefcase size={18} className="mr-2" /> Work Experience
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Equipment Operator</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">2023 - Present</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                    Responsible for operating and maintaining industrial equipment.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Assistant Operator</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">2021 - 2023</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                    Assisted with equipment operation and maintenance tasks.
                  </p>
                </div>
              </div>
            </Card> */}
          </div>
          
          {/* Main content */}
          <div className="lg:w-2/3">
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Training Summary</h2>
                <div className="mt-2 sm:mt-0">
                  <Button 
                    variant="outline" 
                    size="sm"
                    icon={<Calendar size={16} />}
                  >
                    Download Report
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="flex items-center">
                  <div className="mr-4 p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <Clock size={20} className="text-blue-900 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Hours</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">24.5</p>
                  </div>
                </Card>
                
                <Card className="flex items-center">
                  <div className="mr-4 p-3 bg-green-100 dark:bg-green-900 rounded-full">
                    <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">4 / 7</p>
                  </div>
                </Card>
                
                <Card className="flex items-center">
                  <div className="mr-4 p-3 bg-amber-100 dark:bg-amber-900 rounded-full">
                    <Award size={20} className="text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Score</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">92%</p>
                  </div>
                </Card>
              </div>
            </div>
            
            <Card className="mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Award size={18} className="mr-2" /> Achievements & Badges
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Award size={24} className="text-amber-600 dark:text-amber-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Fast Learner</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Earned 2 weeks ago</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Perfect Score</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Earned 1 month ago</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Clock size={24} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Dedicated</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Earned 3 weeks ago</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Mail size={24} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Team Player</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Earned 2 months ago</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2 filter grayscale">
                    <Award size={24} className="text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-400 dark:text-gray-500">Expert</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Locked</p>
                </div>
              </div>
            </Card>
            
            <Card className="mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <CheckCircle size={18} className="mr-2" /> Completed Modules
              </h3>
              
              <div className="space-y-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Introduction to Equipment Safety</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Completed on Jan 20, 2025</p>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs py-1 px-2 rounded">
                      100% Complete
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Clock size={14} className="mr-1" />
                      <span>45 min</span>
                    </div>
                    <div className="flex items-center text-sm font-medium text-amber-600 dark:text-amber-400">
                      <Award size={14} className="mr-1" />
                      <span>98/100 Score</span>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Machinery Operation Basics</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Completed on Feb 3, 2025</p>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs py-1 px-2 rounded">
                      100% Complete
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Clock size={14} className="mr-1" />
                      <span>1h 15min</span>
                    </div>
                    <div className="flex items-center text-sm font-medium text-amber-600 dark:text-amber-400">
                      <Award size={14} className="mr-1" />
                      <span>92/100 Score</span>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Emergency Protocols</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">In progress</p>
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs py-1 px-2 rounded">
                      25% Complete
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Clock size={14} className="mr-1" />
                      <span>30 min</span>
                    </div>
                    <div className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                      <Award size={14} className="mr-1" />
                      <span>Not graded</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* <Card>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Calendar size={18} className="mr-2" /> Training History
              </h3>
              
              <div className="relative pl-8 border-l-2 border-gray-200 dark:border-gray-700 space-y-8">
                <div className="relative">
                  <div className="absolute -left-10 top-0 w-6 h-6 bg-blue-900 dark:bg-blue-700 rounded-full border-4 border-white dark:border-gray-800"></div>
                  <div className="mb-1">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Started Emergency Protocols Module</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Feb 15, 2025</p>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Began learning about workplace emergency response procedures.
                  </p>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-10 top-0 w-6 h-6 bg-green-600 dark:bg-green-700 rounded-full border-4 border-white dark:border-gray-800"></div>
                  <div className="mb-1">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Completed Machinery Operation Basics with 92% Score</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Feb 3, 2025</p>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Successfully passed the assessment with a high score.
                  </p>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-10 top-0 w-6 h-6 bg-blue-900 dark:bg-blue-700 rounded-full border-4 border-white dark:border-gray-800"></div>
                  <div className="mb-1">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Started Machinery Operation Basics Module</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Jan 25, 2025</p>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Began learning about basic machinery operation techniques.
                  </p>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-10 top-0 w-6 h-6 bg-green-600 dark:bg-green-700 rounded-full border-4 border-white dark:border-gray-800"></div>
                  <div className="mb-1">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Completed Equipment Safety with 98% Score</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Jan 20, 2025</p>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Successfully completed the safety training with an excellent score.
                  </p>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-10 top-0 w-6 h-6 bg-amber-500 dark:bg-amber-600 rounded-full border-4 border-white dark:border-gray-800"></div>
                  <div className="mb-1">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Received Fast Learner Badge</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Jan 18, 2025</p>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Earned badge for completing modules quickly and efficiently.
                  </p>
                </div>
              </div>
            </Card> */}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;