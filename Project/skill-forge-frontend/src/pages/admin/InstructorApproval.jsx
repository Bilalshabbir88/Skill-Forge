import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Eye, Mail, Calendar } from 'lucide-react';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import Modal from '../../components/shared/Modal';
import api from '../../api/api';

export default function InstructorApproval() {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      // GET /api/admin/instructors/pending returns { data: [...users with role=instructor, status=pending] }
      const response = await api.get('/admin/instructors/pending');
      const pending = response.data.data || [];
      // Also get all instructors for approved/rejected view
      const allRes = await api.get('/admin/users', { params: { role: 'instructor', limit: 100 } });
      const allInstructors = allRes.data.data?.users || [];
      // Merge: pending from /pending endpoint, rest from /users?role=instructor
      const seen = new Set(pending.map((u) => u._id));
      const merged = [
        ...pending.map((u) => ({ ...u, _displayStatus: 'pending' })),
        ...allInstructors.filter((u) => !seen.has(u._id)).map((u) => ({ ...u, _displayStatus: u.status === 'active' ? 'approved' : u.status })),
      ];
      setApplications(merged);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      // PATCH /api/admin/instructors/:id/approve
      await api.patch(`/admin/instructors/${selectedApplication._id}/approve`);
      setApplications(applications.map((app) =>
        app._id === selectedApplication._id
          ? { ...app, status: 'active', _displayStatus: 'approved' }
          : app
      ));
      setShowApproveModal(false);
      setShowDetailModal(false);
      setSelectedApplication(null);
    } catch (error) {
      console.error('Error approving:', error);
      alert(error.response?.data?.message || 'Failed to approve');
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) { alert('Please provide a reason for rejection'); return; }
    try {
      // PATCH /api/admin/instructors/:id/reject
      await api.patch(`/admin/instructors/${selectedApplication._id}/reject`);
      setApplications(applications.map((app) =>
        app._id === selectedApplication._id
          ? { ...app, status: 'banned', _displayStatus: 'rejected' }
          : app
      ));
      setShowRejectModal(false);
      setShowDetailModal(false);
      setSelectedApplication(null);
      setRejectReason('');
    } catch (error) {
      console.error('Error rejecting:', error);
      alert(error.response?.data?.message || 'Failed to reject');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Rejected</Badge>;
      default:
        return null;
    }
  };

  const filteredApplications = applications.filter((app) =>
    filterStatus === 'all' ? true : (app._displayStatus || app.status) === filterStatus
  );

  // Adapt the data structure: backend returns User objects not application objects
  // Map user fields to what the template expects
  const mapApp = (app) => ({
    ...app,
    user: { _id: app._id, name: app.name, email: app.email },
    bio: app.bio || 'No bio provided',
    expertise: Array.isArray(app.expertise) ? app.expertise : [],
    experience: 'N/A',
    submittedAt: app.createdAt,
    status: app._displayStatus || (app.status === 'active' ? 'approved' : app.status),
  });
  const displayApps = filteredApplications.map(mapApp);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading applications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Instructor Applications
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review and approve instructor applications
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            onClick={() => setFilterStatus('pending')}
            variant={filterStatus === 'pending' ? 'default' : 'outline'}
            className={filterStatus === 'pending' ? 'bg-orange-600 hover:bg-orange-700' : ''}
          >
            <Clock className="w-4 h-4 mr-2" />
            Pending ({applications.filter(a => (a._displayStatus || a.status) === 'pending').length})
          </Button>
          <Button
            onClick={() => setFilterStatus('approved')}
            variant={filterStatus === 'approved' ? 'default' : 'outline'}
            className={filterStatus === 'approved' ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Approved ({applications.filter(a => (a._displayStatus || a.status) === 'approved').length})
          </Button>
          <Button
            onClick={() => setFilterStatus('rejected')}
            variant={filterStatus === 'rejected' ? 'default' : 'outline'}
            className={filterStatus === 'rejected' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            <XCircle className="w-4 h-4 mr-2" />
            Rejected ({applications.filter(a => (a._displayStatus || a.status) === 'rejected').length})
          </Button>
          <Button
            onClick={() => setFilterStatus('all')}
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            className={filterStatus === 'all' ? 'bg-blue-600 hover:bg-blue-700' : ''}
          >
            All ({applications.length})
          </Button>
        </div>

        {/* Applications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {displayApps.map((application) => (
            <Card key={application._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {application.user.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {application.user.email}
                    </p>
                  </div>
                  {getStatusBadge(application.status)}
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                  {application.bio}
                </p>

                <div className="mb-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Expertise:</p>
                  <div className="flex flex-wrap gap-1">
                    {application.expertise.slice(0, 4).map((skill, index) => (
                      <Badge
                        key={index}
                        className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {application.expertise.length > 4 && (
                      <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 text-xs">
                        +{application.expertise.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(application.submittedAt).toLocaleDateString()}
                  </span>
                  <span>Experience: {application.experience}</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setSelectedApplication(application);
                      setShowDetailModal(true);
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  
                  {application.status === 'pending' && (
                    <>
                      <Button
                        onClick={() => {
                          setSelectedApplication(application);
                          setShowApproveModal(true);
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedApplication(application);
                          setShowRejectModal(true);
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredApplications.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No {filterStatus !== 'all' ? filterStatus : ''} applications found
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Application Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedApplication(null);
        }}
        title="Application Details"
      >
        {selectedApplication && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {selectedApplication.user.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedApplication.user.email}
              </p>
              <div className="mt-2">
                {getStatusBadge(selectedApplication.status)}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Bio</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedApplication.bio}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Expertise</h4>
              <div className="flex flex-wrap gap-2">
                {selectedApplication.expertise.map((skill, index) => (
                  <Badge
                    key={index}
                    className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Experience</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedApplication.experience}
              </p>
            </div>

            {selectedApplication.portfolio && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Portfolio</h4>
                <a
                  href={selectedApplication.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-orange-600 hover:text-orange-700 dark:text-orange-400 underline"
                >
                  {selectedApplication.portfolio}
                </a>
              </div>
            )}

            {selectedApplication.linkedin && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">LinkedIn</h4>
                <a
                  href={selectedApplication.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-orange-600 hover:text-orange-700 dark:text-orange-400 underline"
                >
                  {selectedApplication.linkedin}
                </a>
              </div>
            )}

            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Submitted</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(selectedApplication.submittedAt).toLocaleString()}
              </p>
            </div>

            {selectedApplication.reviewedAt && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Reviewed</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(selectedApplication.reviewedAt).toLocaleString()}
                </p>
              </div>
            )}

            {selectedApplication.rejectionReason && (
              <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg">
                <h4 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">Rejection Reason</h4>
                <p className="text-sm text-red-600 dark:text-red-400">
                  {selectedApplication.rejectionReason}
                </p>
              </div>
            )}

            {selectedApplication.status === 'pending' && (
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => {
                    setShowDetailModal(false);
                    setShowApproveModal(true);
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => {
                    setShowDetailModal(false);
                    setShowRejectModal(true);
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Approve Modal */}
      <Modal
        isOpen={showApproveModal}
        onClose={() => {
          setShowApproveModal(false);
          setSelectedApplication(null);
        }}
        title="Approve Application"
      >
        {selectedApplication && (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Are you sure you want to approve{' '}
              <strong className="text-gray-900 dark:text-white">
                {selectedApplication.user.name}
              </strong>
              's instructor application?
            </p>
            
            <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-400">
                ✓ The user will be granted instructor permissions and can start creating courses.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleApprove}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                Approve Application
              </Button>
              <Button
                onClick={() => {
                  setShowApproveModal(false);
                  setSelectedApplication(null);
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setSelectedApplication(null);
          setRejectReason('');
        }}
        title="Reject Application"
      >
        {selectedApplication && (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Reject{' '}
              <strong className="text-gray-900 dark:text-white">
                {selectedApplication.user.name}
              </strong>
              's instructor application
            </p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reason for Rejection *
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="Provide a clear reason for rejection..."
              />
            </div>

            <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-400">
                The applicant will be notified via email with the rejection reason.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleReject}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                disabled={!rejectReason.trim()}
              >
                Reject Application
              </Button>
              <Button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedApplication(null);
                  setRejectReason('');
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Footer />
    </div>
  );
}
