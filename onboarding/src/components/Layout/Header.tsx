import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Menu, X, Sun, Moon, ChevronDown, User, LogOut, Settings } from 'lucide-react';

const Header: React.FC = () => {
  const { currentUser, logout, isTrainer, isTrainee } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0 flex items-center">
              <span className="text-blue-900 dark:text-blue-400 font-bold text-xl">
                OnboardPro
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/dashboard"
                className="border-transparent text-gray-700 dark:text-gray-200 hover:text-blue-900 dark:hover:text-blue-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Dashboard
              </Link>
              
              {isTrainer() && (
                <Link
                  to="/trainer"
                  className="border-transparent text-gray-700 dark:text-gray-200 hover:text-blue-900 dark:hover:text-blue-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Trainer Console
                </Link>
              )}
              
              {isTrainee() && (
                <Link
                  to="/trainee"
                  className="border-transparent text-gray-700 dark:text-gray-200 hover:text-blue-900 dark:hover:text-blue-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  My Training
                </Link>
              )}
              
              <Link
                to="/leaderboard"
                className="border-transparent text-gray-700 dark:text-gray-200 hover:text-blue-900 dark:hover:text-blue-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Leaderboard
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {/* Profile dropdown */}
            {currentUser && (
              <div className="ml-3 relative">
                <div>
                  <button
                    onClick={toggleProfileMenu}
                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900"
                  >
                    <div className="flex items-center">
                      <img
                        className="h-8 w-8 rounded-full"
                        src={currentUser.avatar || 'https://via.placeholder.com/150'}
                        alt="Profile"
                      />
                      <span className="hidden md:flex ml-2 items-center text-gray-700 dark:text-gray-200">
                        {currentUser.name} <ChevronDown size={16} className="ml-1" />
                      </span>
                    </div>
                  </button>
                </div>
                
                {/* Profile dropdown menu */}
                {profileMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <User size={16} className="mr-2" /> Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <Settings size={16} className="mr-2" /> Settings
                    </Link>
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    >
                      <LogOut size={16} className="mr-2" /> Log out
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden ml-3">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white dark:bg-gray-900 pb-3">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-blue-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            
            {isTrainer() && (
              <Link
                to="/trainer"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-blue-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                Trainer Console
              </Link>
            )}
            
            {isTrainee() && (
              <Link
                to="/trainee"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-blue-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Training
              </Link>
            )}
            
            <Link
              to="/leaderboard"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-blue-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              Leaderboard
            </Link>
            
            <Link
              to="/profile"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-blue-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              Profile
            </Link>
            
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full text-left block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-blue-900"
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;