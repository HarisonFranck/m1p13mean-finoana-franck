import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ShopService } from '../../core/services/shop.service';
import { SocketService } from '../../core/services/socket.service';
import { Subscription } from 'rxjs';

import { PremiumEmptyState } from '../../shared/components/premium-empty-state';

@Component({
  selector: 'app-shop-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatDividerModule, PremiumEmptyState],
  templateUrl: './shop-dashboard.html',
  styleUrl: './shop-dashboard.css',
})
export class ShopDashboard implements OnInit, OnDestroy {
  stats: any = {
    productCount: 0,
    offerCount: 0,
    reviewCount: 0,
    rating: 0
  };
  reviews: any[] = [];
  loading: boolean = true;
  private socketSub?: Subscription;

  constructor(
    private shopService: ShopService,
    private socketService: SocketService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadStats();

    // Listen for real-time updates
    this.socketSub = this.socketService.onDataChanged().subscribe(change => {
      console.log('[DEBUG] Real-time update in Dashboard:', change);
      if (['reviews', 'offers', 'products', 'shops'].includes(change.collection)) {
        this.loadStats();
      }
    });
  }

  ngOnDestroy() {
    this.socketSub?.unsubscribe();
  }

  loadStats() {
    this.shopService.getStats().subscribe({
      next: (data) => {
        this.stats = data.stats;
        this.reviews = data.reviews;
        // Defer loading state change to prevent NG0100
        setTimeout(() => {
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.error('Error loading dashboard stats:', err);
        setTimeout(() => {
          this.loading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  navigateToCreateOffer() {
    this.router.navigate(['/shop/offers'], { queryParams: { action: 'create' } });
  }

  navigateToProfile() {
    this.router.navigate(['/shop/profile']);
  }
}
