import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-red-100 dark:bg-red-900 p-6">
              <AlertCircle className="w-16 h-16 text-red-600 dark:text-red-400" />
            </div>
          </div>

          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
            404
          </h1>

          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Page Not Found
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>

          <Link to="/">
            <Button className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            Need help? <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline">
              Go to Login
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
