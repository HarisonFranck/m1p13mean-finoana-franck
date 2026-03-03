import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ShopService } from '../../core/services/shop.service';
import { AuthService } from '../../core/services/auth.service';
import { ShopStatusService } from '../../core/services/shop-status.service';
import { SocketService } from '../../core/services/socket.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-shop-layout',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        RouterLink,
        RouterLinkActive,
        MatSidenavModule,
        MatListModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule
    ],
    templateUrl: './shop-layout.html',
    styleUrl: './shop-layout.css',
})
export class ShopLayout implements OnInit, OnDestroy {
    isSidenavOpen = true;
    shop: any = null;
    statusInfo: any = null;
    private socketSub?: Subscription;

    constructor(
        private shopService: ShopService,
        private authService: AuthService,
        private shopStatusService: ShopStatusService,
        private socketService: SocketService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.loadMyShop();

        this.socketSub = this.socketService.onDataChanged().subscribe(change => {
            if (change.collection === 'shops' && (this.shop && change.data?._id === this.shop._id)) {
                this.loadMyShop();
            }
        });
    }

    ngOnDestroy() {
        this.socketSub?.unsubscribe();
    }

    loadMyShop() {
        this.shopService.getMyShop().subscribe({
            next: (shop) => {
                this.shop = shop;
                this.statusInfo = this.shopStatusService.calculateStatus(shop);
                // Fix NG0100 by deferring detection
                setTimeout(() => {
                    this.cdr.detectChanges();
                });
            },
            error: (err) => {
                console.error('Error loading shop:', err);
            }
        });
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/auth/login']);
    }
}
