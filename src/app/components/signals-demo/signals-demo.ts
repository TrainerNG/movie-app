import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';


type Item = { id: number; name: string; completed: boolean };
type User = { id: number; name: string; role: 'admin' | 'user' }

@Component({
  selector: 'app-signals-demo',
  imports: [CommonModule],
  templateUrl: './signals-demo.html',
  styleUrl: './signals-demo.css',
})
export class SignalsDemo {
  // 1 Basic Signal
  count = signal(0);
  name = signal('Angular');

  // 2. Array and Object Signals

  items = signal<Item[]>([
    {
      id: 1, name: 'Learn Signals', completed: false
    },
    {
      id: 2, name: 'Build Demo', completed: false
    }
  ])

  user = signal<User>({
    id: 1,
    name: 'John',
    role: 'user'
  });
  totalItems = computed(() => this.items().length);
  completedItems = computed(() => this.items().filter(item => item.completed).length);

  progress = computed(() => {
    return this.totalItems() > 0 ? Math.round((this.completedItems() / this.totalItems()) * 100) : 0
  })


  // Computed Signals (derived state);

  doubleCount = computed(() => this.count() * 2);


  increment() {
    this.count.set(this.count() + 1);
  }

  incrementBy(amount: number) {
    this.count.update(current => current + amount);
  }

  // Working with Objects

  updateUser() {
    this.user.update(current => ({
      ...current,
      role: current.role === 'admin' ? 'user' : 'admin'
    }))
  }

  toggleItemCompletion(id: number) {
    this.items.update(items => items.map(item => item.id === id ?
      {
        ...item, completed: !item.completed
      } : item
    )
  )
  }

  addItem(){
    const newId = this.items().length > 0 ?
    Math.max(...this.items().map(i => i.id)) + 1 : 1;

    this.items.update(items=>[
      ...items,{id:newId,name:`Task ${newId}`, completed: false}
    ]);
  }

  removeItem(id: number){
    this.items.update(items=> items.filter(item => item.id!==id));
  }
}
