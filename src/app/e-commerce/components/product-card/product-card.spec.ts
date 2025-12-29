import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCard } from './product-card';
import { Product } from '../../../interfaces/product';

describe('ProductCard', () => {
  let component: ProductCard;
  let fixture: ComponentFixture<ProductCard>;
  
  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    price: 99.99,
    description: 'A test product',
    image: 'test-image.jpg',
    category: 'Test',
    inStock: true,
    stock: 10
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCard]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCard);
    component = fixture.componentInstance;
    
    // Set the required input
    component.product = mockProduct;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display product name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.product-name')?.textContent).toContain(mockProduct.name);
  });

  it('should display product price', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.product-price')?.textContent).toContain(mockProduct.price);
  });
});
