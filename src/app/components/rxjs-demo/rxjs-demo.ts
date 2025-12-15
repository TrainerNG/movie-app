import { Component } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-rxjs-demo',
  imports: [],
  templateUrl: './rxjs-demo.html',
  styleUrl: './rxjs-demo.css',
})
export class RxjsDemo {
  searchTerm = '';

  // Search subject for each operator.
 private switchMapSubject = new Subject<string>();

onSearchChange(event: Event, operator: 'switchMap' | 'mergeMap' | 'concatMap'){
  const input = event.target as HTMLInputElement;
  this.searchTerm = input.value;

  switch(operator){
    case 'switchMap' :
      this.switchMapSubject.next(this.searchTerm);
  }
}

private setupSearch(){
  this.switchMapSubject.pipe(
    debounceTime(300),
    distinctUntilChanged()
  )
}
}
