import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ShopService } from '../../core/services/shop.service';
import { SocketService } from '../../core/services/socket.service';
import { Subscription } from 'rxjs';

import { OfferDialog } from './offer-dialog';
import { PremiumEmptyState } from '../../shared/components/premium-empty-state';

@Component({
    selector: 'app-shop-offers',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatChipsModule,
        MatDialogModule,
        MatSnackBarModule,
        PremiumEmptyState
    ],
    templateUrl: './shop-offers.html',
    styleUrl: './shop-offers.css',
})
export class ShopOffers implements OnInit, OnDestroy {
    offers: any[] = [];
    shop: any;
    displayedColumns: string[] = ['title', 'startDate', 'endDate', 'status', 'actions'];
    private socketSub?: Subscription;

    constructor(
        private shopService: ShopService,
        private socketService: SocketService,
        private route: ActivatedRoute,
        private snackBar: MatSnackBar,
        private dialog: MatDialog
    ) { }

    ngOnInit() {
        this.loadMyShop();
        this.loadOffers();

        this.socketSub = this.socketService.onDataChanged().subscribe(change => {
            if (change.collection === 'offers') {
                this.loadOffers();
            }
        });
    }

    ngOnDestroy() {
        this.socketSub?.unsubscribe();
    }

    loadMyShop() {
        this.shopService.getMyShop().subscribe(s => {
            this.shop = s;
            // Workflow: Check if we should auto-open creation dialog
            const action = this.route.snapshot.queryParams['action'];
            if (action === 'create') {
                this.openOfferDialog();
            }
        });
    }

    loadOffers() {
        this.shopService.getMyOffers().subscribe({
            next: (offers) => {
                this.offers = offers;
            },
            error: (err) => {
                this.snackBar.open('Erreur lors du chargement des offres', 'Fermer', { duration: 3000 });
            }
        });
    }

    getStatusColor(status: string): string {
        switch (status) {
            case 'VALIDATED': return 'success';
            case 'PENDING': return 'warning';
            case 'REJECTED': return 'error';
            default: return 'neutral';
        }
    }

    openOfferDialog(offer?: any) {
        const dialogRef = this.dialog.open(OfferDialog, {
            width: '500px',
            data: { offer, shopId: this.shop?._id }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadOffers();
            }
        });
    }

    deleteOffer(id: string) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
            this.shopService.deleteOffer(id).subscribe({
                next: () => {
                    this.snackBar.open('Offre supprimée', 'Fermer', { duration: 3000 });
                    this.loadOffers();
                },
                error: (err) => {
                    this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
                }
            });
        }
    }
}
