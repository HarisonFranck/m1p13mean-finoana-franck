import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AdminService } from '../../core/services/admin.service';
import { SocketService } from '../../core/services/socket.service';
import { UserDialog } from './user-dialog';
import { ConfirmDialog } from '../../shared/components/confirm-dialog';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-user-management',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatSnackBarModule,
        MatDialogModule,
        MatTooltipModule
    ],
    templateUrl: './user-management.html',
    styleUrl: './user-management.css'
})
export class UserManagement implements OnInit, OnDestroy {
    displayedColumns: string[] = ['name', 'email', 'profile', 'status', 'actions'];
    allUsers: any[] = [];
    dataSource = new MatTableDataSource<any>([]);
    selectedFilter: string = 'Tous';
    private socketSubscription?: Subscription;

    stats = {
        all: 0,
        active: 0,
        suspended: 0,
        admins: 0
    };

    constructor(
        private adminService: AdminService,
        private socketService: SocketService,
        private snackBar: MatSnackBar,
        private dialog: MatDialog,
        private cdr: ChangeDetectorRef,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.loadUsers();
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
            console.log('Users: Realtime update received:', update);
            if (update.collection === 'users') {
                this.loadUsers();
            }
        });
    }

    loadUsers() {
        this.adminService.getAllUsers().subscribe({
            next: (users) => {
                console.log('Utilisateurs récupérés:', users?.length);
                this.allUsers = Array.isArray(users) ? users : [];
                this.calculateStats();
                this.applyFilter();
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Erreur chargement utilisateurs', err);
                this.snackBar.open('Erreur de chargement des utilisateurs', 'Fermer', { duration: 3000 });
            }
        });
    }

    calculateStats() {
        if (!this.allUsers) return;
        this.stats.all = this.allUsers.length;
        this.stats.active = this.allUsers.filter(u => u.status === 1).length;
        this.stats.suspended = this.allUsers.filter(u => u.status === 2).length;
        this.stats.admins = this.allUsers.filter(u => (u.profile === 'ADMIN' || u.profile === 'admin')).length;
    }

    applyFilter() {
        if (!this.allUsers) return;
        let filtered = [];
        const filter = this.selectedFilter;

        if (filter === 'Tous') {
            filtered = [...this.allUsers];
        } else if (filter === 'Actifs') {
            filtered = this.allUsers.filter(u => u.status === 1);
        } else if (filter === 'Suspendus') {
            filtered = this.allUsers.filter(u => u.status === 2);
        } else if (filter === 'Admins') {
            filtered = this.allUsers.filter(u => (u.profile === 'ADMIN' || u.profile === 'admin'));
        }

        this.dataSource.data = filtered;
    }

    setFilter(filter: string) {
        this.selectedFilter = filter;
        this.applyFilter();
    }

    onSearch(event: any) {
        const query = (event.target as HTMLInputElement).value?.toLowerCase();
        this.applyFilter();
        if (query) {
            this.dataSource.data = this.dataSource.data.filter(u =>
                (u.name && u.name.toLowerCase().includes(query)) ||
                (u.email && u.email.toLowerCase().includes(query))
            );
        }
    }

    activateUser(id: string) {
        this.adminService.updateUserStatus(id, 1).subscribe({
            next: () => {
                this.snackBar.open('Utilisateur activé', '', { duration: 2000 });
                this.loadUsers();
            },
            error: () => this.snackBar.open('Erreur d\'activation', 'Fermer')
        });
    }

    suspendUser(id: string) {
        this.adminService.updateUserStatus(id, 2).subscribe({
            next: () => {
                this.snackBar.open('Utilisateur suspendu', '', { duration: 2000 });
                this.loadUsers();
            },
            error: () => this.snackBar.open('Erreur de suspension', 'Fermer')
        });
    }

    openUserDialog(user?: any) {
        const dialogRef = this.dialog.open(UserDialog, {
            panelClass: ['large-dialog', 'premium-dialog-surface'],
            data: user ? { ...user } : {}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (user && user._id) {
                    this.adminService.updateUser(user._id, result).subscribe({
                        next: () => {
                            this.snackBar.open('Utilisateur modifié !', '', { duration: 2000 });
                            this.loadUsers();
                        },
                        error: () => this.snackBar.open('Erreur de modification', 'Fermer')
                    });
                } else {
                    this.adminService.createUser(result).subscribe({
                        next: () => {
                            this.snackBar.open('Utilisateur créé !', '', { duration: 2000 });
                            this.loadUsers();
                        },
                        error: () => this.snackBar.open('Erreur de création', 'Fermer')
                    });
                }
            }
        });
    }

    deleteUser(user: any) {
        const dialogRef = this.dialog.open(ConfirmDialog, {
            data: {
                message: 'Supprimer définitivement cet utilisateur ?',
                targetName: user.name
            }
        });

        dialogRef.afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.adminService.deleteUser(user._id).subscribe({
                    next: () => {
                        this.snackBar.open('Utilisateur supprimé', '', { duration: 2000 });
                        this.loadUsers();
                    },
                    error: () => this.snackBar.open('Erreur de suppression', 'Fermer')
                });
            }
        });
    }
}
