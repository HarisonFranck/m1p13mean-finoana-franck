import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-session-timeout-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="session-dialog-container">
      <div class="icon-header">
        <mat-icon>history</mat-icon>
      </div>
      <h2 mat-dialog-title>Session Expirée</h2>
      <mat-dialog-content>
        <p>Votre session a expiré pour des raisons de sécurité. Pour continuer à gérer la plateforme, merci de vous reconnecter.</p>
      </mat-dialog-content>
      <mat-dialog-actions align="center">
        <button mat-flat-button 
                class="reconnect-btn" 
                color="primary" 
                (click)="onReconnect()">
          Se reconnecter maintenant
        </button>
      </mat-dialog-actions>
    </div>
  `,
  // ... (styles remain the same)
})
export class SessionTimeoutDialog {
  private router = inject(Router);
  constructor(public dialogRef: MatDialogRef<SessionTimeoutDialog>) { }

  onReconnect() {
    console.log('SessionTimeoutDialog: REDIRECTING TO LOGIN');
    this.dialogRef.close();
    this.router.navigate(['/auth/login']);
  }
}
