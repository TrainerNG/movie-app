import { Component, signal, computed, effect, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';

type Item = string;

@Component({
  selector: 'app-signals-demo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './signals-demo.html',
  styleUrls: ['./signals-demo.css']
})
export class SignalsDemoComponent {
  // 1. Creating Signals
  count = signal(0);
  name = signal('Angular');
  items = signal<Item[]>(['Item 1', 'Item 2']);
  
  // 2. Computed Signals (derived state)
  doubleCount = computed(() => this.count() * 2);
  greeting = computed(() => `Hello, ${this.name()}!`);
  
  // 3. Signal from RxJS Observable
  timer = toSignal(interval(1000), { initialValue: 0 });
  
  // 4. Effect (side effects)
  constructor() {
    // Log count changes
    effect(() => {
      console.log(`Count changed to: ${this.count()}`);
    });
  }
  
  // 5. Signal update methods
  increment() {
    // set() - Replace the entire value
    this.count.set(this.count() + 1);
  }
  
  updateName() {
    // update() - Update based on current value
    this.name.update(name => name === 'Angular' ? 'Signals' : 'Angular');
  }
  
  addItem() {
    // For arrays/objects, we'll use update with spread
    this.items.update(items => [...items, `Item ${items.length + 1}`]);
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
