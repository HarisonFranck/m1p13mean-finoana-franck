import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    private socket: Socket | null = null;

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        if (isPlatformBrowser(this.platformId)) {
            this.socket = io(environment.apiUrl);
        }
    }

    onDataChanged(): Observable<any> {
        return new Observable(observer => {
            if (this.socket) {
                this.socket.on('dataChanged', (data) => {
                    observer.next(data);
                });
            }
        });
    }

    emit(eventName: string, data: any) {
        if (this.socket) {
            this.socket.emit(eventName, data);
        }
    }
}
