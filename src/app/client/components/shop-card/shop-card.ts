import { Component, Input, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { ClientService } from '../../../core/services/client.service';
import { AuthService } from '../../../core/services/auth.service';
import { ShopStatusService, ShopStatus } from '../../../core/services/shop-status.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-shop-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, RouterLink, MatSnackBarModule],
  template: `
    <div class="shop-card" [routerLink]="['/client/shop', shop._id]">
      <div class="card-image">
        <img [src]="shop.picture || 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=2000'" [alt]="shop.name">
        <div class="category-badge">{{ shop.idCategory?.name }}</div>
        <button *ngIf="authService.isAuthenticated()" class="favorite-btn" (click)="toggleFavorite($event)">
          <mat-icon>{{ isFavorite ? 'favorite' : 'favorite_border' }}</mat-icon>
        </button>
        <div class="status-overlay" *ngIf="statusInfo" [ngClass]="statusInfo.class">
          <mat-icon *ngIf="statusInfo.class === 'closing-soon'">alarm</mat-icon>
          <span>{{ statusInfo.label }}</span>
        </div>
      </div>
      <div class="card-content">
        <div class="card-header">
          <h3 class="shop-name">{{ shop.name }}</h3>
          <div class="rating">
            <mat-icon>star</mat-icon>
            <span>{{ shop.rating?.toFixed(1) || '0.0' }}</span>
          </div>
        </div>
        <p class="description">{{ shop.description | slice:0:80 }}{{ shop.description?.length > 80 ? '...' : '' }}</p>
        <div class="card-footer">
          <div class="location">
            <mat-icon>location_on</mat-icon>
            <span>{{ shop.location }}</span>
          </div>
          <div class="next-change" *ngIf="statusInfo?.nextChange">
            {{ statusInfo!.nextChange }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .shop-card {
      background: white;
      border-radius: var(--radius-lg);
      overflow: hidden;
      border: 1px solid var(--border);
      transition: var(--transition);
      cursor: pointer;
      height: 100%;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .shop-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-lg);
      border-color: var(--primary);
    }

    .card-image {
      height: 200px;
      position: relative;
      overflow: hidden;
    }

    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .shop-card:hover .card-image img {
      transform: scale(1.1);
    }

    .status-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 8px 16px;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 700;
      font-size: 12px;
      text-transform: uppercase;
      z-index: 5;
    }

    .status-overlay.open { color: #10b981; }
    .status-overlay.closed { color: #ef4444; }
    .status-overlay.closing-soon { color: #f59e0b; }
    .status-overlay.vacation { color: #6366f1; }

    .category-badge {
      position: absolute;
      top: 16px;
      left: 16px;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(8px);
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      color: var(--primary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      z-index: 10;
    }

    .favorite-btn {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(8px);
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--text-muted);
      transition: var(--transition);
      z-index: 10;
    }

    .favorite-btn:hover {
      background: white;
      color: #ff4757;
      transform: scale(1.1);
    }

    .card-content {
      padding: 24px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }

    .shop-name {
      font-size: 18px;
      font-weight: 700;
      color: var(--text-main);
      margin: 0;
    }

    .rating {
      display: flex;
      align-items: center;
      gap: 4px;
      background: #fff9db;
      padding: 4px 8px;
      border-radius: 8px;
      color: #f59e0b;
      font-weight: 700;
      font-size: 13px;
    }

    .rating mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .description {
      font-size: 14px;
      color: var(--text-muted);
      line-height: 1.6;
      margin-bottom: 20px;
      flex-grow: 1;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 16px;
      border-top: 1px solid #f1f5f9;
    }

    .location {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--text-muted);
      font-size: 13px;
    }

    .location mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .next-change { font-size: 12px; color: var(--text-muted); font-weight: 500; }
  `]
})
export class ShopCardComponent implements OnInit {
  @Input() shop: any;
  @Input() isFavorite: boolean = false;
  statusInfo?: ShopStatus;

  constructor(
    private clientService: ClientService,
    private shopStatusService: ShopStatusService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.statusInfo = this.shopStatusService.calculateStatus(this.shop);
  }

  toggleFavorite(event: Event) {
    event.stopPropagation();
    if (this.isFavorite) {
      this.clientService.removeFavorite(this.shop._id).subscribe(() => {
        this.isFavorite = false;
        this.snackBar.open(`${this.shop.name} retiré des favoris`, 'OK', { duration: 2000 });
        this.cdr.detectChanges();
      });
    } else {
      this.clientService.addFavorite(this.shop._id).subscribe(() => {
        this.isFavorite = true;
        this.snackBar.open(`${this.shop.name} ajouté aux favoris !`, 'OK', { duration: 2000 });
        this.cdr.detectChanges();
      });
    }
  }
}
