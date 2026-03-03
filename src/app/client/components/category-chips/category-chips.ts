import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-category-chips',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="chips-container">
      <button 
        class="chip" 
        [class.active]="!selectedCategoryId" 
        (click)="selectCategory(null)"
      >
        Toutes
      </button>
      <button 
        *ngFor="let cat of categories" 
        class="chip" 
        [class.active]="selectedCategoryId === cat._id" 
        (click)="selectCategory(cat._id)"
      >
        {{ cat.name }}
      </button>
    </div>
  `,
    styles: [`
    .chips-container {
      display: flex;
      gap: 12px;
      overflow-x: auto;
      padding: 8px 4px 20px 4px;
      scrollbar-width: none; /* Firefox */
    }

    .chips-container::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera */
    }

    .chip {
      padding: 10px 24px;
      border-radius: 30px;
      background: white;
      border: 1px solid var(--border);
      color: var(--text-main);
      font-size: 14px;
      font-weight: 600;
      white-space: nowrap;
      cursor: pointer;
      transition: var(--transition);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
    }

    .chip:hover {
      border-color: var(--primary);
      color: var(--primary);
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.05);
    }

    .chip.active {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
      box-shadow: 0 8px 16px rgba(12, 166, 120, 0.2);
    }
  `]
})
export class CategoryChipsComponent {
    @Input() categories: any[] = [];
    @Input() selectedCategoryId: string | null = null;
    @Output() select = new EventEmitter<string | null>();

    selectCategory(id: string | null) {
        this.selectedCategoryId = id;
        this.select.emit(id);
    }
}
