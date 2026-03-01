import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatDialog } from '@angular/material/dialog';
import { AdminService } from '../../core/services/admin.service';
import { ConfirmDialog } from '../../shared/components/confirm-dialog';

@Component({
  selector: 'app-platform-settings-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatListModule
  ],
  template: `
    <div class="settings-dialog-premium-v2">
      <div class="header-container">
        <div class="header-main">
          <div class="title-info">
            <h2 mat-dialog-title>Configuration de la Plateforme</h2>
            <p class="subtitle">Gestion des actifs visuels et des taxonomies du complexe</p>
          </div>
          <button mat-icon-button (click)="onCancel()" class="close-btn">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>

      <mat-dialog-content class="content-v2 no-padding">
        <mat-tab-group class="premium-tabs-v2">
          <!-- Onglet : Identité Visuelle -->
          <mat-tab label="Identité Visuelle">
            <form [formGroup]="settingsForm" (ngSubmit)="onSubmit()" class="tab-content-v2">
              <div class="settings-section">
                <div class="section-header-v2">
                  <mat-icon>branding_watermark</mat-icon>
                  <span>Identité du Mall</span>
                </div>
                
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Nom public de l'enseigne</mat-label>
                  <input matInput formControlName="title" placeholder="Ex: Grand Mall Antananarivo">
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>URL de l'image de couverture (Hero)</mat-label>
                  <input matInput formControlName="bannerUrl" placeholder="https://images.unsplash.com/...">
                </mat-form-field>

                <div class="preview-zone" *ngIf="settingsForm.get('bannerUrl')?.value">
                  <div class="preview-label">Aperçu du rendu</div>
                  <div class="banner-preview-v2">
                    <img [src]="settingsForm.get('bannerUrl')?.value" (error)="onImageError($event)" alt="Banner">
                    <div class="preview-cap">
                      <span class="mall-title-cap">{{ settingsForm.get('title')?.value }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="tab-footer">
                <button mat-button type="button" (click)="onCancel()">Annuler</button>
                <button mat-flat-button color="primary" class="btn-save-settings" type="submit" [disabled]="settingsForm.invalid || isImageError">
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </mat-tab>

        </mat-tab-group>
      </mat-dialog-content>
    </div>
  `,
  styles: [`
    .settings-dialog-premium-v2 {
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
    }

    .no-padding {
      padding: 0 !important;
    }

    .tab-content-v2 {
      padding: 24px 32px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .tab-content-v2.column {
      min-height: 350px;
    }

    .settings-section {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .section-header-v2 {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 4px;
    }

    .section-header-v2 mat-icon {
      color: var(--primary);
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .section-header-v2 span {
      font-size: 12px;
      font-weight: 800;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .preview-zone {
      margin-top: 8px;
    }

    .preview-label {
      font-size: 12px;
      font-weight: 600;
      color: #94a3b8;
      margin-bottom: 12px;
    }

    .banner-preview-v2 {
      position: relative;
      height: 150px;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 16px rgba(0,0,0,0.06);
    }

    .banner-preview-v2 img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .preview-cap {
      position: absolute;
      inset: 0;
      background: linear-gradient(transparent, rgba(15, 23, 42, 0.8));
      display: flex;
      align-items: flex-end;
      padding: 16px;
    }

    .mall-title-cap {
      color: white;
      font-size: 18px;
      font-weight: 800;
      letter-spacing: -0.01em;
    }

    /* Category Box */
    .add-category-box {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      background: #f1f5f9;
      padding: 16px;
      border-radius: 16px;
    }

    .flex-grow { flex: 1; }

    .btn-add-cat {
      height: 52px;
      padding: 0 20px;
      border-radius: 10px;
      font-weight: 700;
    }

    .categories-list-premium {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
    }

    .cat-chip-premium {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      transition: all 0.2s ease;
    }

    .cat-chip-premium:hover {
      border-color: var(--primary);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.04);
    }

    .cat-info-v2 {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .cat-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--primary);
    }

    .cat-info-v2 span {
      font-weight: 700;
      font-size: 14px;
      color: #1e293b;
    }

    .btn-remove-cat {
      color: #cbd5e1;
      transition: all 0.2s ease;
    }

    .cat-chip-premium:hover .btn-remove-cat {
      color: #ef4444;
    }

    .empty-cats {
      grid-column: 1 / -1;
      padding: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      background: #f8fafc;
      border: 2px dashed #e2e8f0;
      border-radius: 16px;
      color: #94a3b8;
    }

    .empty-cats mat-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
    }

    .empty-cats p {
      margin: 0;
      font-weight: 600;
    }

    .tab-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 12px;
      padding-top: 24px;
      border-top: 1px solid #f1f5f9;
    }

    .btn-save-settings {
      height: 44px;
      padding: 0 20px;
      border-radius: 10px;
      font-weight: 700;
    }

    .btn-close-settings {
      height: 44px;
      font-weight: 700;
      color: #64748b;
    }

    .full-width { width: 100%; }

    ::ng-deep .premium-tabs-v2 .mat-mdc-tab-header {
      background: #ffffff;
      border-bottom: 1px solid #f1f5f9;
      padding: 0 40px;
    }

    ::ng-deep .premium-tabs-v2 .mat-mdc-tab {
      height: 64px !important;
    }

    ::ng-deep .premium-tabs-v2 .mat-mdc-tab .mdc-tab__text-label {
      font-weight: 800;
      font-size: 14px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
  `]
})
export class PlatformSettingsDialog implements OnInit {
  settingsForm: FormGroup;
  categoryCtrl: any;
  isImageError = false;
  categories: any[] = [];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private dialog: MatDialog, // Inject MatDialog
    public dialogRef: MatDialogRef<PlatformSettingsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.categoryCtrl = this.fb.control('', Validators.required);
    this.settingsForm = this.fb.group({
      title: [data.title || '', Validators.required],
      bannerUrl: [data.bannerUrl || '', Validators.required]
    });

    this.settingsForm.get('bannerUrl')?.valueChanges.subscribe(() => {
      this.isImageError = false;
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCategories();
    }
  }

  loadCategories() {
    this.adminService.getAllCategories().subscribe({
      next: (cats) => this.categories = cats,
      error: (err) => console.error("Erreur chargement des catégories", err)
    });
  }

  addCategory() {
    if (this.categoryCtrl.valid && this.categoryCtrl.value) {
      this.adminService.createCategory({ name: this.categoryCtrl.value }).subscribe({
        next: () => {
          this.categoryCtrl.reset();
          this.loadCategories();
        },
        error: (err) => console.error("Erreur lors de l'ajout", err)
      });
    }
  }

  deleteCategory(cat: any) {
    const confirmRef = this.dialog.open(ConfirmDialog, {
      data: {
        message: 'Voulez-vous vraiment supprimer cette catégorie ?',
        targetName: cat.name
      }
    });

    confirmRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.adminService.deleteCategory(cat._id).subscribe({
          next: () => this.loadCategories(),
          error: (err) => console.error("Erreur lors de la suppression", err)
        });
      }
    });
  }

  onImageError(event: any) {
    this.isImageError = true;
    event.target.style.display = 'none';
  }

  onSubmit() {
    if (this.settingsForm.valid && !this.isImageError) {
      this.dialogRef.close(this.settingsForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
