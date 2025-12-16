import { Component } from '@angular/core';
import { combineLatest, concatMap, debounceTime, delay, distinctUntilChanged, forkJoin, map, mergeMap, Observable, of, Subject, switchMap } from 'rxjs';
import { Movie } from '../../services/movie';
import { MovieSearchResponse } from '../../interfaces/movie-search-response';

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
 private mergeMapSubject = new Subject<string>();
 private concatMapSubject = new Subject<string>();

 //COMBINE LATEST

 private input1$ = new Subject<string>();
 private input2$ = new Subject<string>();

 combineLatestInput1: string | null = null;
 combineLatestInput2: string | null = null;

 combineLatestResult: string = 'Waitinf for both inputs...';

 forkJoinInput1 = '1';
 forkJoinInput2 = '2';
 forkJoinResult = 'Loading...'

 constructor(private movieService: Movie){}

 ngOnInit(){
  this.setupSearch();
  this.setupCombineOperators();
 }

 private setupCombineOperators(){
  this.setupCombineLatest();
 }

 private setupCombineLatest():void{
  combineLatest([this.input1$, this.input2$]).pipe(
    map(([val1, val2])=>{
      const num1 = val1 ? + val1 : 0;
      const num2 = val2 ? + val2 : 0;
      return `Combined : ${val1} + ${val2} = ${num1 + num2}`
    })
  ).subscribe(result=>{
    this.combineLatestResult = result;
  })
 }

 updateForkJoin(): void{
  this.forkJoinResult = 'Loading...';

  // SIMULATE API calls with delays.

  const apiCall1 = of(`API 1 result for ID ${this.forkJoinInput1}`).pipe(delay(500));
  const apiCall2 = of(`API 2 result for ID ${this.forkJoinInput2}`).pipe(delay(2000));

  forkJoin([apiCall1, apiCall2]).subscribe({
    next:([result1, result2])=>{
      this.forkJoinResult = `ForkJoin Results:\n-${result1}\n- ${result2}\n\n (wait for all observables to complete)`
    }
  })
 }

onSearchChange(event: Event, operator: 'switchMap' | 'mergeMap' | 'concatMap'){
  const input = event.target as HTMLInputElement;
  this.searchTerm = input.value;

  switch(operator){
    case 'switchMap' :
      this.switchMapSubject.next(this.searchTerm);
      break;
    case 'mergeMap':
      this.mergeMapSubject.next(this.searchTerm);
      break;
    case 'concatMap':
      this.concatMapSubject.next(this.searchTerm);
  }
}

onCombineInput1Change(event: Event): void{
  const value = (event.target as HTMLInputElement).value;
  this.combineLatestInput1 = value;

  if(value){
    this.input1$.next(value);
    this.updateCombineLatestStatus();
  }
  else{
    this.combineLatestResult = 'Waiting for both inputs...';
  }
}

onCombineInput2Change(event: Event){
  const value = (event.target as HTMLInputElement).value;
  this.combineLatestInput2 = value;
  if(value){
    this.input2$.next(value);
    this.updateCombineLatestStatus();
  }
  else{
    this.combineLatestResult = 'Waiting for both inputs...';
  }
}

private updateCombineLatestStatus(){
  if(this.combineLatestInput1 && this.combineLatestInput2){

  } else if(this.combineLatestInput1){
    this.combineLatestResult = 'Waiting for second input...';
  }
  else if(this.combineLatestInput2){
    this.combineLatestResult = 'Waiting for first input...';
  }
  else{
    this.combineLatestResult = 'Waiting for both inputs...';
  }
}

private setupSearch(){
  this.switchMapSubject.pipe(
    // debounceTime(300),
    distinctUntilChanged(),
    switchMap(query => this.searchMovies(query))
  ).subscribe();

  this.mergeMapSubject.pipe(
    distinctUntilChanged(),
    mergeMap(query => this.searchMovies(query))
  ).subscribe();

    this.concatMapSubject.pipe(
    distinctUntilChanged(),
    concatMap(query => this.searchMovies(query))
  ).subscribe();

}

private searchMovies(query: string): Observable<any[]>{
  if(!query.trim()){
    return of([])
  }

  return this.movieService.searchMovies(query).pipe(
    map((response: MovieSearchResponse)=>{
      return response.results.slice(0,5);
    })
  )
}
}
