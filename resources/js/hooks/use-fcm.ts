import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
    requestFirebaseNotificationPermission,
    onMessageListener,
} from '@/lib/firebase';

export const useFcm = () => {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const setupFirebase = async () => {
            const fcmToken = await requestFirebaseNotificationPermission();

            if (fcmToken) {
                setToken(fcmToken);

                // Send token to our Laravel backend
                try {
                    await axios.post('/admin/fcm-token', { token: fcmToken });
                } catch (error) {
                    console.error(
                        'Failed to register FCM token with backend:',
                        error,
                    );
                }
            }
        };

        setupFirebase();

        // Listen for foreground messages
        onMessageListener()
            .then((payload: any) => {
                toast.info(payload?.notification?.title || 'New Notification', {
                    description: payload?.notification?.body,
                });
            })
            .catch((err) => console.log('failed: ', err));
    }, []);

    return { token };
};
