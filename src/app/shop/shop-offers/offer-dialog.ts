import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { ShopService } from '../../core/services/shop.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-offer-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatIconModule
    ],
    templateUrl: './offer-dialog.html',
    styleUrl: './offer-dialog.css'
})
export class OfferDialog implements OnInit {
    offerForm: FormGroup;
    isEdit = false;
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private shopService: ShopService,
        private snackBar: MatSnackBar,
        public dialogRef: MatDialogRef<OfferDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.offerForm = this.fb.group({
            title: ['', Validators.required],
            description: ['', Validators.required],
            startDate: [new Date(), Validators.required],
            endDate: ['', Validators.required],
            idTarget: [''],
            targetType: ['Shop']
        });
    }

    ngOnInit() {
        if (this.data.offer) {
            this.isEdit = true;
            this.offerForm.patchValue({
                title: this.data.offer.title,
                description: this.data.offer.description,
                startDate: new Date(this.data.offer.startDate),
                endDate: new Date(this.data.offer.endDate),
                idTarget: this.data.offer.idTarget,
                targetType: this.data.offer.targetType
            });
        } else {
            this.offerForm.patchValue({
                idTarget: this.data.shopId
            });
        }
    }

    onSubmit() {
        if (this.offerForm.valid) {
            this.isLoading = true;
            const obs = this.isEdit
                ? this.shopService.updateOffer(this.data.offer._id, this.offerForm.value)
                : this.shopService.createOffer(this.offerForm.value);

            obs.subscribe({
                next: (res) => {
                    this.snackBar.open(this.isEdit ? 'Offre mise à jour' : 'Offre créée et soumise à validation', 'Fermer', { duration: 3000 });
                    this.dialogRef.close(true);
                },
                error: (err) => {
                    this.snackBar.open('Erreur lors de l\'enregistrement', 'Fermer', { duration: 3000 });
                    this.isLoading = false;
                }
            });
        }
    }
}
