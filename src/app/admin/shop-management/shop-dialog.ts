import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../core/services/admin.service';

@Component({
  selector: 'app-shop-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <div class="shop-dialog-premium-v2">
      <div class="header-container">
        <div class="header-main">
          <div class="title-info">
            <h2 mat-dialog-title>{{ data._id ? 'Modifier la Boutique' : 'Enregistrer une Boutique' }}</h2>
            <p class="subtitle">Gestion des actifs et configuration des emplacements commerçants</p>
          </div>
          <button mat-icon-button (click)="onCancel()" class="close-btn">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>

      <form [formGroup]="shopForm" (ngSubmit)="onSubmit()">
        <mat-dialog-content class="content-v2">
          <div class="form-layout-v2">
            
            <!-- Section: Identity -->
            <div class="setup-section">
              <div class="setup-header">
                <span class="setup-num">01</span>
                <h3>Informations Générales</h3>
              </div>
              
              <div class="input-row">
                <mat-form-field appearance="outline" class="flex-2">
                  <mat-label>Nom de l'enseigne</mat-label>
                  <input matInput formControlName="name" placeholder="Ex: Boutique Fashion X">
                </mat-form-field>

                <mat-form-field appearance="outline" class="flex-1">
                  <mat-label>Emplacement</mat-label>
                  <input matInput formControlName="location" placeholder="Ex: A-42">
                </mat-form-field>
              </div>

              <div class="category-selection-pro">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Secteur d'activité</mat-label>
                  <mat-select formControlName="idCategory">
                    <mat-option *ngFor="let cat of categories" [value]="cat._id">
                      {{ cat.name }}
                    </mat-option>
                  </mat-select>
                </mat-form-field>
              </div>
            </div>

            <!-- Section: Owner (Ankara Style) -->
            <div class="setup-section">
              <div class="setup-header">
                <span class="setup-num">02</span>
                <h3>Attribution du Propriétaire</h3>
              </div>
              
              <div class="owner-selection-pro">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Sélectionner le gestionnaire (Profil SHOP)</mat-label>
                  <mat-select formControlName="idOwner">
                    <mat-option *ngFor="let user of shopUsers" [value]="user._id">
                      <div class="option-content">
                        <mat-icon>person</mat-icon>
                        <div class="option-details">
                          <span class="main-text">{{ user.name }}</span>
                          <span class="sub-text">{{ user.email }}</span>
                        </div>
                      </div>
                    </mat-option>
                  </mat-select>
                </mat-form-field>
              </div>
            </div>

            <!-- Section: Presence & Media -->
            <div class="setup-section">
              <div class="setup-header">
                <span class="setup-num">03</span>
                <h3>Visibilité & Médias</h3>
              </div>
              
              <div class="input-row">
                <mat-form-field appearance="outline" class="flex-1">
                  <mat-label>Statut de la boutique</mat-label>
                  <mat-select formControlName="status">
                    <mat-option [value]="1">Active / Ouverte</mat-option>
                    <mat-option [value]="0">Inactive / Fermée</mat-option>
                  </mat-select>
                </mat-form-field>

                <div class="custom-file-upload flex-2">
                  <span class="upload-label">Lien de l'image / Logo</span>
                  <div class="upload-area">
                    <input type="file" (change)="onFileSelected($event)" accept="image/*" class="file-input">
                    <mat-icon class="upload-icon">image</mat-icon>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section: Description -->
            <div class="setup-section no-border">
              <div class="setup-header">
                <span class="setup-num">04</span>
                <h3>Présentation</h3>
              </div>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Résumé des activités</mat-label>
                <textarea matInput formControlName="description" rows="3" placeholder="Quels produits ou services sont proposés ?"></textarea>
              </mat-form-field>
            </div>

          </div>
        </mat-dialog-content>

        <mat-dialog-actions align="end" class="actions-v2">
          <button mat-button type="button" (click)="onCancel()" class="btn-cancel-v2" [disabled]="isSubmitting">Annuler</button>
          <button mat-flat-button color="primary" class="btn-submit-v2" type="submit" [disabled]="shopForm.invalid || isSubmitting">
           {{ isSubmitting ? 'Chargement...' : (data._id ? 'Sauvegarder les modifications' : 'Créer la boutique') }}
          </button>
        </mat-dialog-actions>
      </form>
    </div>
  `,
  styles: [`
    .shop-dialog-premium-v2 {
      background: #ffffff;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .file-input {
      padding: 10px;
      margin-top: 5px;
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
      margin-bottom: 24px;
    }

    .setup-num {
      font-size: 12px;
      font-weight: 800;
      color: var(--primary);
      background: var(--primary-light);
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
    }

    .setup-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 700;
      color: #334155;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .input-row {
      display: flex;
      gap: 20px;
    }

    .flex-2 { flex: 2; }
    .flex-1 { flex: 1; }

    .category-selection-pro {
      margin-top: 24px;
    }

    .category-selection-pro label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: #64748b;
      margin-bottom: 12px;
    }

    .chip-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .choice-chip {
      padding: 10px 18px;
      border: 1px solid #e2e8f0;
      border-radius: 99px;
      font-size: 14px;
      font-weight: 600;
      color: #475569;
      background: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
    }

    .choice-chip mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #94a3b8;
    }

    .choice-chip:hover {
      border-color: var(--primary);
      color: var(--primary);
      background: var(--primary-light);
    }

    .choice-chip.selected {
      background: var(--primary);
      border-color: var(--primary);
      color: white;
    }

    .choice-chip.selected mat-icon {
      color: white;
    }

    /* Owner Radio Grid (Ankara Style) */
    .owner-selection-pro {
      margin-top: 16px;
    }

    .option-content {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 4px 0;
    }

    .option-content mat-icon {
      color: #94a3b8;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .option-details {
      display: flex;
      flex-direction: column;
      line-height: 1.4;
    }

    .main-text {
      font-weight: 700;
      font-size: 14px;
      color: #1e293b;
    }

    .sub-text {
      font-size: 12px;
      color: #64748b;
    }

    .verified-icon {
      position: absolute;
      top: 12px;
      right: 12px;
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: var(--primary);
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

    .custom-file-upload {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .upload-label {
      font-size: 13px;
      font-weight: 500;
      color: #334155;
      padding-left: 2px;
    }
    .upload-area {
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      padding: 10px 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f8fafc;
    }
    .upload-area input {
      font-size: 14px;
      color: #475569;
    }
    .upload-icon {
      color: #94a3b8;
    }
  `]
})
export class ShopDialog implements OnInit {
  shopForm: FormGroup;
  categories: any[] = [];
  shopUsers: any[] = [];
  isSubmitting: boolean = false;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    public dialogRef: MatDialogRef<ShopDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(PLATFORM_ID) private platformId: Object,
    private snackBar: MatSnackBar
  ) {
    this.isEditMode = !!data?._id;
    this.shopForm = this.fb.group({
      name: [data.name || '', Validators.required],
      idCategory: [data.idCategory?._id || data.idCategory || '', Validators.required],
      location: [data.location || ''],
      description: [data.description || ''],
      idOwner: [data.idOwner?._id || data.idOwner || '', Validators.required],
      status: [data.status !== undefined ? data.status : 1],
      picture: [data.picture || '']
    });
  }

  selectedFile: File | null = null;
  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.adminService.getAllCategories().subscribe(cats => {
        this.categories = cats;
        if (this.isEditMode && this.data?.idCategory) {
          this.shopForm.get('idCategory')?.setValue(this.data.idCategory._id || this.data.idCategory);
        }
      });
      this.adminService.getAllUsers().subscribe(users => {
        this.shopUsers = users.filter((user: any) => user.profile === 'SHOP' && user.status !== 0 && user.status !== 2);
        if (this.isEditMode && this.data?.idOwner) {
          this.shopForm.get('idOwner')?.setValue(this.data.idOwner._id || this.data.idOwner);
        }
      });
    }
  }

  onSubmit() {
    if (this.shopForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const formData = new FormData();
      Object.keys(this.shopForm.value).forEach(key => {
        // Only append picture if it's a string, we attach the file normally.
        if (key !== 'picture') {
          formData.append(key, this.shopForm.value[key]);
        }
      });
      if (this.selectedFile) {
        formData.append('picture', this.selectedFile);
      }

      if (this.isEditMode) {
        this.adminService.updateShop(this.data._id, formData).subscribe({
          next: () => {
            this.snackBar.open('Boutique mise à jour avec succès', 'Fermer', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (err) => {
            this.isSubmitting = false;
            this.snackBar.open('Erreur: ' + (err.error?.message || 'Mise à jour échouée'), 'Fermer', { duration: 5000 });
          }
        });
      } else {
        this.adminService.createShop(formData).subscribe({
          next: () => {
            this.snackBar.open('Boutique créée avec succès', 'Fermer', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (err) => {
            this.isSubmitting = false;
            this.snackBar.open('Erreur: ' + (err.error?.message || 'Création échouée'), 'Fermer', { duration: 5000 });
          }
        });
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
