import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from './use-auth';

export function usePushNotifications() {
  const { user } = useAuth();
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  useEffect(() => {
    checkSupport();
    checkPermission();
  }, []);

  const checkSupport = () => {
    const supported = 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
    setIsSupported(supported);
  };

  const checkPermission = () => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) {
      console.warn('Push notifications não são suportadas neste navegador');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission === 'granted') {
        await subscribeToPush();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao solicitar permissão para notificações:', error);
      return false;
    }
  };

  const subscribeToPush = async () => {
    if (!user?.id || permission !== 'granted') return;

    try {
      const registration = await navigator.serviceWorker.ready;
      
      // VAPID keys - in production, these should be environment variables
      const vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa40HI0DLKUHIpL6QoD6-C3Ep9HKPfcqhDbr5FHI3fYqNDFAhpF0QBIzCvdZNQ';
      
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });

      setSubscription(pushSubscription);

      // Send subscription to server
      const subscriptionData = {
        userId: user.id,
        endpoint: pushSubscription.endpoint,
        p256dh: arrayBufferToBase64(pushSubscription.getKey('p256dh')!),
        auth: arrayBufferToBase64(pushSubscription.getKey('auth')!)
      };

      await apiRequest('POST', '/api/push-subscribe', subscriptionData);
      console.log('Inscrito nas notificações push com sucesso');

    } catch (error) {
      console.error('Erro ao se inscrever nas notificações push:', error);
    }
  };

  const unsubscribe = async () => {
    if (!subscription) return;

    try {
      await subscription.unsubscribe();
      setSubscription(null);
      
      // Remove from server
      // You'd need to implement this based on how you store subscription IDs
      console.log('Desinscrito das notificações push');
    } catch (error) {
      console.error('Erro ao cancelar inscrição:', error);
    }
  };

  const sendTestNotification = () => {
    if (permission === 'granted') {
      new Notification('Fé em Jesus BR', {
        body: 'Notificação de teste funcionando!',
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png'
      });
    }
  };

  return {
    isSupported,
    permission,
    subscription,
    requestPermission,
    subscribeToPush,
    unsubscribe,
    sendTestNotification
  };
}

// Helper functions
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}