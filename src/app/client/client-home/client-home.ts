import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, take } from 'rxjs';
import { ClientService } from '../../core/services/client.service';
import { SocketService } from '../../core/services/socket.service';
import { SearchBarComponent } from '../components/search-bar/search-bar';
import { CategoryChipsComponent } from '../components/category-chips/category-chips';
import { ShopCardComponent } from '../components/shop-card/shop-card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-client-home',
  standalone: true,
  imports: [
    CommonModule,
    SearchBarComponent,
    CategoryChipsComponent,
    ShopCardComponent,
    MatIconModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './client-home.html',
  styleUrl: './client-home.css',
})
export class ClientHome implements OnInit {
  shops: any[] = [];
  categories: any[] = [];
  featuredOffers: any[] = [];
  products: any[] = [];

  selectedCategoryId: string | null = null;
  searchQuery: string = '';
  loading: boolean = true;

  constructor(
    private clientService: ClientService,
    private socketService: SocketService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadInitialData();
    this.setupRealtimeSync();
  }

  setupRealtimeSync() {
    this.socketService.onDataChanged().subscribe(change => {
      console.log('[CLIENT] Realtime sync triggered:', change.collection);
      if (['shops', 'categories', 'offers', 'products'].includes(change.collection)) {
        this.loadInitialData(); // Refresh everything for consistency
      }
    });
  }

  loadInitialData() {
    this.loading = true;

    const params: any = {};
    if (this.selectedCategoryId) params.category = this.selectedCategoryId;
    if (this.searchQuery) params.q = this.searchQuery;

    const requests: any = {
      categories: this.clientService.getCategories().pipe(take(1)),
      shops: this.clientService.getShops(params).pipe(take(1)),
      offers: this.clientService.getOffers().pipe(take(1))
    };

    if (this.searchQuery) {
      requests.products = this.clientService.getProducts(params).pipe(take(1));
    }

    forkJoin(requests).subscribe({
      next: (result: any) => {
        // Wrap state changes in setTimeout to avoid NG0100
        // and ensure the view updates in a clean cycle.
        setTimeout(() => {
          this.categories = result.categories;
          this.shops = result.shops || [];
          this.featuredOffers = result.offers.slice(0, 3);
          this.products = result.products || [];
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.error('Error loading initial data', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadShops() {
    // Keep this for filters/search
    const params: any = {};
    if (this.selectedCategoryId) params.category = this.selectedCategoryId;
    if (this.searchQuery) params.q = this.searchQuery;

    const requests: any = {
      shops: this.clientService.getShops(params)
    };

    if (this.searchQuery) {
      requests.products = this.clientService.getProducts(params);
    } else {
      this.products = [];
    }

    forkJoin(requests).subscribe({
      next: (data: any) => {
        this.shops = data.shops || [];
        if (data.products) {
          this.products = data.products || [];
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading data', err)
    });
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.loadShops();
  }

  onCategorySelect(categoryId: string | null) {
    this.selectedCategoryId = categoryId;
    this.loadShops();
  }
}
