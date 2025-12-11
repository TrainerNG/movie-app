import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-product-review',
  imports: [CommonModule],
  templateUrl: './product-review.html',
  styleUrl: './product-review.css',
})
export class ProductReview {
reviews=[
  {
    id:1,
    name:'Alex Johnson',
    rating: 5,
    text:'Excellent product, highly recommend'
  },
   {
    id: 2,
    name:'Sam Wilson',
    rating: 4,
    text: 'Great quality, but delivery took longer than expected'
  }
]
}
