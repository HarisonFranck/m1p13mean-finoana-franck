import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { SocketService } from '../../core/services/socket.service';
import { ConfirmDialog } from '../../shared/components/confirm-dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatDialogModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="mgmt-container-v3">
      <!-- Header Area -->
      <div class="header-glass-v3">
        <div class="text-group">
          <h1>Architecture Categorielle</h1>
          <p>Définissez et organisez les types d'enseignes présentes dans le complexe</p>
        </div>
        
        <form [formGroup]="catForm" (ngSubmit)="addCategory()" class="add-section-v3">
          <mat-form-field appearance="outline" class="premium-field">
            <mat-label>Nom de la catégorie</mat-label>
            <input matInput formControlName="name" placeholder="Ex: Gastronomie & Cafés">
            <mat-icon matPrefix>edit_note</mat-icon>
          </mat-form-field>
          <button mat-flat-button color="primary" class="btn-premium-add" type="submit" [disabled]="catForm.invalid">
            <mat-icon>plus_one</mat-icon>
            Ajouter au catalogue
          </button>
        </form>
      </div>

      <!-- Categories Grid -->
      <div class="grid-layout-v3" *ngIf="categories.length > 0; else emptyTpl">
        <div *ngFor="let cat of categories" class="cat-card-v3">
          <div class="card-bg-decoration"></div>
          <div class="card-inner">
            <div class="icon-orb">
              <mat-icon>layers</mat-icon>
            </div>
            <div class="info-stack">
              <span class="category-name">{{ cat.name }}</span>
              <span class="count-badge">ID: {{ cat._id.toString().slice(-6).toUpperCase() }}</span>
            </div>
            <button mat-icon-button (click)="deleteCategory(cat)" class="btn-remove-v3" matTooltip="Supprimer la catégorie">
              <mat-icon>delete_sweep</mat-icon>
            </button>
          </div>
        </div>
      </div>

      <ng-template #emptyTpl>
        <div class="empty-state-illustrative">
          <div class="illust-box">
            <mat-icon>inventory_2</mat-icon>
          </div>
          <h3>Aucune Catégorie Trouvée</h3>
          <p>Commencez par structurer votre catalogue en ajoutant des catégories de boutiques ci-dessus.</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .mgmt-container-v3 {
      padding: 40px;
      animation: slideIn 0.5s ease;
    }

    .header-glass-v3 {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(10px);
      padding: 32px;
      border-radius: 24px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.04);
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
      gap: 32px;
    }

    .text-group h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.02em;
    }

    .text-group p {
      margin: 4px 0 0;
      color: #64748b;
      font-size: 15px;
    }

    .add-section-v3 {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .premium-field {
      width: 320px;
    }

    ::ng-deep .premium-field .mat-mdc-form-field-subscript-wrapper { display: none; }

    .btn-premium-add {
      height: 56px;
      padding: 0 24px;
      border-radius: 14px;
      font-weight: 700;
      letter-spacing: 0.3px;
    }

    /* Grid Layout */
    .grid-layout-v3 {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }

    .cat-card-v3 {
      position: relative;
      background: white;
      border-radius: 20px;
      border: 1px solid #f1f5f9;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .cat-card-v3:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(79, 70, 229, 0.1);
      border-color: #4f46e530;
    }

    .card-bg-decoration {
      position: absolute;
      top: -20px;
      right: -20px;
      width: 80px;
      height: 80px;
      background: #4f46e508;
      border-radius: 50%;
      transition: all 0.3s ease;
    }

    .cat-card-v3:hover .card-bg-decoration {
      transform: scale(3);
      opacity: 0.15;
    }

    .card-inner {
      position: relative;
      z-index: 1;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .icon-orb {
      width: 52px;
      height: 52px;
      background: #f8fafc;
      color: #4f46e5;
      border-radius: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .cat-card-v3:hover .icon-orb {
      background: #4f46e5;
      color: white;
      transform: rotate(10deg);
    }

    .info-stack {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .category-name {
      font-size: 17px;
      font-weight: 800;
      color: #1e293b;
    }

    .count-badge {
      font-size: 11px;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 2px;
    }

    .btn-remove-v3 {
      color: #cbd5e1;
      transition: all 0.2s ease;
    }

    .cat-card-v3:hover .btn-remove-v3 {
      color: #ef4444;
    }

    /* Empty State */
    .empty-state-illustrative {
      padding: 100px 40px;
      text-align: center;
      background: #fbfcfd;
      border-radius: 32px;
      border: 2px dashed #e2e8f0;
    }

    .illust-box {
      width: 80px;
      height: 80px;
      background: white;
      border-radius: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      box-shadow: 0 10px 20px rgba(0,0,0,0.03);
    }

    .illust-box mat-icon { font-size: 40px; width: 40px; height: 40px; color: #cbd5e1; }

    h3 { margin: 0 0 10px; font-weight: 800; color: #0f172a; font-size: 20px; }
    p { color: #64748b; font-size: 16px; margin: 0; }

    @keyframes slideIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class CategoryManagement implements OnInit, OnDestroy {
  categories: any[] = [];
  catForm: FormGroup;
  private socketSubscription?: Subscription;

  constructor(
    private adminService: AdminService,
    private socketService: SocketService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.catForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCategories();
      this.setupRealtimeSync();
    }
  }

  ngOnDestroy() {
    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe();
    }
  }

  setupRealtimeSync() {
    this.socketSubscription = this.socketService.onDataChanged().subscribe(update => {
      console.log('Categories: Realtime update received:', update);
      if (update.collection === 'categories') {
        this.loadCategories();
      }
    });
  }

  loadCategories() {
    this.adminService.getAllCategories().subscribe({
      next: (cats) => this.categories = cats,
      error: (err) => console.error('Erreur chargement catégories', err)
    });
  }

  addCategory() {
    if (this.catForm.valid) {
      this.adminService.createCategory(this.catForm.value).subscribe({
        next: () => {
          this.snackBar.open('Catégorie ajoutée', '', { duration: 2000 });
          this.catForm.reset();
          this.loadCategories();
        },
        error: () => this.snackBar.open('Erreur lors de l\'ajout', 'Fermer')
      });
    }
  }

  deleteCategory(cat: any) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        message: 'Supprimer cette catégorie ? Cela peut affecter les boutiques associées.',
        targetName: cat.name
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.adminService.deleteCategory(cat._id).subscribe({
          next: () => {
            this.snackBar.open('Catégorie supprimée', '', { duration: 2000 });
            this.loadCategories();
          },
          error: () => this.snackBar.open('Erreur de suppression', 'Fermer')
        });
      }
    });
  }
}
