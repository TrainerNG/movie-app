import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from './components/product-list/product-list';
import { CartComponent } from './components/cart/cart';

@Component({
  selector: 'app-e-commerce',
  standalone: true,
  imports: [CommonModule, ProductListComponent, CartComponent],
  templateUrl: './e-commerce.html',
  styleUrl: './e-commerce.css'
})
export class ECommerceComponent {
  activeTab = signal<'products' | 'cart'>('products');
  cartItemCount = signal(0);

  setActiveTab(tab: 'products' | 'cart'): void {
    this.activeTab.set(tab);
  }

  onCartUpdated(count: number): void {
    this.cartItemCount.set(count);
  }
}
