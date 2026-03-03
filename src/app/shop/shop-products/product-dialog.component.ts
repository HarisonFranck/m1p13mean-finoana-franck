import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ShopService } from '../../core/services/shop.service';

@Component({
    selector: 'app-product-dialog',
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
    templateUrl: './product-dialog.component.html',
    styleUrl: './product-dialog.component.css'
})
export class ProductDialog implements OnInit {
    productForm: FormGroup;
    isEdit: boolean;
    categories: any[] = [];
    selectedFile: File | null = null;
    imagePreview: string | null = null;
    isSubmitting: boolean = false;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<ProductDialog>,
        private shopService: ShopService,
        private snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.isEdit = !!data.product;
        this.productForm = this.fb.group({
            name: [data.product?.name || '', [Validators.required]],
            price: [data.product?.price || '', [Validators.required, Validators.min(0)]],
            description: [data.product?.description || ''],
            category: [data.product?.category || '']
        });

        if (data.product?.picture) {
            this.imagePreview = data.product.picture;
        }
    }

    ngOnInit() {
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
            const reader = new FileReader();
            reader.onload = () => {
                this.imagePreview = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    }

    onSubmit() {
        if (this.productForm.valid && !this.isSubmitting) {
            this.isSubmitting = true;
            const formData = new FormData();
            formData.append('name', this.productForm.value.name);
            formData.append('price', this.productForm.value.price);
            formData.append('description', this.productForm.value.description);
            if (this.productForm.value.category) formData.append('category', this.productForm.value.category);

            if (this.selectedFile) {
                formData.append('picture', this.selectedFile);
            }

            if (this.isEdit) {
                this.shopService.updateProduct(this.data.product._id, formData).subscribe({
                    next: () => {
                        this.snackBar.open('Produit mis à jour', 'Fermer', { duration: 3000 });
                        this.dialogRef.close(true);
                    },
                    error: (err) => {
                        this.isSubmitting = false;
                        this.snackBar.open('Erreur: ' + (err.error?.message || 'Mise à jour échouée'), 'Fermer', { duration: 5000 });
                    }
                });
            } else {
                this.shopService.createProduct(formData).subscribe({
                    next: () => {
                        this.snackBar.open('Produit ajouté avec succès', 'Fermer', { duration: 3000 });
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
}
