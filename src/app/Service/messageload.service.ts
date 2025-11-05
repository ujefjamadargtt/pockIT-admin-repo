// firebase.service.ts
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class MessageloadService {
    listenForMessages(callback: (payload: any) => void) {
        console.warn('1Firebase messaging not found on window object.');

        if ('firebase' in window && (window as any).firebase?.messaging) {
            console.warn('2Firebase messaging not found on window object.');

            const messaging = (window as any).firebase.messaging();

            messaging.onMessage((payload: any) => {
                callback(payload);
            });
        } else {
            console.warn('Firebase messaging not found on window object.');
        }
    }
}
