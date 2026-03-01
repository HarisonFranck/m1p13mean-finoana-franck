import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminService } from '../../core/services/admin.service';
import { EventDialog } from './event-dialog';
import { ConfirmDialog } from '../../shared/components/confirm-dialog';

@Component({
    selector: 'app-event-management',
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
    templateUrl: './event-management.html',
    styleUrl: './event-management.css',
})
export class EventManagement implements OnInit {
    displayedColumns: string[] = ['title', 'date', 'location', 'type', 'actions'];
    dataSource = new MatTableDataSource<any>([]);

    constructor(
        private adminService: AdminService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private cdr: ChangeDetectorRef,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.loadEvents();
        }
    }

    loadEvents() {
        this.adminService.getAllEvents().subscribe({
            next: (events) => {
                console.log('Evénements récupérés:', events.length);
                this.dataSource.data = events.map((e: any) => ({
                    ...e,
                    startDate: e.startDate || e.createdAt,
                    endDate: e.endDate,
                    date: e.startDate || e.createdAt, // For existing logic or fallback
                    location: e.location || 'Non spécifié',
                    type: e.status || 'Standard'
                }));
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Erreur chargement événements', err);
                this.snackBar.open('Erreur de chargement des événements', 'Fermer', { duration: 3000 });
            }
        });
    }

    deleteEvent(event: any) {
        const dialogRef = this.dialog.open(ConfirmDialog, {
            data: {
                message: 'Voulez-vous vraiment supprimer cet événement ?',
                targetName: event.title
            }
        });

        dialogRef.afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.adminService.deleteEvent(event._id).subscribe({
                    next: () => {
                        this.snackBar.open('Événement supprimé', '', { duration: 2000 });
                        this.loadEvents();
                    },
                    error: (err) => this.snackBar.open('Erreur de suppression', 'Fermer')
                });
            }
        });
    }

    openEventDialog(event?: any) {
        const dialogRef = this.dialog.open(EventDialog, {
            panelClass: ['large-dialog', 'premium-dialog-surface'],
            data: event || {}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (event?._id) {
                    this.adminService.updateEvent(event._id, result).subscribe({
                        next: () => {
                            this.snackBar.open('Événement mis à jour !', '', { duration: 2000 });
                            this.loadEvents();
                        },
                        error: (err) => this.snackBar.open('Erreur de mise à jour', 'Fermer')
                    });
                } else {
                    this.adminService.createEvent(result).subscribe({
                        next: () => {
                            this.snackBar.open('Événement créé !', '', { duration: 2000 });
                            this.loadEvents();
                        },
                        error: (err) => this.snackBar.open('Erreur de création', 'Fermer')
                    });
                }
            }
        });
    }
}
