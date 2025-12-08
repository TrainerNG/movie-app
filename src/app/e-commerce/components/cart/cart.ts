import { Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../product-list/product-list';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartComponent {
  @Input() items: {product: Product, quantity: number}[] = [];
  @Output() itemRemoved = new EventEmitter<number>();

  totalItems = computed(() => 
    this.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  subtotal = computed(() =>
    this.items.reduce((sum, item) => 
      sum + (item.product.price * item.quantity), 0
    )
  );

  removeItem(productId: number): void {
    this.itemRemoved.emit(productId);
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity < 1) {
      this.removeItem(productId);
      return;
    }
    // In a real app, you would update the cart service here
  }
}