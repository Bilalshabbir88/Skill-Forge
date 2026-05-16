import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import api from '@/api/api';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Download, 
  ArrowLeft, 
  Trophy, 
  Award,
  CheckCircle,
  Loader2,
  Share2
} from 'lucide-react';

export default function Certificate() {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const certificateRef = useRef(null);

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchCertificateData();
  }, [courseId]);

  const fetchCertificateData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [courseRes, enrollmentsRes] = await Promise.all([
        api.get(`/courses/${courseId}`),
        api.get('/enrollments/me')
      ]);

      setCourse(courseRes.data);
      
      // Find the enrollment for this course
      const enroll = enrollmentsRes.data.find(e => e.course._id === courseId);
      
      if (!enroll) {
        setError('You are not enrolled in this course.');
        return;
      }

      if (!enroll.completed) {
        setError('You must complete the course and pass the quiz to earn a certificate.');
        return;
      }

      setEnrollment(enroll);
    } catch (err) {
      console.error('Error fetching certificate data:', err);
      setError(
        err.response?.data?.message || 
        'Failed to load certificate. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;

    try {
      setDownloading(true);

      // Capture the certificate as canvas
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
      });

      // Convert canvas to PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      
      // Download the PDF
      const fileName = `${course.title.replace(/[^a-z0-9]/gi, '_')}_Certificate.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to download certificate. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Course Completion Certificate',
        text: `I just completed ${course.title} on Skill Forge!`,
        url: window.location.href
      }).catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Certificate link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading certificate...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <Card className="bg-gray-900 border-gray-800 max-w-md w-full">
          <CardContent className="p-6 text-center">
            <Award className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-100 mb-2">
              Certificate Not Available
            </h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <Button onClick={() => navigate('/student/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completionDate = enrollment?.completedAt 
    ? new Date(enrollment.completedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

  const certificateId = enrollment?._id?.slice(-8).toUpperCase() || 'XXXXXXXX';

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/student/dashboard')}
            className="text-gray-400 hover:text-gray-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="flex items-center gap-2"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download PDF
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Success Message */}
        <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-100 mb-1">
                  Congratulations! 🎉
                </h3>
                <p className="text-gray-300 text-sm">
                  You've successfully completed <strong>{course?.title}</strong> and earned this certificate.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certificate */}
        <div className="bg-white p-8 rounded-lg shadow-2xl">
          <div
            ref={certificateRef}
            className="bg-white p-12 md:p-16 relative overflow-hidden"
            style={{ aspectRatio: '1.414' }} // A4 landscape aspect ratio
          >
            {/* Decorative Border */}
            <div className="absolute inset-8 border-4 border-double border-primary-600 rounded-lg"></div>
            <div className="absolute inset-6 border border-primary-300 rounded-lg"></div>

            {/* Corner Decorations */}
            <div className="absolute top-4 left-4 w-16 h-16">
              <Trophy className="w-full h-full text-primary-500/20" />
            </div>
            <div className="absolute top-4 right-4 w-16 h-16">
              <Award className="w-full h-full text-primary-500/20" />
            </div>
            <div className="absolute bottom-4 left-4 w-16 h-16">
              <Award className="w-full h-full text-primary-500/20" />
            </div>
            <div className="absolute bottom-4 right-4 w-16 h-16">
              <Trophy className="w-full h-full text-primary-500/20" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center space-y-6">
              {/* Logo/Title */}
              <div className="space-y-2">
                <h1 className="text-5xl md:text-6xl font-bold text-primary-600 tracking-tight">
                  SKILL FORGE
                </h1>
                <div className="h-1 w-32 bg-gradient-to-r from-primary-500 to-purple-500 mx-auto rounded-full"></div>
              </div>

              {/* Certificate Title */}
              <h2 className="text-2xl md:text-3xl font-serif text-gray-700">
                Certificate of Completion
              </h2>

              {/* Main Text */}
              <div className="space-y-4 max-w-2xl">
                <p className="text-lg text-gray-600">This certifies that</p>
                
                <h3 className="text-4xl md:text-5xl font-bold text-gray-900 border-b-2 border-gray-300 pb-2 px-8">
                  {user?.name || 'Student Name'}
                </h3>

                <p className="text-lg text-gray-600">
                  has successfully completed the course
                </p>

                <h4 className="text-2xl md:text-3xl font-bold text-primary-700">
                  {course?.title}
                </h4>

                <p className="text-base text-gray-500 pt-4">
                  Completed on <strong>{completionDate}</strong>
                </p>
              </div>

              {/* Bottom Section */}
              <div className="flex items-end justify-between w-full max-w-2xl pt-8 mt-auto">
                {/* Signature Line */}
                <div className="text-left">
                  <div className="border-t-2 border-gray-800 w-48 mb-2"></div>
                  <p className="text-sm font-semibold text-gray-700">Instructor Signature</p>
                  <p className="text-xs text-gray-500">{course?.instructor?.name || 'Skill Forge Team'}</p>
                </div>

                {/* Certificate ID */}
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">Certificate ID</p>
                  <p className="text-sm font-mono font-semibold text-gray-700 tracking-wide">
                    {certificateId}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            This certificate verifies that you have completed all course requirements and passed the final quiz.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Share your achievement on social media or add it to your professional portfolio!
          </p>
        </div>
      </div>
    </div>
  );
}
