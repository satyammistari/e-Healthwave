import { NextRequest, NextResponse } from 'next/server';
import { notificationHistoryService } from '@/utils/notificationHistory';

export async function POST(
  request: NextRequest,
  { params }: { params: { notificationId: string } }
) {
  try {
    const { MessageStatus } = await request.json();
    const notificationId = params.notificationId;

    // Update notification status based on Twilio's message status
    let status: 'sent' | 'delivered' | 'failed';
    switch (MessageStatus) {
      case 'sent':
        status = 'sent';
        break;
      case 'delivered':
        status = 'delivered';
        break;
      case 'failed':
      case 'undelivered':
        status = 'failed';
        break;
      default:
        status = 'sent';
    }

    notificationHistoryService.updateStatus(notificationId, status);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating SMS status:', error);
    return NextResponse.json(
      { error: 'Failed to update SMS status' },
      { status: 500 }
    );
  }
} 