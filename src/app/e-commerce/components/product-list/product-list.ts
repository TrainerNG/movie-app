import { Component, EventEmitter, Input, Output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card/product-card';

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  inStock: boolean;
  stock: number;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: 'product-list.html',
  styleUrl: './product-list.css'
})
export class ProductListComponent {
  @Output() cartUpdated = new EventEmitter<number>();
  
  readonly categories = ['All', 'Electronics', 'Clothing', 'Books', 'Home'];
  selectedCategory = signal('All');
  cartItems = signal<{product: Product, quantity: number}[]>([]);

  // Sample product data
  // Update the products array in product-list.ts
readonly products = signal<Product[]>([
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 199.99,
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop',
    category: 'Electronics',
    inStock: true,
    stock: 10
  },
  {
    id: 2,
    name: 'Cotton T-Shirt',
    price: 29.99,
    description: '100% organic cotton t-shirt, comfortable for all-day wear',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop',
    category: 'Clothing',
    inStock: true,
    stock: 15
  },
  {
    id: 3,
    name: 'JavaScript: The Good Parts',
    price: 34.99,
    description: 'The definitive guide to JavaScript best practices',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop',
    category: 'Books',
    inStock: true,
    stock: 8
  },
  {
    id: 4,
    name: 'Smart Watch',
    price: 249.99,
    description: 'Advanced smartwatch with health and fitness tracking',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop',
    category: 'Electronics',
    inStock: false,
    stock: 0
  },
  {
    id: 5,
    name: 'Desk Lamp',
    price: 89.99,
    description: 'Modern LED desk lamp with adjustable brightness',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e622d?w=500&auto=format&fit=crop',
    category: 'Home',
    inStock: true,
    stock: 5
  },
  {
    id: 6,
    name: 'Running Shoes',
    price: 129.99,
    description: 'Lightweight running shoes with superior cushioning',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop',
    category: 'Clothing',
    inStock: true,
    stock: 7
  }
]);

  filteredProducts = computed(() => {
    if (this.selectedCategory() === 'All') {
      return this.products();
    }
    return this.products().filter(product => product.category === this.selectedCategory());
  });

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  addToCart(product: Product): void {
    const existingItem = this.cartItems().find(item => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.quantity++;
      this.cartItems.update(items => [...items]);
    } else {
      this.cartItems.update(items => [...items, { product, quantity: 1 }]);
    }
    
    this.cartUpdated.emit(this.cartItems().reduce((sum, item) => sum + item.quantity, 0));
  }

  getCartQuantity(productId: number): number {
    const item = this.cartItems().find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  }
}
