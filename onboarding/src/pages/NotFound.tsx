import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-bold text-blue-900 dark:text-blue-500">404</h1>
        <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">Page Not Found</h2>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button
            as={Link}
            to="/"
            icon={<Home size={16} />}
          >
            Go Home
          </Button>
          <Button
            as={Link}
            to="#"
            onClick={() => window.history.back()}
            variant="outline"
            icon={<ArrowLeft size={16} />}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;