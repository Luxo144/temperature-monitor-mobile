import messaging from '@react-native-firebase/messaging';
import * as Device from 'expo-device';

const TEMPERATURE_TOPIC = 'temperature_alerts';
const SERVER_URL = 'http://iplocal:3000';

export const notificationService = {
  async requestUserPermission() {
    if (!Device.isDevice) return false;
    
    const authStatus = await messaging().requestPermission();
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  },

  async subscribeTopic() {
    try {
      await messaging().subscribeToTopic(TEMPERATURE_TOPIC);
      console.log('Subscribed to temperature alerts');
    } catch (error) {
      console.error('Error subscribing to topic:', error);
    }
  },

  async unsubscribeTopic() {
    try {
      await messaging().unsubscribeFromTopic(TEMPERATURE_TOPIC);
      console.log('Unsubscribed from temperature alerts');
    } catch (error) {
      console.error('Error unsubscribing from topic:', error);
    }
  },

  async sendTemperatureAlert(temperature: number, min: number, max: number) {
    try {
      const response = await fetch(`${SERVER_URL}/send-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ temperature, min, max })
      });

      if (!response.ok) {
        throw new Error('Failed to send notification');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  },

  onMessage(callback: (message: any) => void) {
    return messaging().onMessage(callback);
  }
};