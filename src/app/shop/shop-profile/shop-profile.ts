import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ShopService } from '../../core/services/shop.service';
import { SocketService } from '../../core/services/socket.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-shop-profile',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatSelectModule,
        MatCheckboxModule,
        MatDividerModule,
        MatSnackBarModule
    ],
    templateUrl: './shop-profile.html',
    styleUrl: './shop-profile.css',
})
export class ShopProfile implements OnInit, OnDestroy {
    profileForm: FormGroup;
    isLoading = false;
    days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    selectedFile: File | null = null;
    imagePreview: string | null = null;
    private socketSub?: Subscription;

    constructor(
        private fb: FormBuilder,
        private shopService: ShopService,
        private socketService: SocketService,
        private snackBar: MatSnackBar,
        private cdr: ChangeDetectorRef
    ) {
        this.profileForm = this.fb.group({
            name: ['', Validators.required],
            description: [''],
            location: [''],
            picture: [''],
            openingHours: this.fb.array([]),
            contactInfo: this.fb.group({
                phone: [''],
                website: [''],
                socialMedia: this.fb.group({
                    facebook: [''],
                    instagram: ['']
                })
            })
        });
    }

    ngOnInit() {
        this.loadProfile();

        this.socketSub = this.socketService.onDataChanged().subscribe(change => {
            if (change.collection === 'shops' && change.data?._id === this.profileForm.get('_id')?.value) {
                this.loadProfile();
            }
        });
    }

    ngOnDestroy() {
        this.socketSub?.unsubscribe();
    }

    get openingHours(): FormArray {
        return this.profileForm.get('openingHours') as FormArray;
    }

    loadProfile() {
        this.isLoading = true;
        this.cdr.detectChanges();
        this.shopService.getMyShop().subscribe({
            next: (shop) => {
                this.profileForm.patchValue({
                    name: shop.name,
                    description: shop.description,
                    location: shop.location,
                    picture: shop.picture,
                    contactInfo: shop.contactInfo || {}
                });

                this.imagePreview = shop.picture;

                if (!this.profileForm.get('_id')) {
                    this.profileForm.addControl('_id', this.fb.control(shop._id));
                } else {
                    this.profileForm.get('_id')?.setValue(shop._id);
                }

                this.openingHours.clear();
                if (shop.openingHours && shop.openingHours.length > 0) {
                    shop.openingHours.forEach((oh: any) => {
                        this.openingHours.push(this.fb.group({
                            day: [oh.day],
                            open: [oh.open],
                            close: [oh.close],
                            isClosed: [oh.isClosed]
                        }));
                    });
                } else {
                    this.days.forEach(day => {
                        this.openingHours.push(this.fb.group({
                            day: [day],
                            open: ['09:00'],
                            close: ['20:00'],
                            isClosed: [false]
                        }));
                    });
                }

                setTimeout(() => {
                    this.isLoading = false;
                    this.cdr.detectChanges();
                });
            },
            error: (err) => {
                console.error('Error loading profile:', err);
                this.snackBar.open('Erreur lors du chargement du profil', 'Fermer', { duration: 3000 });
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
            const reader = new FileReader();
            reader.onload = () => {
                this.imagePreview = reader.result as string;
                this.cdr.detectChanges();
            };
            reader.readAsDataURL(file);
        }
    }

    onSubmit() {
        if (this.profileForm.valid) {
            this.isLoading = true;
            this.cdr.detectChanges();

            const formData = new FormData();
            Object.keys(this.profileForm.value).forEach(key => {
                const value = this.profileForm.get(key)?.value;
                if (key === 'contactInfo' || key === 'openingHours') {
                    formData.append(key, JSON.stringify(value));
                } else if (key !== 'picture') {
                    formData.append(key, value);
                }
            });

            if (this.selectedFile) {
                formData.append('picture', this.selectedFile);
            }

            this.shopService.updateShopProfile(formData).subscribe({
                next: (res) => {
                    this.snackBar.open('Profil mis à jour avec succès', 'Fermer', { duration: 3000 });
                    this.isLoading = false;
                    this.selectedFile = null;
                    if (res.picture) this.imagePreview = res.picture;
                    this.cdr.detectChanges();
                },
                error: (err) => {
                    console.error('Error updating profile:', err);
                    this.snackBar.open('Erreur lors de la mise à jour', 'Fermer', { duration: 3000 });
                    this.isLoading = false;
                    this.cdr.detectChanges();
                }
            });
        }
    }
}
