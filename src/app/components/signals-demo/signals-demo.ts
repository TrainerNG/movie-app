import { Component, signal, computed, effect, WritableSignal, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { interval, Subject, takeUntil } from 'rxjs';

type Item = { id: number; name: string; completed: boolean };
type User = { id: number; name: string; role: 'admin' | 'user' };

@Component({
  selector: 'app-signals-demo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './signals-demo.html',
  styleUrls: ['./signals-demo.css']
})
export class SignalsDemoComponent implements OnDestroy {
  // 1. Basic Signals
  count = signal(0);
  name = signal('Angular');
  price = signal(9.99);
  isActive = signal(true);
  
  // 2. Array and Object Signals
  items = signal<Item[]>([
    { id: 1, name: 'Learn Signals', completed: false },
    { id: 2, name: 'Build Demo', completed: true }
  ]);
  
  user = signal<User>({
    id: 1,
    name: 'John Doe',
    role: 'user'
  });
  
  // 3. Computed Signals (derived state)
  doubleCount = computed(() => this.count() * 2);
  greeting = computed(() => `Hello, ${this.name()}!`);
  totalItems = computed(() => this.items().length);
  completedItems = computed(() => 
    this.items().filter(item => item.completed).length
  );
  progress = computed(() => {
    const total = this.items().length;
    const completed = this.completedItems();
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  });
  
  // 4. Signal from RxJS Observable
  private destroy$ = new Subject<void>();
  timer = toSignal(interval(1000), { initialValue: 0 });
  
  // 5. Effects (side effects)
  constructor() {
    // Effect for logging count changes
    effect(() => {
      const currentCount = this.count();
      console.log(`Count changed to: ${currentCount}`);
      
      // Example: Update document title based on count
      document.title = `Count: ${currentCount} | Signals Demo`;
    });
    
    // Effect with cleanup
    effect((onCleanup) => {
      const timer = setInterval(() => {
        console.log('Effect with cleanup running...');
      }, 5000);
      
      // Cleanup function
      onCleanup(() => {
        console.log('Cleaning up effect');
        clearInterval(timer);
      });
    });
  }
  
  // 6. Signal update methods
  // Basic updates
  increment() {
    // Method 1: set() - Replace the entire value
    this.count.set(this.count() + 1);
  }
  
  // Using update() for derived values
  incrementBy(amount: number) {
    this.count.update(current => current + amount);
  }
  
  // Toggle boolean signal
  toggleActive() {
    this.isActive.update(current => !current);
  }
  
  // Working with arrays
  addItem() {
    const newId = this.items().length > 0 
      ? Math.max(...this.items().map(i => i.id)) + 1 
      : 1;
      
    this.items.update(items => [
      ...items, 
      { id: newId, name: `Task ${newId}`, completed: false }
    ]);
  }
  
  toggleItemCompletion(id: number) {
    this.items.update(items => 
      items.map(item => 
        item.id === id 
          ? { ...item, completed: !item.completed } 
          : item
      )
    );
  }
  
  removeItem(id: number) {
    this.items.update(items => items.filter(item => item.id !== id));
  }
  
  // Working with objects
  updateUser() {
    this.user.update(current => ({
      ...current,
      role: current.role === 'admin' ? 'user' : 'admin'
    }));
  }
  
  // Batch updates
  resetAll() {
    // Using untracked to prevent unnecessary computations
    import('@angular/core').then(({ untracked }) => {
      untracked(() => {
        this.count.set(0);
        this.name.set('Angular');
        this.isActive.set(true);
        this.items.set([
          { id: 1, name: 'Learn Signals', completed: false },
          { id: 2, name: 'Build Demo', completed: true }
        ]);
      });
    });
  }
  
  // Lifecycle hook for cleanup
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  // 6. Derived state using getter
  get countInfo() {
    return this.count() > 5 
      ? `Count is greater than 5 (${this.count()})`
      : `Count is ${this.count()} (less than or equal to 5)`;
  }
  
  // 7. Signal vs Observable comparison
  signalVsObservable = {
    signals: [
      'Synchronous by default',
      'Simple API (get/set/update)',
      'Automatic dependency tracking',
      'Granular change detection',
      'Great for component state'
    ],
    observables: [
      'Push-based async data streams',
      'Powerful operators for transformation',
      'Better for event streams',
      'Requires subscription management',
      'Great for async operations'
    ]
  };
}
