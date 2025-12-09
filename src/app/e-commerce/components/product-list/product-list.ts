import { Component, computed, signal } from '@angular/core';
import { Product } from '../../../interfaces/product';
import { CommonModule } from '@angular/common';
import { ProductCard } from "../product-card/product-card";

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, ProductCard],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  readonly categories = ['All', 'Electronics' ,'Clothing' ,'Books' , 'Home'];
  selectedCategory = signal('All');
  readonly products = signal<Product[]>(
    [
      {
        id: 1,
        name: 'Wireless Headphones',
        price: 199.9934567456785678567,
        description: 'Premium noice-cancelling wireless headphones with 30hours battery life',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop',
        category: 'Electronics',
        inStock: true,
        stock: 10
      },
      {
        id: 2,
        name: 'Cotton T-Shirt',
        price: 29.99,
        description: '100% organic cotton t-shirt',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop',
        category: 'Clothing',
        inStock: true,
        stock: 15
      }
    ]
  )

  filteredProducts = computed(()=>{
    if(this.selectedCategory() === 'All'){
      return this.products();
    }
    return this.products().filter(product=> product.category === this.selectedCategory());
  })

  selectCategory(category: string){
    this.selectedCategory.set(category);
  }
}
