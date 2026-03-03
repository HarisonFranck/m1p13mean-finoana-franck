import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-review-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatDialogModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule
    ],
    template: `
    <div class="review-dialog">
      <h2 mat-dialog-title>Donner votre avis</h2>
      <mat-dialog-content>
        <p>Votre expérience avec <strong>{{ data.targetName }}</strong></p>
        
        <div class="rating-stars">
          <mat-icon *ngFor="let s of [1,2,3,4,5]" 
                    [class.filled]="s <= rating" 
                    (click)="setRating(s)">
            {{ s <= rating ? 'star' : 'star_border' }}
          </mat-icon>
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Votre commentaire</mat-label>
          <textarea matInput [(ngModel)]="comment" rows="4" placeholder="Qu'avez-vous pensé de cette boutique/ce produit ?"></textarea>
        </mat-form-field>
      </mat-dialog-content>
      
      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">Annuler</button>
        <button mat-button class="btn-premium mat-primary" 
                [disabled]="rating === 0" 
                (click)="onSubmit()">
          Publier l'avis
        </button>
      </mat-dialog-actions>
    </div>
  `,
    styles: [`
    .review-dialog {
      padding: 20px;
    }
    .rating-stars {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin: 24px 0;
    }
    .rating-stars mat-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      cursor: pointer;
      color: #e2e8f0;
      transition: var(--transition);
    }
    .rating-stars mat-icon.filled {
      color: #f59e0b;
      transform: scale(1.2);
    }
    mat-form-field {
      width: 100%;
    }
  `]
})
export class ReviewDialogComponent {
    rating: number = 0;
    comment: string = '';

    constructor(
        public dialogRef: MatDialogRef<ReviewDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    setRating(r: number) {
        this.rating = r;
    }

    onCancel() {
        this.dialogRef.close();
    }

    onSubmit() {
        this.dialogRef.close({ rating: this.rating, comment: this.comment });
    }
}
