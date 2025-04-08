import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { notificationHistoryService } from '@/utils/notificationHistory';
import { NotificationHistory } from '@/utils/notificationHistory';

export const NotificationHistory: React.FC = () => {
  const [history, setHistory] = React.useState<NotificationHistory[]>([]);
  const [filter, setFilter] = React.useState<{
    type?: string;
    status?: string;
    patientId?: string;
  }>({});

  React.useEffect(() => {
    // Initial load
    setHistory(notificationHistoryService.getHistory());
  }, []);

  const filteredHistory = React.useMemo(() => {
    return history.filter(notification => {
      if (filter.type && notification.type !== filter.type) return false;
      if (filter.status && notification.status !== filter.status) return false;
      if (filter.patientId && notification.patientId !== filter.patientId) return false;
      return true;
    });
  }, [history, filter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Notification History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <select
              className="p-2 border rounded"
              value={filter.type || ''}
              onChange={(e) => setFilter({ ...filter, type: e.target.value || undefined })}
            >
              <option value="">All Types</option>
              <option value="emergency_alert">Emergency Alert</option>
              <option value="access_granted">Access Granted</option>
              <option value="document_processed">Document Processed</option>
              <option value="medication_reminder">Medication Reminder</option>
            </select>

            <select
              className="p-2 border rounded"
              value={filter.status || ''}
              onChange={(e) => setFilter({ ...filter, status: e.target.value || undefined })}
            >
              <option value="">All Statuses</option>
              <option value="sent">Sent</option>
              <option value="delivered">Delivered</option>
              <option value="failed">Failed</option>
            </select>

            <input
              type="text"
              placeholder="Filter by Patient ID"
              className="p-2 border rounded"
              value={filter.patientId || ''}
              onChange={(e) => setFilter({ ...filter, patientId: e.target.value || undefined })}
            />
          </div>

          <div className="space-y-2">
            {filteredHistory.map((notification) => (
              <Card key={notification.id}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{notification.type}</h4>
                      <p className="text-sm text-gray-500">
                        Patient ID: {notification.patientId}
                      </p>
                      <p className="text-sm text-gray-500">
                        Phone: {notification.phoneNumber}
                      </p>
                      <p className="text-sm text-gray-500">
                        Time: {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span className={`font-medium ${getStatusColor(notification.status)}`}>
                      {notification.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="mt-2 text-sm">{notification.message}</p>
                  {notification.metadata && (
                    <div className="mt-2 text-sm text-gray-500">
                      <pre>{JSON.stringify(notification.metadata, null, 2)}</pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 