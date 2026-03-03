import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ShopService } from '../../core/services/shop.service';
import { SocketService } from '../../core/services/socket.service';
import { Subscription } from 'rxjs';
import { ProductDialog } from './product-dialog.component';
import { PremiumEmptyState } from '../../shared/components/premium-empty-state';

@Component({
    selector: 'app-shop-products',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatDialogModule,
        MatSnackBarModule,
        PremiumEmptyState
    ],
    templateUrl: './shop-products.html',
    styleUrl: './shop-products.css',
})
export class ShopProducts implements OnInit, OnDestroy {
    products: any[] = [];
    isLoading = false;
    displayedColumns: string[] = ['image', 'name', 'price', 'category', 'actions'];
    private socketSub?: Subscription;

    constructor(
        private shopService: ShopService,
        private socketService: SocketService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.loadProducts();

        this.socketSub = this.socketService.onDataChanged().subscribe(change => {
            if (change.collection === 'products') {
                this.loadProducts();
            }
        });
    }

    ngOnDestroy() {
        this.socketSub?.unsubscribe();
    }

    loadProducts() {
        this.isLoading = true;
        this.shopService.getMyProducts().subscribe({
            next: (products) => {
                this.products = products;
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading products:', err);
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    openProductDialog(product?: any) {
        const dialogRef = this.dialog.open(ProductDialog, {
            width: '500px',
            data: { product }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadProducts();
            }
        });
    }

    deleteProduct(id: string) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            this.shopService.deleteProduct(id).subscribe({
                next: () => {
                    this.snackBar.open('Produit supprimé', 'Fermer', { duration: 3000 });
                    this.loadProducts();
                }
            });
        }
    }
}
