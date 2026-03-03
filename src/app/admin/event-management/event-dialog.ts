import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { AdminService } from '../../core/services/admin.service';

@Component({
  selector: 'app-event-dialog',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <div class="event-dialog-premium-v2">
      <div class="header-container">
        <div class="header-main">
          <div class="title-info">
            <h2 mat-dialog-title>Programmer un Événement</h2>
            <p class="subtitle">Planification des animations et promotions du complexe</p>
          </div>
          <button mat-icon-button (click)="onCancel()" class="close-btn">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>

      <form [formGroup]="eventForm" (ngSubmit)="onSubmit()">
        <mat-dialog-content class="content-v2">
          <div class="form-layout-v2">
            
            <!-- Section: Basics -->
            <div class="setup-section">
              <div class="setup-header">
                <span class="setup-num">01</span>
                <h3>Détails de l'Activité</h3>
              </div>
              
              <div class="input-row">
                <mat-form-field appearance="outline" class="flex-2">
                  <mat-label>Nom de l'événement</mat-label>
                  <input matInput formControlName="title" placeholder="Ex: Grande Braderie d'Hiver">
                </mat-form-field>

                <mat-form-field appearance="outline" class="flex-1">
                  <mat-label>Lieu / Zone</mat-label>
                  <input matInput formControlName="location" placeholder="Ex: Hall Central">
                </mat-form-field>
              </div>

              <div class="event-type-selection">
                <label>Nature de l'événement</label>
                <div class="type-chip-grid">
                  <div class="type-chip" 
                       *ngFor="let type of ['Promotion', 'Concert', 'Exposition', 'Atelier', 'Autre']" 
                       [class.selected]="eventForm.get('status')?.value === type"
                       (click)="eventForm.get('status')?.setValue(type)">
                    {{ type }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Section: Schedule -->
            <div class="setup-section">
              <div class="setup-header">
                <span class="setup-num">02</span>
                <h3>Calendrier</h3>
              </div>
              
              <div class="input-row">
                <mat-form-field appearance="outline" class="flex-1">
                  <mat-label>Date de début</mat-label>
                  <input matInput [matDatepicker]="startPicker" formControlName="startDate" (click)="startPicker.open()">
                  <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
                  <mat-datepicker #startPicker></mat-datepicker>
                </mat-form-field>

                <mat-form-field appearance="outline" class="flex-1">
                  <mat-label>Date de fin</mat-label>
                  <input matInput [matDatepicker]="endPicker" formControlName="endDate" (click)="endPicker.open()">
                  <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
                  <mat-datepicker #endPicker></mat-datepicker>
                </mat-form-field>
              </div>
            </div>

            <!-- Section: About -->
            <div class="setup-section no-border">
              <div class="setup-header">
                <span class="setup-num">03</span>
                <h3>Description</h3>
              </div>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Informations complémentaires</mat-label>
                <textarea matInput formControlName="description" rows="3" placeholder="Présentez le programme en quelques lignes..."></textarea>
              </mat-form-field>
            </div>

          </div>
        </mat-dialog-content>

        <mat-dialog-actions align="end" class="actions-v2">
          <button mat-button type="button" (click)="onCancel()" class="btn-cancel-v2">Annuler</button>
          <button mat-flat-button color="primary" class="btn-submit-v2" type="submit" [disabled]="eventForm.invalid">
            Enregistrer
          </button>
        </mat-dialog-actions>
      </form>
    </div>
  `,
  styles: [`
    .event-dialog-premium-v2 {
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
      color: #f59e0b;
      background: #f59e0b15;
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

    .flex-2 { flex: 2; }
    .flex-1 { flex: 1; }

    .event-type-selection {
      margin-top: 24px;
    }

    .event-type-selection label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: #64748b;
      margin-bottom: 12px;
    }

    .type-chip-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .type-chip {
      padding: 10px 20px;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      color: #475569;
      background: white;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .type-chip:hover {
      border-color: #f59e0b;
      background: #fef3c7;
      color: #92400e;
    }

    .type-chip.selected {
      background: #f59e0b;
      border-color: #f59e0b;
      color: white;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
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
export class EventDialog implements OnInit {
  eventForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    public dialogRef: MatDialogRef<EventDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.eventForm = this.fb.group({
      title: [data?.title || '', Validators.required],
      startDate: [data?.startDate || data?.date || ''],
      endDate: [data?.endDate || ''],
      location: [data?.location || ''],
      status: [data?.status || data?.type || ''],
      description: [data?.description || '']
    });
  }

  ngOnInit() { }

  onSubmit() {
    if (this.eventForm.valid) {
      this.dialogRef.close(this.eventForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
