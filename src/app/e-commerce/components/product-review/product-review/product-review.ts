// src/app/e-commerce/components/product-review/product-review.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-review',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="product-review">
      <h4>Customer Reviews</h4>
      <div *ngFor="let review of reviews" class="review">
        <div class="review-header">
          <span class="reviewer">{{ review.name }}</span>
          <div class="rating">★ {{ review.rating }}/5</div>
        </div>
        <p class="review-text">{{ review.text }}</p>
      </div>
    </div>
  `,
  styles: [`
    .product-review {
      margin-top: 2rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
    }
    .review {
      margin-bottom: 1rem;
      padding: 1rem;
      background: white;
      border-radius: 6px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .review-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }
    .reviewer {
      font-weight: 600;
    }
    .rating {
      color: #f59e0b;
    }
    .review-text {
      margin: 0;
      color: #4b5563;
    }
  `]
})
export class ProductReviewComponent {
  @Input() productId!: number;
  
  // Sample reviews - in a real app, this would come from a service
  reviews = [
    { id: 1, name: 'Alex Johnson', rating: 5, text: 'Excellent product, highly recommend!' },
    { id: 2, name: 'Sam Wilson', rating: 4, text: 'Great quality, but delivery took longer than expected.' }
  ];
}