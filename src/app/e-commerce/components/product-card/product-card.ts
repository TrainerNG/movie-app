import { Component, ComponentRef, ContentChild, ElementRef, EventEmitter, Input, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { Product } from '../../../interfaces/product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
@Input() product!: Product;
@Output() addToCart = new EventEmitter<number>();

@ViewChild('reviewsContainer' , {read : ViewContainerRef}) reviewsContainer!:ViewContainerRef;
@ContentChild('productActions') productActions: ElementRef | undefined;

reviewComponentRef: ComponentRef<any> | null = null;
showReviews = false;

async loadReviews(){

  // Clear any existing dynamic component

  if(this.reviewComponentRef){
    this.clearReviews();
    this.showReviews = false;
    return;
  }


  if(!this.reviewsContainer){
    console.warn('Reviews container not found');
    return;
  }

  try{
    this.showReviews=true;
    // Dynamically import the component
    const {ProductReview} = await import('../product-review/product-review');
   this.reviewComponentRef = this.reviewsContainer.createComponent(ProductReview);
   this.showReviews = true;
  } catch (error){
    console.error('Error loading reviews', error);
    this.showReviews= false;
  }
}

clearReviews(){
  if(this.reviewComponentRef){
    this.reviewComponentRef.destroy();
    this.reviewComponentRef = null;
  }
}

onAddToCart(){
 if(this.product.stock > 0){
  this.addToCart.emit(this.product.id);
 }
}

ngOnDestroy(){
  this.clearReviews();
}
}
