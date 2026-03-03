import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ShopService } from '../../core/services/shop.service';
import { SocketService } from '../../core/services/socket.service';
import { Subscription } from 'rxjs';
import { PremiumEmptyState } from '../../shared/components/premium-empty-state';

@Component({
    selector: 'app-shop-reviews',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule,
        PremiumEmptyState
    ],
    templateUrl: './shop-reviews.html',
    styleUrl: './shop-reviews.css',
})
export class ShopReviews implements OnInit, OnDestroy {
    reviews: any[] = [];
    shop: any;
    isLoading = false;
    replyForms: { [key: string]: FormGroup } = {};
    private socketSub?: Subscription;

    constructor(
        private shopService: ShopService,
        private socketService: SocketService,
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.loadMyShopAndReviews();

        this.socketSub = this.socketService.onDataChanged().subscribe(change => {
            if (change.collection === 'reviews') {
                this.loadMyShopAndReviews();
            }
        });
    }

    ngOnDestroy() {
        this.socketSub?.unsubscribe();
    }

    loadMyShopAndReviews() {
        this.isLoading = true;
        this.cdr.detectChanges();
        this.shopService.getMyShop().subscribe({
            next: (shop) => {
                this.shop = shop;
                this.loadReviews(shop._id);
            },
            error: (err) => {
                console.error('Error loading shop:', err);
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    loadReviews(shopId: string) {
        this.shopService.getStats().subscribe({
            next: (stats) => {
                this.reviews = stats.reviews || [];
                this.reviews.forEach(review => {
                    this.replyForms[review._id] = this.fb.group({
                        comment: [review.reply?.comment || '', Validators.required]
                    });
                });
                setTimeout(() => {
                    this.isLoading = false;
                    this.cdr.detectChanges();
                });
            },
            error: (err) => {
                console.error('Error loading reviews:', err);
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    submitReply(reviewId: string) {
        const form = this.replyForms[reviewId];
        if (form.valid) {
            this.shopService.replyToReview(reviewId, form.value.comment).subscribe({
                next: () => {
                    this.snackBar.open('Votre réponse a été enregistrée', 'Fermer', { duration: 3000 });
                    this.loadMyShopAndReviews();
                }
            });
        }
    }

    getStars(rating: number): number[] {
        return Array(5).fill(0).map((x, i) => i < rating ? 1 : 0);
    }
}
