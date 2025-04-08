export type NotificationType = 
  | 'emergency_alert'
  | 'access_granted'
  | 'document_processed'
  | 'medication_reminder'
  | 'appointment_reminder'
  | 'lab_results'
  | 'prescription_ready'
  | 'system_alert';

export interface NotificationTemplate {
  type: NotificationType;
  language: string;
  template: string;
  variables: string[];
}

export const notificationTemplates: Record<string, NotificationTemplate> = {
  emergency_alert_en: {
    type: 'emergency_alert',
    language: 'en',
    template: '🚨 EMERGENCY ALERT 🚨\nPatient ID: {patientId}\nTime: {timestamp}\nEmergency access requested. Please verify immediately.',
    variables: ['patientId', 'timestamp']
  },
  emergency_alert_es: {
    type: 'emergency_alert',
    language: 'es',
    template: '🚨 ALERTA DE EMERGENCIA 🚨\nID del Paciente: {patientId}\nHora: {timestamp}\nSe ha solicitado acceso de emergencia. Por favor verifique inmediatamente.',
    variables: ['patientId', 'timestamp']
  },
  access_granted_en: {
    type: 'access_granted',
    language: 'en',
    template: '✅ {accessType} ACCESS GRANTED\nPatient ID: {patientId}\nTime: {timestamp}\nExpires: {expiration}\nAccess granted for {purpose}.',
    variables: ['accessType', 'patientId', 'timestamp', 'expiration', 'purpose']
  },
  document_processed_en: {
    type: 'document_processed',
    language: 'en',
    template: '📄 DOCUMENT PROCESSED\nPatient ID: {patientId}\nType: {documentType}\nTime: {timestamp}\nDocument has been processed and added to records.',
    variables: ['patientId', 'documentType', 'timestamp']
  },
  medication_reminder_en: {
    type: 'medication_reminder',
    language: 'en',
    template: '💊 MEDICATION REMINDER\nPatient ID: {patientId}\nMedication: {medication}\nDosage: {dosage}\nTime: {timestamp}\nPlease take your medication as prescribed.',
    variables: ['patientId', 'medication', 'dosage', 'timestamp']
  }
}; 