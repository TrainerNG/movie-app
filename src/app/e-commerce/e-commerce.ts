import { Component, signal } from '@angular/core';
import { ProductList } from "./components/product-list/product-list";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-e-commerce',
  imports: [ProductList,CommonModule],
  templateUrl: './e-commerce.html',
  styleUrl: './e-commerce.css',
})
export class ECommerce {
activeTab = signal<'products' | 'cart'> ('products');

setActiveTab(tab: 'products' | 'cart'){
  this.activeTab.set(tab);
}
}
