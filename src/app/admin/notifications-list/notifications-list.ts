import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { AdminService } from '../../core/services/admin.service';

@Component({
    selector: 'app-notifications-list',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule,
        MatChipsModule
    ],
    template: `
    <div class="notifications-container">
      <div class="page-header">
        <div class="title-group">
          <h1>Toutes les Notifications</h1>
          <p class="subtitle">Gérez vos alertes et communications système</p>
        </div>
        <div class="actions">
          <button mat-stroked-button (click)="markAllAsRead()" [disabled]="!hasUnread">
            Tout marquer comme lu
          </button>
        </div>
      </div>

      <mat-card class="notifications-card">
        <div class="notifications-list">
          <div *ngFor="let note of notifications" class="notification-item" [class.unread]="!note.read">
            <div class="note-icon" [style.background-color]="note.color + '20'">
              <mat-icon [style.color]="note.color">{{ note.icon }}</mat-icon>
            </div>
            
            <div class="note-content">
              <div class="note-top">
                <span class="note-title">{{ note.title }}</span>
                <span class="note-date">{{ note.createdAt | date:'d MMM y, HH:mm' }}</span>
              </div>
              <p class="note-message">{{ note.message }}</p>
              <div class="note-bottom">
                <mat-chip-set>
                  <mat-chip class="type-chip" [style.background-color]="note.color + '15'" [style.color]="note.color">
                    {{ note.type }}
                  </mat-chip>
                </mat-chip-set>
                <div class="item-actions">
                  <button mat-button *ngIf="!note.read" (click)="markRead(note._id)">
                    Marquer comme lu
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteNote(note._id)">
                    <mat-icon>delete_outline</mat-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="notifications.length === 0" class="empty-state">
            <mat-icon>notifications_off</mat-icon>
            <h3>Aucune notification</h3>
            <p>Vous êtes à jour !</p>
          </div>
        </div>
      </mat-card>
    </div>
  `,
    styles: [`
    .notifications-container {
      max-width: 1000px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 32px;
    }

    .title-group h1 {
      font-size: 32px;
      font-weight: 800;
      color: var(--text-main);
      margin-bottom: 8px;
    }

    .subtitle {
      color: var(--text-muted);
      margin: 0;
    }

    .notifications-card {
      padding: 0 !important;
      overflow: hidden;
      border: 1px solid var(--border) !important;
      box-shadow: var(--shadow-sm) !important;
    }

    .notification-item {
      display: flex;
      gap: 20px;
      padding: 24px 32px;
      border-bottom: 1px solid var(--border);
      transition: var(--transition);
      position: relative;
    }

    .notification-item:last-child {
      border-bottom: none;
    }

    .notification-item:hover {
      background: #f8fafc;
    }

    .notification-item.unread {
      background: rgba(12, 166, 120, 0.03);
    }

    .notification-item.unread::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: var(--primary);
    }

    .note-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .note-content {
      flex: 1;
    }

    .note-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .note-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--text-main);
    }

    .note-date {
      font-size: 13px;
      color: var(--text-muted);
    }

    .note-message {
      font-size: 15px;
      color: #475569;
      line-height: 1.6;
      margin: 0 0 16px 0;
    }

    .note-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .type-chip {
      font-size: 11px !important;
      font-weight: 700 !important;
      min-height: 24px !important;
    }

    .item-actions {
      display: flex;
      gap: 8px;
    }

    .empty-state {
      padding: 80px 40px;
      text-align: center;
      color: var(--text-muted);
    }

    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
      opacity: 0.3;
    }

    .empty-state h3 {
      font-size: 20px;
      font-weight: 700;
      color: var(--text-main);
      margin-bottom: 8px;
    }
  `]
})
export class NotificationsList implements OnInit {
    notifications: any[] = [];

    constructor(private adminService: AdminService) { }

    ngOnInit() {
        this.loadNotifications();
    }

    get hasUnread() {
        return this.notifications.some(n => !n.read);
    }

    loadNotifications() {
        this.adminService.getNotifications().subscribe(data => {
            this.notifications = data;
        });
    }

    markRead(id: string) {
        this.adminService.markNotificationRead(id).subscribe(() => {
            const note = this.notifications.find(n => n._id === id);
            if (note) note.read = true;
        });
    }

    markAllAsRead() {
        this.adminService.markAllNotificationsRead().subscribe(() => {
            this.notifications.forEach(n => n.read = true);
        });
    }

    deleteNote(id: string) {
        this.adminService.deleteNotification(id).subscribe(() => {
            this.notifications = this.notifications.filter(n => n._id !== id);
        });
    }
}
