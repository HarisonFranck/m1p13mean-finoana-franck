import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ClientService } from '../../core/services/client.service';
import { ProductCardComponent } from '../components/product-card/product-card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReviewDialogComponent } from '../components/review-dialog/review-dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ShopStatusService, ShopStatus } from '../../core/services/shop-status.service';

@Component({
    selector: 'app-shop-details',
    standalone: true,
    imports: [CommonModule, ProductCardComponent, MatIconModule, MatButtonModule, MatTabsModule, RouterLink, MatDialogModule, MatSnackBarModule],
    templateUrl: './shop-details.html',
    styleUrl: './shop-details.css'
})
export class ShopDetails implements OnInit {
    shopId: string | null = null;
    shopData: any = null;
    loading: boolean = true;
    isFavorite: boolean = false;
    statusInfo?: ShopStatus;

    constructor(
        private route: ActivatedRoute,
        private clientService: ClientService,
        private shopStatusService: ShopStatusService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private cdr: ChangeDetectorRef,
        public authService: AuthService
    ) { }

    ngOnInit() {
        this.shopId = this.route.snapshot.paramMap.get('id');
        if (this.shopId) {
            this.loadShopDetails();
            this.checkFavoriteStatus();
        }
    }

    // ... other methods ...

    loadShopDetails() {
        this.loading = true;
        this.clientService.getShopDetails(this.shopId!).subscribe({
            next: (data) => {
                this.shopData = data;
                this.statusInfo = this.shopStatusService.calculateStatus(data.shop);
                this.loading = false;
                setTimeout(() => this.cdr.detectChanges());
            },
            error: (err) => {
                console.error('Error loading shop details', err);
                this.loading = false;
            }
        });
    }

    checkFavoriteStatus() {
        this.clientService.getFavorites().subscribe(favorites => {
            this.isFavorite = favorites.some(fav => fav._id === this.shopId);
        });
    }

    toggleFavorite() {
        if (this.isFavorite) {
            this.clientService.removeFavorite(this.shopId!).subscribe(() => {
                this.isFavorite = false;
                this.snackBar.open('Retiré des favoris', 'OK', { duration: 2000 });
            });
        } else {
            this.clientService.addFavorite(this.shopId!).subscribe(() => {
                this.isFavorite = true;
                this.snackBar.open('Ajouté aux favoris !', 'OK', { duration: 2000 });
            });
        }
    }

    openReviewDialog() {
        const dialogRef = this.dialog.open(ReviewDialogComponent, {
            width: '500px',
            data: { targetName: this.shopData.shop.name }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                const review = {
                    idTarget: this.shopId,
                    targetType: 'Shop',
                    rating: result.rating,
                    comment: result.comment
                };
                this.clientService.postReview(review).subscribe(() => {
                    this.snackBar.open('Merci pour votre avis !', 'OK', { duration: 3000 });
                    this.loadShopDetails();
                });
            }
        });
    }
}
