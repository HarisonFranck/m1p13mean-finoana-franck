import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-session-timeout-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="session-dialog-container animate-scale">
      <div class="dialog-content-centered">
        <div class="icon-wrapper">
          <mat-icon>history</mat-icon>
        </div>
        
        <h2 class="dialog-title">Session Expirée</h2>
        
        <div class="dialog-body">
          <p>Votre session a expiré pour des raisons de sécurité.</p>
          <p class="secondary-text">Merci de vous reconnecter pour continuer.</p>
        </div>

        <div class="dialog-actions">
          <button mat-flat-button 
                  class="btn-premium reconnect-btn" 
                  (click)="onReconnect()">
            <mat-icon>login</mat-icon>
            Se reconnecter maintenant
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .session-dialog-container {
      padding: 40px;
      text-align: center;
      background: white;
      border-radius: 24px;
      max-width: 400px;
    }

    .dialog-content-centered {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
    }

    .icon-wrapper {
      width: 80px;
      height: 80px;
      background: #f1f5f9;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 8px;
    }

    .icon-wrapper mat-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      color: #0ca678;
    }

    .dialog-title {
      font-size: 24px;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
    }

    .dialog-body {
      color: #64748b;
      line-height: 1.6;
    }

    .secondary-text {
      font-size: 14px;
      margin-top: 8px;
    }

    .reconnect-btn {
      height: 48px;
      padding: 0 32px;
      border-radius: 12px;
      font-weight: 600;
      background: #0ca678;
      color: white;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
    }

    .reconnect-btn:hover {
      background: #099268;
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(12, 166, 120, 0.2);
    }

    .animate-scale {
      animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    @keyframes scaleIn {
      from { transform: scale(0.9); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `]
})
export class SessionTimeoutDialog {
  private authService = inject(AuthService);
  private router = inject(Router);
  constructor(public dialogRef: MatDialogRef<SessionTimeoutDialog>) { }

  onReconnect() {
    this.dialogRef.close();
    const redirectPath = this.authService.getRedirectPath();
    this.router.navigate([redirectPath]);
  }
}
