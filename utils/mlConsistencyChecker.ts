import * as tf from '@tensorflow/tfjs';
import { PatientRecord, Medication } from "@/types/patientRecord";

interface MLPrediction {
  type: 'warning' | 'error';
  message: string;
  confidence: number;
  recordId: string;
}

export class MLConsistencyChecker {
  private model: tf.LayersModel | null = null;
  private readonly SIMILARITY_THRESHOLD = 0.8;
  private readonly TIME_WINDOW_DAYS = 30;

  constructor() {
    this.initializeModel();
  }

  private async initializeModel() {
    // Define the model architecture
    const model = tf.sequential();
    
    // Input layer for medication features
    model.add(tf.layers.dense({
      units: 64,
      activation: 'relu',
      inputShape: [10] // 10 features for each medication
    }));
    
    // Hidden layers
    model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
    model.add(tf.layers.dropout({ rate: 0.2 }));
    model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
    
    // Output layer
    model.add(tf.layers.dense({ 
      units: 3, // 3 types of predictions: interaction, duplicate, diagnosis
      activation: 'sigmoid'
    }));

    // Compile the model
    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    this.model = model;
  }

  private preprocessMedication(med: Medication): number[] {
    // Convert medication properties to numerical features
    return [
      // Name similarity score (placeholder for word embedding)
      this.calculateNameSimilarity(med.name),
      // Dosage numerical value
      parseFloat(med.dosage) || 0,
      // Frequency encoding
      this.encodeFrequency(med.frequency),
      // Duration in days
      this.parseDuration(med.duration),
      // Additional features
      med.instructions.includes('food') ? 1 : 0,
      med.instructions.includes('water') ? 1 : 0,
      med.instructions.includes('bedtime') ? 1 : 0,
      med.instructions.includes('avoid') ? 1 : 0,
      // Time-based features
      this.getTimeOfDayScore(med.frequency),
      // Interaction risk score
      this.getInteractionRiskScore(med.name)
    ];
  }

  private calculateNameSimilarity(name: string): number {
    // Simple word similarity (can be replaced with word embeddings)
    const commonMeds = ['aspirin', 'ibuprofen', 'warfarin', 'simvastatin', 'metformin'];
    return commonMeds.some(med => 
      name.toLowerCase().includes(med) || med.includes(name.toLowerCase())
    ) ? 1 : 0;
  }

  private encodeFrequency(freq: string): number {
    const freqMap: { [key: string]: number } = {
      'once daily': 1,
      'twice daily': 2,
      'three times daily': 3,
      'four times daily': 4,
      'as needed': 0.5
    };
    return freqMap[freq.toLowerCase()] || 0;
  }

  private parseDuration(duration: string): number {
    const match = duration.match(/(\d+)\s*(day|week|month)/i);
    if (!match) return 0;
    const [_, num, unit] = match;
    const multiplier = {
      'day': 1,
      'week': 7,
      'month': 30
    }[unit.toLowerCase()] || 1;
    return parseInt(num) * multiplier;
  }

  private getTimeOfDayScore(freq: string): number {
    const times = ['morning', 'afternoon', 'evening', 'bedtime', 'night'];
    return times.some(time => freq.toLowerCase().includes(time)) ? 1 : 0;
  }

  private getInteractionRiskScore(name: string): number {
    const highRiskMeds = ['warfarin', 'simvastatin', 'metformin'];
    return highRiskMeds.includes(name.toLowerCase()) ? 1 : 0;
  }

  async checkRecords(records: PatientRecord[]): Promise<MLPrediction[]> {
    if (!this.model) {
      throw new Error('Model not initialized');
    }

    const results: MLPrediction[] = [];
    const prescriptions = records.filter(r => r.type === 'Prescription');
    const consultations = records.filter(r => 
      r.type === 'Initial Consultation' || r.type === 'Follow-up Visit'
    );

    // Check medication interactions and duplicates
    for (let i = 0; i < prescriptions.length; i++) {
      for (let j = i + 1; j < prescriptions.length; j++) {
        const med1 = prescriptions[i].data.medications[0];
        const med2 = prescriptions[j].data.medications[0];

        // Prepare features for ML model
        const features1 = this.preprocessMedication(med1);
        const features2 = this.preprocessMedication(med2);
        const combinedFeatures = [...features1, ...features2];

        // Make prediction
        const prediction = await this.model.predict(
          tf.tensor2d([combinedFeatures])
        ).data();

        // Process predictions
        const [interactionProb, duplicateProb, diagnosisProb] = prediction;

        if (interactionProb > 0.7) {
          results.push({
            type: 'error',
            message: `Potential medication interaction detected: ${med1.name} and ${med2.name}`,
            confidence: interactionProb,
            recordId: prescriptions[i].id
          });
        }

        if (duplicateProb > 0.8) {
          results.push({
            type: 'warning',
            message: `Possible duplicate prescription: ${med1.name}`,
            confidence: duplicateProb,
            recordId: prescriptions[i].id
          });
        }
      }
    }

    // Check diagnosis consistency
    if (consultations.length >= 2) {
      const recentDiagnoses = consultations
        .slice(-3)
        .map(c => c.data.diagnosis.toLowerCase());

      const uniqueDiagnoses = new Set(recentDiagnoses);
      if (uniqueDiagnoses.size > 1) {
        results.push({
          type: 'warning',
          message: 'Inconsistent diagnoses detected across recent consultations',
          confidence: 0.85,
          recordId: consultations[0].id
        });
      }
    }

    return results;
  }

  // Method to train the model (would be called with historical data)
  async trainModel(trainingData: any[]) {
    if (!this.model) return;

    // Prepare training data
    const xs = tf.tensor2d(trainingData.map(d => d.features));
    const ys = tf.tensor2d(trainingData.map(d => d.labels));

    // Train the model
    await this.model.fit(xs, ys, {
      epochs: 50,
      batchSize: 32,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch}: loss = ${logs?.loss}`);
        }
      }
    });
  }
} 