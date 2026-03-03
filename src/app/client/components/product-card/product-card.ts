import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="product-card">
      <div class="product-image">
        <img [src]="product.picture || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000'" [alt]="product.name">
        <div class="price-tag">{{ product.price | currency:'EUR' }}</div>
      </div>
      <div class="product-info">
        <h3>{{ product.name }}</h3>
        <p>{{ product.description }}</p>
        <div class="product-footer">
          <div class="rating">
            <mat-icon>star</mat-icon>
            <span>{{ product.rating?.toFixed(1) || '0.0' }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      background: white;
      border-radius: var(--radius-md);
      overflow: hidden;
      border: 1px solid var(--border);
      transition: var(--transition);
    }

    .product-card:hover {
      box-shadow: var(--shadow);
      border-color: var(--primary);
      transform: translateY(-4px);
    }

    .product-image {
      height: 180px;
      position: relative;
    }

    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .price-tag {
      position: absolute;
      bottom: 12px;
      right: 12px;
      background: var(--bg-sidebar);
      color: white;
      padding: 4px 10px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 14px;
    }

    .product-info {
      padding: 16px;
    }

    .product-info h3 {
      font-size: 16px;
      margin-bottom: 8px;
      color: var(--text-main);
    }

    .product-info p {
      font-size: 13px;
      color: var(--text-muted);
      margin-bottom: 16px;
      height: 40px;
      overflow: hidden;
    }

    .product-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .rating {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #f59e0b;
      font-weight: 600;
      font-size: 13px;
    }

    .rating mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .add-btn {
      color: var(--primary);
    }
  `]
})
export class ProductCardComponent {
  @Input() product: any;
}
