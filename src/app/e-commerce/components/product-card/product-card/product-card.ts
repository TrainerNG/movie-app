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
  showReviews = false;

  constructor() {}

  onAddToCart(): void {
    if (this.product.stock > 0) {
      this.addToCart.emit(this.product.id);
    }
  }

  async loadReviews() {
    if (this.reviewComponentRef) {
      this.clearReviews();
      this.showReviews = false;
      return;
    }
    
    if (!this.reviewsContainer) {
      console.warn('Reviews container not found');
      return;
    }
    
    try {
      // Set loading state
      this.showReviews = true;
      // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
      // setTimeout(async () => {
        try {
          // Dynamically import the component
          const { ProductReviewComponent } = await import(
            '../../product-review/product-review/product-review'
          );
          
          // Create and add the component
          this.reviewComponentRef = this.reviewsContainer.createComponent(ProductReviewComponent);
          // this.reviewComponentRef.instance.productId = this.product.id;
          // After loading is complete
          this.showReviews = true;
        } catch (error) {
          console.error('Error loading reviews:', error);
          this.showReviews = false;
        }
      // });
    } catch (error) {
      console.error('Error in loadReviews:', error);
      this.showReviews = false;
    }
  }

  clearReviews() {
    if (this.reviewComponentRef) {
      this.reviewComponentRef.destroy();
      this.reviewComponentRef = null;
    }
    if (this.reviewsContainer) {
      this.reviewsContainer.clear();
      // const container = this.reviewsContainer.element.nativeElement;
      // container.classList.remove('loaded', 'loading');
    }
  }

  ngOnDestroy() {
    this.clearReviews();
  }
}