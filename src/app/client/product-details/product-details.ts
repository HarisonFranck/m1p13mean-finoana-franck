import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ClientService } from '../../core/services/client.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-product-details',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule, RouterLink],
    templateUrl: './product-details.html',
    styleUrl: './product-details.css'
})
export class ProductDetails implements OnInit {
    productId: string | null = null;
    product: any = null;
    loading: boolean = true;

    constructor(
        private route: ActivatedRoute,
        private clientService: ClientService,
        public authService: AuthService
    ) { }

    ngOnInit() {
        this.productId = this.route.snapshot.paramMap.get('id');
        if (this.productId) {
            this.loadProductDetails();
        }
    }

    loadProductDetails() {
        this.loading = true;
        // Assuming we can get product by ID. I'll need to check if there's an endpoint for this or use search with ID.
        // For now, I'll fetch all and filter or assume there's a backend endpoint I'll add if needed.
        this.clientService.getProducts({ id: this.productId }).subscribe({
            next: (products: any[]) => {
                this.product = products.find(p => p._id === this.productId);
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading product details', err);
                this.loading = false;
            }
        });
    }
}
