import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-premium-empty-state',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule],
    template: `
    <div class="empty-state-container animate-fade-in">
      <div class="empty-icon-wrapper">
        <mat-icon>{{ icon }}</mat-icon>
      </div>
      <h3 class="empty-title">{{ title }}</h3>
      <p class="empty-message">{{ message }}</p>
      <div class="empty-actions" *ngIf="actionText" (click)="onAction()">
        <button class="btn-premium">
          <mat-icon *ngIf="actionIcon">{{ actionIcon }}</mat-icon>
          {{ actionText }}
        </button>
      </div>
    </div>
  `,
    styles: [`
    .empty-state-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
      background: rgba(255, 255, 255, 0.5);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      border: 1px dashed var(--border);
      margin: 20px 0;
    }

    .empty-icon-wrapper {
      width: 80px;
      height: 80px;
      background: #f8fafc;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
      color: #94a3b8;
    }

    .empty-icon-wrapper mat-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
    }

    .empty-title {
      font-size: 20px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 12px;
    }

    .empty-message {
      font-size: 15px;
      color: #64748b;
      max-width: 300px;
      line-height: 1.6;
      margin-bottom: 24px;
    }

    .animate-fade-in {
      animation: fadeIn 0.5s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class PremiumEmptyState {
    @Input() icon: string = 'sentiment_neutral';
    @Input() title: string = 'Rien à afficher';
    @Input() message: string = 'Il n\'y a aucune donnée disponible pour le moment.';
    @Input() actionText?: string;
    @Input() actionIcon?: string;
    @Input() actionCallback?: () => void;

    onAction() {
        if (this.actionCallback) {
            this.actionCallback();
        }
    }
}
