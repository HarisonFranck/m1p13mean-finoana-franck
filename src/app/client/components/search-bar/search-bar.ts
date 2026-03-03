import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-search-bar',
    standalone: true,
    imports: [CommonModule, FormsModule, MatIconModule],
    template: `
    <div class="search-container">
      <div class="search-wrapper">
        <mat-icon class="search-icon">search</mat-icon>
        <input 
          type="text" 
          [(ngModel)]="searchQuery" 
          (input)="onSearchChange()" 
          placeholder="Rechercher une boutique, un produit..."
        >
        <button *ngIf="searchQuery" class="clear-btn" (click)="clearSearch()">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      <div class="filter-actions">
        <!-- Optional extra filters could go here -->
      </div>
    </div>
  `,
    styles: [`
    .search-container {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
    }

    .search-wrapper {
      background: white;
      border-radius: 20px;
      padding: 12px 24px;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
      border: 1px solid var(--border);
      transition: var(--transition);
    }

    .search-wrapper:focus-within {
      border-color: var(--primary);
      box-shadow: 0 10px 40px rgba(12, 166, 120, 0.1);
      transform: translateY(-2px);
    }

    .search-icon {
      color: var(--text-muted);
    }

    input {
      border: none;
      outline: none;
      flex-grow: 1;
      font-size: 16px;
      font-family: inherit;
      color: var(--text-main);
      background: transparent;
    }

    input::placeholder {
      color: var(--text-muted);
      opacity: 0.6;
    }

    .clear-btn {
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: var(--transition);
    }

    .clear-btn:hover {
      background: #f1f5f9;
      color: var(--text-main);
    }
  `]
})
export class SearchBarComponent {
    searchQuery: string = '';
    @Output() search = new EventEmitter<string>();

    onSearchChange() {
        this.search.emit(this.searchQuery);
    }

    clearSearch() {
        this.searchQuery = '';
        this.onSearchChange();
    }
}
