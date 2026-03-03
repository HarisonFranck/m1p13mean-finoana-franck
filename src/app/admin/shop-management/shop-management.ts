import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminService } from '../../core/services/admin.service';
import { SocketService } from '../../core/services/socket.service';
import { ShopDialog } from './shop-dialog';
import { ConfirmDialog } from '../../shared/components/confirm-dialog';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-shop-management',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        MatDialogModule,
        MatSnackBarModule
    ],
    templateUrl: './shop-management.html',
    styleUrl: './shop-management.css',
})
export class ShopManagement implements OnInit, OnDestroy {
    displayedColumns: string[] = ['name', 'category', 'location', 'status', 'actions'];
    allShops: any[] = [];
    dataSource = new MatTableDataSource<any>([]);
    categories: any[] = [];
    selectedCategory: string = 'Toutes';
    private socketSubscription?: Subscription;

    constructor(
        private adminService: AdminService,
        private socketService: SocketService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private cdr: ChangeDetectorRef,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.loadCategories();
            this.loadShops();
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
            console.log('Shops: Realtime update received:', update);
            if (update.collection === 'shops' || update.collection === 'categories') {
                this.loadShops();
                if (update.collection === 'categories') this.loadCategories();
            }
        });
    }

    loadCategories() {
        this.adminService.getAllCategories().subscribe({
            next: (cats) => this.categories = cats,
            error: (err) => console.error('Erreur chargement catégories', err)
        });
    }

    loadShops() {
        this.adminService.getAllShops().subscribe({
            next: (shops) => {
                console.log('Boutiques récupérées:', shops.length);
                this.allShops = shops.map((s: any) => ({
                    ...s,
                    categoryName: s.idCategory?.name || 'Non catégorisé',
                    locationDisplay: s.location || 'N/A',
                    statusDisplay: s.status === 1 ? 'Ouvert' : 'Fermé'
                }));
                this.applyFilter();
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Erreur chargement boutiques', err);
                if (err.status === 401) {
                    this.snackBar.open('Session expirée, veuillez vous reconnecter', 'OK', { duration: 5000 });
                } else {
                    this.snackBar.open('Erreur de chargement des boutiques', 'Fermer', { duration: 3000 });
                }
            }
        });
    }

    applyFilter() {
        if (this.selectedCategory === 'Toutes') {
            this.dataSource.data = [...this.allShops];
        } else {
            this.dataSource.data = this.allShops.filter(s => s.categoryName === this.selectedCategory);
        }
    }

    filterByCategory(category: string) {
        this.selectedCategory = category;
        this.applyFilter();
    }

    openShopDialog(shop?: any) {
        const dialogRef = this.dialog.open(ShopDialog, {
            panelClass: ['large-dialog', 'premium-dialog-surface'],
            data: shop || {}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (shop?._id) {
                    this.adminService.updateShop(shop._id, result).subscribe({
                        next: () => {
                            this.snackBar.open('Boutique mise à jour !', '', { duration: 2000 });
                            this.loadShops();
                        },
                        error: () => this.snackBar.open('Erreur de mise à jour', 'Fermer')
                    });
                } else {
                    this.adminService.createShop(result).subscribe({
                        next: () => {
                            this.snackBar.open('Boutique créée !', '', { duration: 2000 });
                            this.loadShops();
                        },
                        error: () => this.snackBar.open('Erreur de création', 'Fermer')
                    });
                }
            }
        });
    }

    deleteShop(shop: any) {
        const dialogRef = this.dialog.open(ConfirmDialog, {
            data: {
                message: 'Supprimer cette boutique ?',
                targetName: shop.name
            }
        });

        dialogRef.afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.adminService.deleteShop(shop._id).subscribe({
                    next: () => {
                        this.snackBar.open('Boutique supprimée', '', { duration: 2000 });
                        this.loadShops();
                    },
                    error: () => this.snackBar.open('Erreur de suppression', 'Fermer')
                });
            }
        });
    }
}
