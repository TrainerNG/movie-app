// src/app/e-commerce/components/product-card/product-card/product-card.ts
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, ContentChild, AfterViewInit, ViewContainerRef, ComponentRef, ComponentFactoryResolver, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../product-list/product-list';
import { ProductReviewComponent } from '../../product-review/product-review/product-review';

// ... existing Product interface ...

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css']
})
export class ProductCardComponent implements AfterViewInit {
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<number>();
  
  // ViewChild to access DOM element
  @ViewChild('productCard', { static: true }) productCard!: ElementRef<HTMLElement>;
  
  // ContentChild to access projected content
  @ContentChild('productActions') productActions: any;
  
  // For dynamic component
   reviewComponentRef: ComponentRef<ProductReviewComponent> | null = null;
   componentFactoryResolver = inject(ComponentFactoryResolver);
  
  // Inject ViewContainerRef for dynamic component creation
  constructor(private viewContainerRef: ViewContainerRef) {}

  ngAfterViewInit() {
    // Log the native element (for demonstration)
    console.log('Product card element:', this.productCard.nativeElement);
    
    // Log if there's any projected content
    if (this.productActions) {
      console.log('Projected content found:', this.productActions);
    }
  }

  onAddToCart(): void {
    if (this.product.stock > 0) {
      this.addToCart.emit(this.product.id);
    }
  }

  // Method to dynamically load reviews
  loadReviews() {
    // Clear any existing dynamic component
    this.clearReviews();
    
    // Create component factory
    const componentFactory = this.componentFactoryResolver
      .resolveComponentFactory(ProductReviewComponent);
    
    // Create component
    this.reviewComponentRef = this.viewContainerRef.createComponent(componentFactory);
    
    // Set input
    this.reviewComponentRef.instance.productId = this.product.id;
    
    // Handle component events if needed
    // this.reviewComponentRef.instance.someEvent.subscribe(...);
  }

  // Method to clear dynamic component
  clearReviews() {
    if (this.reviewComponentRef) {
      this.reviewComponentRef.destroy();
      this.reviewComponentRef = null;
    }
  }

  // Cleanup
  ngOnDestroy() {
    this.clearReviews();
  }
}