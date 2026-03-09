import type { Prediction } from '../types';

const STORAGE_KEY = 'stakeYourTake_predictions';

export class PredictionStorage {
  // Save predictions to localStorage
  static savePredictions(predictions: Prediction[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(predictions));
      console.log('✅ Predictions saved to localStorage');
    } catch (error) {
      console.error('❌ Error saving predictions:', error);
    }
  }

  // Load predictions from localStorage
  static loadPredictions(): Prediction[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const predictions = JSON.parse(saved);
        console.log('✅ Predictions loaded from localStorage:', predictions.length);
        return predictions;
      }
    } catch (error) {
      console.error('❌ Error loading predictions:', error);
    }
    return [];
  }

  // Add new prediction
  static addPrediction(prediction: Prediction): void {
    const predictions = this.loadPredictions();
    predictions.unshift(prediction); // Add to beginning
    this.savePredictions(predictions);
  }

  // Update prediction (for likes, comments, etc.)
  static updatePrediction(id: string, updates: Partial<Prediction>): void {
    const predictions = this.loadPredictions();
    const index = predictions.findIndex(p => p.id === id);
    if (index !== -1) {
      predictions[index] = { ...predictions[index], ...updates };
      this.savePredictions(predictions);
    }
  }

  // Delete prediction
  static deletePrediction(id: string): void {
    const predictions = this.loadPredictions();
    const filtered = predictions.filter(p => p.id !== id);
    this.savePredictions(filtered);
  }

  // Get all predictions
  static getAllPredictions(): Prediction[] {
    return this.loadPredictions();
  }

  // Clear all predictions (for reset)
  static clearPredictions(): void {
    localStorage.removeItem(STORAGE_KEY);
    console.log('✅ All predictions cleared');
  }
}
