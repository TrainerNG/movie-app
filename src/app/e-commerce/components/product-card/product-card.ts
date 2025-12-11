import { Component, ComponentRef, ContentChild, ElementRef, Input, ViewChild, ViewContainerRef } from '@angular/core';
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

@ViewChild('reviewsContainer' , {read : ViewContainerRef}) reviewsContainer!:ViewContainerRef;
@ContentChild('productActions') productActions: ElementRef | undefined;

reviewComponentRef: ComponentRef<any> | null = null;

async loadReviews(){

  // Clear any existing dynamic component

   this.clearReviews();


  if(!this.reviewsContainer){
    console.warn('Reviews container not found');
    return;
  }

  try{
    // Dynamically import the component
    const {ProductReview} = await import('../product-review/product-review');
   this.reviewComponentRef = this.reviewsContainer.createComponent(ProductReview);
  } catch (error){
    console.error('Error loading reviews', error);
  }
}

clearReviews(){
  if(this.reviewComponentRef){
    this.reviewComponentRef.destroy();
    this.reviewComponentRef = null;
  }
}

ngOnDestroy(){
  this.clearReviews();
}
}
