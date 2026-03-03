import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule
  ],
  template: `
    <div class="user-dialog-premium-v2">
      <div class="header-container">
        <div class="header-main">
          <div class="title-info">
            <h2 mat-dialog-title>{{ data._id ? 'Modifier le Profil' : 'Enregistrer un Membre' }}</h2>
            <p class="subtitle">Gestion des accès et habilitations de la plateforme</p>
          </div>
          <button mat-icon-button (click)="onCancel()" class="close-btn">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>

      <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
        <mat-dialog-content class="content-v2">
          <div class="form-layout-v2">
            
            <!-- Section: Identity -->
            <div class="setup-section">
              <div class="setup-header">
                <span class="setup-num">01</span>
                <h3>Informations d'Identité</h3>
              </div>
              
              <div class="input-row">
                <mat-form-field appearance="outline" class="flex-1">
                  <mat-label>Nom complet</mat-label>
                  <input matInput formControlName="name" placeholder="Ex: Jean Paul">
                </mat-form-field>

                <mat-form-field appearance="outline" class="flex-1">
                  <mat-label>Adresse Email</mat-label>
                  <input matInput formControlName="email" placeholder="Ex: jean.paul@mall.com">
                </mat-form-field>
              </div>
            </div>

            <!-- Section: Security -->
            <div class="setup-section">
              <div class="setup-header">
                <span class="setup-num">02</span>
                <h3>Sécurité du Compte</h3>
              </div>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>{{ data._id ? 'Changer le mot de passe (laisser vide pour inchangé)' : 'Définir un mot de passe' }}</mat-label>
                <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" placeholder="Minimum 6 caractères">
                <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword; $event.preventDefault()">
                  <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
              </mat-form-field>
            </div>

            <!-- Section: Account Status -->
            <div class="setup-section no-border">
              <div class="setup-header">
                <span class="setup-num">04</span>
                <h3>Statut du Compte</h3>
              </div>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>État de l'accès</mat-label>
                <mat-select formControlName="status">
                  <mat-option [value]="1">Actif / Autorisé</mat-option>
                  <mat-option [value]="2">Suspendu / Bloqué</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

          </div>
        </mat-dialog-content>

        <mat-dialog-actions align="end" class="actions-v2">
          <button mat-button type="button" (click)="onCancel()" class="btn-cancel-v2">Annuler</button>
          <button mat-flat-button color="primary" class="btn-submit-v2" type="submit" [disabled]="userForm.invalid">
            {{ data._id ? 'Mettre à jour le profil' : 'Créer le nouveau compte' }}
          </button>
        </mat-dialog-actions>
      </form>
    </div>
  `,
  styles: [`
    .user-dialog-premium-v2 {
      background: #ffffff;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .header-container {
      padding: 20px 32px;
      border-bottom: 1px solid #f1f5f9;
    }

    .header-main {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .title-info h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.02em;
    }

    .subtitle {
      margin: 2px 0 0;
      font-size: 13px;
      color: #64748b;
    }

    .close-btn {
      margin-top: -8px;
      margin-right: -8px;
      color: #94a3b8;
    }

    .content-v2 {
      overflow-y: auto;
      background: #fbfcfd;
      max-height: 65vh;
      padding: 0 !important;
    }

    .form-layout-v2 {
      padding: 24px 32px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .setup-section {
      padding-bottom: 24px;
      border-bottom: 1px solid #f1f5f9;
    }

    .no-border {
      border-bottom: none;
      padding-bottom: 0;
    }

    .setup-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .setup-num {
      font-size: 11px;
      font-weight: 800;
      color: #3b82f6;
      background: #3b82f615;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
    }

    .setup-header h3 {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
      color: #334155;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .input-row {
      display: flex;
      gap: 16px;
    }

    .flex-1 { flex: 1; }

    /* Role Selection Grid */
    .role-selection-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .role-card-v2 {
      padding: 24px;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      background: white;
      display: flex;
      flex-direction: column;
      gap: 16px;
      cursor: pointer;
      position: relative;
      transition: all 0.2s ease;
    }

    .role-card-v2:hover {
      border-color: #3b82f640;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.03);
    }

    .role-card-v2.active {
      border-color: #3b82f6;
      background: #eff6ff;
      box-shadow: 0 4px 20px rgba(59, 130, 246, 0.08);
    }

    .radio-indicator {
      width: 20px;
      height: 20px;
      border: 2px solid #cbd5e1;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .role-card-v2.active .radio-indicator {
      border-color: #3b82f6;
      background: #3b82f6;
    }

    .inner-dot {
      width: 8px;
      height: 8px;
      background: white;
      border-radius: 50%;
      opacity: 0;
      transform: scale(0);
      transition: all 0.2s ease;
    }

    .role-card-v2.active .inner-dot {
      opacity: 1;
      transform: scale(1);
    }

    .role-icon-box {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: #f1f5f9;
      color: #64748b;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .role-icon-box.admin {
      background: #fee2e2;
      color: #ef4444;
    }

    .role-card-v2.active .role-icon-box:not(.admin) {
      background: #3b82f6;
      color: white;
    }

    .role-icon-box mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .role-text {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .role-title {
      font-weight: 700;
      font-size: 16px;
      color: #1e293b;
    }

    .role-desc {
      font-size: 12px;
      color: #64748b;
      line-height: 1.5;
    }

    .full-width {
      width: 100%;
    }

    .actions-v2 {
      padding: 16px 32px;
      background: white;
      border-top: 1px solid #f1f5f9;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    .btn-cancel-v2 {
      height: 44px;
      padding: 0 20px;
      font-weight: 700;
      color: #64748b;
    }

    .btn-submit-v2 {
      height: 44px;
      padding: 0 28px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 14px;
    }

    ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }
  `]
})
export class UserDialog {
  userForm: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userForm = this.fb.group({
      name: [data.name || '', Validators.required],
      email: [data.email || '', [Validators.required, Validators.email]],
      password: ['', data._id ? [] : [Validators.required, Validators.minLength(6)]],
      profile: [data.profile || 'SHOP', Validators.required],
      status: [data.status !== undefined ? data.status : 1]
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.dialogRef.close(this.userForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
