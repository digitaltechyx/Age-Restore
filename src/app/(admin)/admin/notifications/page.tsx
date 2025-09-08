"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, doc, updateDoc, where, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sendUserRefundResponseEmail } from "@/lib/email-utils";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Bell, Mail, User, Calendar, CheckCircle, Clock, AlertTriangle } from "lucide-react";

interface Notification {
  id: string;
  type: 'refund_request' | 'account_deletion' | 'general';
  userEmail: string;
  userName: string;
  message: string;
  additionalData: any;
  timestamp: any;
  status: 'pending' | 'reviewed' | 'resolved';
  adminNotified: boolean;
  refundStatus?: 'pending' | 'under_review' | 'accepted' | 'rejected';
  refundRequestId?: string;
  adminMessage?: string;
  deletionStatus?: 'pending' | 'under_review' | 'approved' | 'rejected';
  deletionRequestId?: string;
  deletionMessage?: string;
}

const typeLabels = {
  refund_request: 'Refund Request',
  account_deletion: 'Account Deletion',
  general: 'General'
};

const typeIcons = {
  refund_request: AlertTriangle,
  account_deletion: User,
  general: Bell
};

const statusVariants = {
  pending: 'secondary',
  reviewed: 'default',
  resolved: 'outline'
};

const statusColors = {
  pending: 'bg-yellow-500',
  reviewed: 'bg-blue-500',
  resolved: 'bg-green-500'
};

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectMessage, setRejectMessage] = useState('');
  const { toast } = useToast();

  const fetchNotifications = async () => {
    try {
      const notificationsRef = collection(db, 'notifications');
      const q = query(notificationsRef, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const notificationsData: Notification[] = [];
      querySnapshot.forEach((doc) => {
        notificationsData.push({ id: doc.id, ...doc.data() } as Notification);
      });
      
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: "Error",
        description: "Failed to load notifications.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [toast]);

  const updateNotificationStatus = async (id: string, status: 'pending' | 'reviewed' | 'resolved') => {
    try {
      const notificationRef = doc(db, 'notifications', id);
      await updateDoc(notificationRef, { status });
      
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, status } : notif
        )
      );
      
      toast({
        title: "Status Updated",
        description: `Notification marked as ${status}.`,
      });
    } catch (error) {
      console.error('Error updating notification status:', error);
      toast({
        title: "Error",
        description: "Failed to update notification status.",
        variant: "destructive",
      });
    }
  };

  const updateRefundStatus = async (id: string, refundStatus: 'pending' | 'under_review' | 'accepted' | 'rejected', adminMessage?: string) => {
    try {
      const notificationRef = doc(db, 'notifications', id);
      const updateData: any = { 
        refundStatus,
        status: refundStatus === 'accepted' || refundStatus === 'rejected' ? 'resolved' : 'reviewed'
      };
      
      if (adminMessage) {
        updateData.adminMessage = adminMessage;
      }
      
      await updateDoc(notificationRef, updateData);
      
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { 
            ...notif, 
            refundStatus,
            status: refundStatus === 'accepted' || refundStatus === 'rejected' ? 'resolved' : 'reviewed',
            adminMessage: adminMessage || notif.adminMessage
          } : notif
        )
      );
      
      const statusText = {
        pending: 'Pending',
        under_review: 'Under Review',
        accepted: 'Accepted',
        rejected: 'Rejected'
      }[refundStatus];
      
      // Send email notification to user if refund is accepted or rejected
      if (refundStatus === 'accepted' || refundStatus === 'rejected') {
        const notification = notifications.find(n => n.id === id);
        if (notification) {
          try {
            await sendUserRefundResponseEmail(
              notification.userEmail,
              notification.userName,
              refundStatus === 'accepted' ? 'approved' : 'rejected',
              adminMessage
            );
            console.log('✅ User refund response email sent');
          } catch (emailError) {
            console.error('❌ Failed to send user refund response email:', emailError);
            // Don't fail the whole operation if email fails
          }
        }
      }
      
      toast({
        title: "Refund Status Updated",
        description: `Refund request marked as ${statusText}.`,
      });
    } catch (error) {
      console.error('Error updating refund status:', error);
      toast({
        title: "Error",
        description: "Failed to update refund status.",
        variant: "destructive",
      });
    }
  };

  const handleRejectWithMessage = (id: string) => {
    setRejectingId(id);
    setRejectMessage('');
    setRejectModalOpen(true);
  };

  const confirmRejection = async () => {
    if (rejectingId) {
      await updateRefundStatus(rejectingId, 'rejected', rejectMessage);
      setRejectModalOpen(false);
      setRejectingId(null);
      setRejectMessage('');
    }
  };

  const updateDeletionStatus = async (id: string, deletionStatus: 'pending' | 'under_review' | 'approved' | 'rejected', deletionMessage?: string) => {
    try {
      const notificationRef = doc(db, 'notifications', id);
      const updateData: any = { 
        deletionStatus,
        status: deletionStatus === 'approved' || deletionStatus === 'rejected' ? 'resolved' : 'reviewed'
      };
      
      if (deletionMessage) {
        updateData.deletionMessage = deletionMessage;
      }
      
      await updateDoc(notificationRef, updateData);
      
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { 
            ...notif, 
            deletionStatus,
            status: deletionStatus === 'approved' || deletionStatus === 'rejected' ? 'resolved' : 'reviewed',
            deletionMessage: deletionMessage || notif.deletionMessage
          } : notif
        )
      );
      
      const statusText = {
        pending: 'Pending',
        under_review: 'Under Review',
        approved: 'Approved',
        rejected: 'Rejected'
      }[deletionStatus];
      
      toast({
        title: "Deletion Status Updated",
        description: `Account deletion request marked as ${statusText}.`,
      });
    } catch (error) {
      console.error('Error updating deletion status:', error);
      toast({
        title: "Error",
        description: "Failed to update deletion status.",
        variant: "destructive",
      });
    }
  };

  const handleRejectDeletion = (id: string) => {
    setRejectingId(id);
    setRejectMessage('');
    setRejectModalOpen(true);
  };

  const confirmDeletionRejection = async () => {
    if (rejectingId) {
      await updateDeletionStatus(rejectingId, 'rejected', rejectMessage);
      setRejectModalOpen(false);
      setRejectingId(null);
      setRejectMessage('');
    }
  };

  // Clean up all notifications
  const cleanupTestData = async () => {
    try {
      // Get all notifications
      const notificationsRef = collection(db, 'notifications');
      const allQuery = query(notificationsRef, orderBy('timestamp', 'desc'));
      const allSnapshot = await getDocs(allQuery);
      
      console.log(`🔍 Found ${allSnapshot.docs.length} notifications in database`);
      
      if (allSnapshot.docs.length === 0) {
        toast({
          title: "No Notifications",
          description: "There are no notifications to delete.",
        });
        return;
      }
      
      // Delete all notifications
      const deletePromises = allSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      console.log(`🗑️ Deleted ${allSnapshot.docs.length} notifications`);
      fetchNotifications();
      
      toast({
        title: "Cleanup Complete",
        description: `Removed ${allSnapshot.docs.length} notifications.`,
      });
    } catch (error) {
      console.error('Error cleaning up notifications:', error);
      toast({
        title: "Error",
        description: "Failed to clean up notifications.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'reviewed':
        return <CheckCircle className="h-4 w-4" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const pendingCount = notifications.filter(n => n.status === 'pending').length;
  const refundRequests = notifications.filter(n => n.type === 'refund_request');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Manage user requests and system notifications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={cleanupTestData}
            className="text-red-600 hover:text-red-700"
          >
            🗑️ Clear All Notifications
          </Button>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Bell className="h-3 w-3" />
            {pendingCount} Pending
          </Badge>
        </div>
      </div>

      {pendingCount > 0 && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            You have {pendingCount} pending notification{pendingCount > 1 ? 's' : ''} that require your attention.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Notifications</h3>
              <p className="text-muted-foreground text-center">
                You don't have any notifications yet. They will appear here when users make requests.
              </p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => {
            const TypeIcon = typeIcons[notification.type];
            const formattedDate = notification.timestamp?.toDate?.()?.toLocaleString() || 
                                 new Date(notification.timestamp).toLocaleString();
            
            return (
              <Card key={notification.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <TypeIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {typeLabels[notification.type]}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Mail className="h-3 w-3" />
                          {notification.userEmail}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={statusVariants[notification.status] as any}
                        className="flex items-center gap-1"
                      >
                        <div className={`w-2 h-2 rounded-full ${statusColors[notification.status]}`} />
                        {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>{notification.userName}</span>
                      <Separator orientation="vertical" className="h-4" />
                      <Calendar className="h-3 w-3" />
                      <span>{formattedDate}</span>
                    </div>
                    
                    <p className="text-sm">{notification.message}</p>
                    
                    {notification.additionalData && Object.keys(notification.additionalData).length > 0 && (
                      <div className="bg-muted/50 rounded-lg p-3">
                        <h4 className="text-sm font-medium mb-2">Additional Information:</h4>
                        <div className="space-y-1 text-xs">
                          {Object.entries(notification.additionalData).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-muted-foreground capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}:
                              </span>
                              <span className="font-mono">
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Refund Status Management */}
                    {notification.type === 'refund_request' && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium text-blue-900">Refund Status Management</h4>
                          {notification.refundStatus && (
                            <Badge className={`${
                              notification.refundStatus === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                              notification.refundStatus === 'under_review' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                              notification.refundStatus === 'accepted' ? 'bg-green-100 text-green-800 border-green-200' :
                              'bg-red-100 text-red-800 border-red-200'
                            } border`}>
                              {notification.refundStatus === 'pending' ? 'Pending' :
                               notification.refundStatus === 'under_review' ? 'Under Review' :
                               notification.refundStatus === 'accepted' ? 'Approved' :
                               'Rejected'}
                            </Badge>
                          )}
                        </div>
                        
                        {/* Refund Reason */}
                        {notification.additionalData?.refundReason && (
                          <div className="mb-4 p-3 bg-white border border-blue-200 rounded-lg">
                            <h5 className="text-sm font-medium text-blue-800 mb-2">User's Reason for Refund:</h5>
                            <p className="text-sm text-gray-700 italic">"{notification.additionalData.refundReason}"</p>
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateRefundStatus(notification.id, 'under_review')}
                            disabled={notification.refundStatus === 'under_review'}
                          >
                            Mark Under Review
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-green-700 border-green-300 hover:bg-green-50"
                            onClick={() => updateRefundStatus(notification.id, 'accepted')}
                            disabled={notification.refundStatus === 'accepted'}
                          >
                            Approve Refund
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-red-700 border-red-300 hover:bg-red-50"
                            onClick={() => handleRejectWithMessage(notification.id)}
                            disabled={notification.refundStatus === 'rejected'}
                          >
                            Reject Refund
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Account Deletion Status Management */}
                    {notification.type === 'account_deletion' && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium text-red-900">Account Deletion Management</h4>
                          {notification.deletionStatus && (
                            <Badge className={`${
                              notification.deletionStatus === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                              notification.deletionStatus === 'under_review' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                              notification.deletionStatus === 'approved' ? 'bg-green-100 text-green-800 border-green-200' :
                              'bg-red-100 text-red-800 border-red-200'
                            } border`}>
                              {notification.deletionStatus === 'pending' ? 'Pending' :
                               notification.deletionStatus === 'under_review' ? 'Under Review' :
                               notification.deletionStatus === 'approved' ? 'Approved' :
                               'Rejected'}
                            </Badge>
                          )}
                        </div>
                        
                        {/* Deletion Reason */}
                        {notification.additionalData?.deletionReason && (
                          <div className="mb-4 p-3 bg-white border border-red-200 rounded-lg">
                            <h5 className="text-sm font-medium text-red-800 mb-2">User's Reason for Deletion:</h5>
                            <p className="text-sm text-gray-700 italic">"{notification.additionalData.deletionReason}"</p>
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateDeletionStatus(notification.id, 'under_review')}
                            disabled={notification.deletionStatus === 'under_review'}
                          >
                            Mark Under Review
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-green-700 border-green-300 hover:bg-green-50"
                            onClick={() => updateDeletionStatus(notification.id, 'approved')}
                            disabled={notification.deletionStatus === 'approved'}
                          >
                            Approve Deletion
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-red-700 border-red-300 hover:bg-red-50"
                            onClick={() => handleRejectDeletion(notification.id)}
                            disabled={notification.deletionStatus === 'rejected'}
                          >
                            Reject Deletion
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {notification.status === 'pending' && notification.type !== 'refund_request' && notification.type !== 'account_deletion' && (
                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          onClick={() => updateNotificationStatus(notification.id, 'reviewed')}
                        >
                          Mark as Reviewed
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateNotificationStatus(notification.id, 'resolved')}
                        >
                          Mark as Resolved
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Rejection Modal */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this request. This message will be shown to the user.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reject-message">Rejection Reason</Label>
              <Textarea
                id="reject-message"
                placeholder="Enter the reason for rejection (e.g., 'Policy violation', 'Insufficient documentation', etc.)"
                value={rejectMessage}
                onChange={(e) => setRejectMessage(e.target.value)}
                className="mt-1"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                // Check if it's a deletion request or refund request
                const notification = notifications.find(n => n.id === rejectingId);
                if (notification?.type === 'account_deletion') {
                  confirmDeletionRejection();
                } else {
                  confirmRejection();
                }
              }}
              disabled={!rejectMessage.trim()}
            >
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
