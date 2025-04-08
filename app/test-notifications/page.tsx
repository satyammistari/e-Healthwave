'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { NotificationHistoryView } from '@/components/NotificationHistory';
import {
  sendEmergencyNotification,
  sendAccessGrantedNotification,
  sendDocumentProcessedNotification,
  sendMedicationReminder
} from '@/utils/smsService';

export default function TestNotifications() {
  const { toast } = useToast();
  const [patientId, setPatientId] = useState('PAT001');
  const [phoneNumber, setPhoneNumber] = useState('+19404617504');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [language, setLanguage] = useState('en');
  const [medication, setMedication] = useState('Aspirin');
  const [dosage, setDosage] = useState('100mg');
  const [documentType, setDocumentType] = useState('Lab Results');

  const handleTestEmergency = async () => {
    try {
      const notificationIds = await sendEmergencyNotification(
        patientId,
        phoneNumber,
        emergencyContact,
        language
      );
      toast({
        title: "Success",
        description: `Emergency notifications sent. IDs: ${notificationIds.join(', ')}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send emergency notification",
        variant: "destructive"
      });
    }
  };

  const handleTestAccess = async () => {
    try {
      const notificationId = await sendAccessGrantedNotification(
        patientId,
        phoneNumber,
        'emergency',
        language
      );
      toast({
        title: "Success",
        description: `Access notification sent. ID: ${notificationId}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send access notification",
        variant: "destructive"
      });
    }
  };

  const handleTestDocument = async () => {
    try {
      const notificationId = await sendDocumentProcessedNotification(
        patientId,
        phoneNumber,
        documentType,
        language
      );
      toast({
        title: "Success",
        description: `Document notification sent. ID: ${notificationId}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send document notification",
        variant: "destructive"
      });
    }
  };

  const handleTestMedication = async () => {
    try {
      const notificationId = await sendMedicationReminder(
        patientId,
        phoneNumber,
        medication,
        dosage,
        language
      );
      toast({
        title: "Success",
        description: `Medication reminder sent. ID: ${notificationId}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send medication reminder",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Test Notification System</h1>

      <Card>
        <CardHeader>
          <CardTitle>Test Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Patient ID</label>
              <Input
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                placeholder="PAT001"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1234567890"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Emergency Contact (Optional)</label>
              <Input
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="+1234567890"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Language</label>
              <select
                className="w-full p-2 border rounded"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={handleTestEmergency} className="w-full">
              Test Emergency Alert
            </Button>
            <Button onClick={handleTestAccess} className="w-full">
              Test Access Granted
            </Button>
            <Button onClick={handleTestDocument} className="w-full">
              Test Document Processed
            </Button>
            <Button onClick={handleTestMedication} className="w-full">
              Test Medication Reminder
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Medication Reminder Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Medication</label>
              <Input
                value={medication}
                onChange={(e) => setMedication(e.target.value)}
                placeholder="Aspirin"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Dosage</label>
              <Input
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="100mg"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Document Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Document Type</label>
            <Input
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              placeholder="Lab Results"
            />
          </div>
        </CardContent>
      </Card>

      <NotificationHistoryView />
    </div>
  );
} 