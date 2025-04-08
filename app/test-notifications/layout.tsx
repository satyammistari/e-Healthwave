import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Test Notifications',
  description: 'Test the notification system',
};

export default function TestNotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
} 