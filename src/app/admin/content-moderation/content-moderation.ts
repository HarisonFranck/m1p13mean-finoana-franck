import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminService } from '../../core/services/admin.service';
import { SocketService } from '../../core/services/socket.service';
import { ConfirmDialog } from '../../shared/components/confirm-dialog';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-content-moderation',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatTabsModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        MatDialogModule,
        MatSnackBarModule
    ],
    templateUrl: './content-moderation.html',
    styleUrl: './content-moderation.css'
})
export class ContentModeration implements OnInit, OnDestroy {
    offerColumns: string[] = ['title', 'target', 'date', 'status', 'actions'];
    reviewColumns: string[] = ['user', 'targetType', 'comment', 'rating', 'actions'];

    pendingOffers: any[] = [];
    allReviews: any[] = [];
    private socketSubscription?: Subscription;

    constructor(
        private adminService: AdminService,
        private socketService: SocketService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.loadPendingOffers();
            this.loadReviews();
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
            console.log('Moderation: Realtime update received:', update);
            if (update.collection === 'offers') {
                this.loadPendingOffers();
            } else if (update.collection === 'reviews') {
                this.loadReviews();
            }
        });
    }

    loadPendingOffers() {
        this.adminService.getPendingOffers().subscribe({
            next: (offers) => this.pendingOffers = offers,
            error: (err) => console.error('Erreur chargement des offres', err)
        });
    }

    loadReviews() {
        this.adminService.getAllReviews().subscribe({
            next: (reviews) => this.allReviews = reviews,
            error: (err) => console.error('Erreur chargement des avis', err)
        });
    }

    validateOffer(id: string) {
        this.adminService.updateOfferStatus(id, 'VALIDATED').subscribe({
            next: () => {
                this.snackBar.open('Offre validée !', '', { duration: 2000 });
                this.loadPendingOffers();
            }
        });
    }

    rejectOffer(id: string) {
        this.adminService.updateOfferStatus(id, 'REJECTED').subscribe({
            next: () => {
                this.snackBar.open('Offre rejetée', '', { duration: 2000 });
                this.loadPendingOffers();
            }
        });
    }

    deleteReview(review: any) {
        const dialogRef = this.dialog.open(ConfirmDialog, {
            data: {
                message: 'Supprimer cet avis ?',
                targetName: 'Avis de ' + (review.user?.name || 'utilisateur')
            }
        });

        dialogRef.afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.adminService.deleteReview(review._id).subscribe({
                    next: () => {
                        this.snackBar.open('Avis supprimé', '', { duration: 2000 });
                        this.loadReviews();
                    },
                    error: (err) => console.error('Erreur suppression', err)
                });
            }
        });
    }
}
