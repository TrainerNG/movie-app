// src/app/e-commerce/components/product-card/product-card/product-card.ts
import { Component, Input, Output, EventEmitter, ViewChild, ContentChild, ViewContainerRef, ComponentRef, inject, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../product-list/product-list';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css']
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<number>();
  
  @ViewChild('reviewsContainer', { read: ViewContainerRef }) reviewsContainer!: ViewContainerRef;
  @ContentChild('productActions', { read: ElementRef }) productActions: ElementRef | undefined;
  
  reviewComponentRef: any = null;

  constructor() {}

  onAddToCart(): void {
    if (this.product.stock > 0) {
      this.addToCart.emit(this.product.id);
    }
  }

  async loadReviews() {
    // Clear any existing dynamic component
    this.clearReviews();
    
    if (!this.reviewsContainer) {
      console.warn('Reviews container not found');
      return;
    }
    
    try {
      // Dynamically import the component
      const { ProductReviewComponent } = await import(
        '../../product-review/product-review/product-review'
      );
      
      // Create and add the component
      this.reviewComponentRef = this.reviewsContainer.createComponent(ProductReviewComponent);
      this.reviewComponentRef.instance.productId = this.product.id;
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  }

  clearReviews() {
    if (this.reviewComponentRef) {
      this.reviewComponentRef.destroy();
      this.reviewComponentRef = null;
    }
  }

  ngOnDestroy() {
    this.clearReviews();
  }
}