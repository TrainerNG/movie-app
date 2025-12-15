import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { 
  Observable, Subject, BehaviorSubject, interval, timer, of, from, fromEvent, 
  Subscription, merge, combineLatest, forkJoin, concat, zip, 
  map, filter, tap, switchMap, mergeMap, concatMap, exhaustMap, 
  catchError, finalize, take, takeUntil, takeWhile, debounceTime, 
  distinctUntilChanged, startWith, withLatestFrom, shareReplay, share,
  delay
} from 'rxjs';
import { Movie } from '../services/movie';
import { MovieSearchResponse } from '../interfaces/movie-search-response';

@Component({
  selector: 'app-rxjs-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, NgClass],
  templateUrl: './rxjs-demo.html',
  styleUrl: './rxjs-demo.css'
})
export class RxjsDemo implements OnInit, OnDestroy {
  // Subjects
  private subject = new Subject<string>();
  private behaviorSubject = new BehaviorSubject<string>('Initial Value');
  subjectMessage = '';
  behaviorSubjectMessage = '';
  private subjectSubscription: Subscription | null = null;
  private behaviorSubjectSubscription: Subscription | null = null;

  // Search with different mapping operators
  searchTerm = '';
  switchMapResults: any[] = [];
  mergeMapResults: any[] = [];
  concatMapResults: any[] = [];
  
  // Loading states
  isLoading = {
    switchMap: false,
    mergeMap: false,
    concatMap: false
  };
  
  // Search subject for each operator
  private switchMapSubject = new Subject<string>();
  private mergeMapSubject = new Subject<string>();
  private concatMapSubject = new Subject<string>();
  
  // Subscriptions
  private switchMapSubscription: Subscription | null = null;
  private mergeMapSubscription: Subscription | null = null;
  private concatMapSubscription: Subscription | null = null;
  
  // API error state
  apiError: string | null = null;
  
  // Search history for demonstration
  searchHistory: {query: string, operator: string, timestamp: Date}[] = [];

  // CombineLatest and ForkJoin Demo
  combineLatestResult: string = 'Waiting for both inputs...';
  forkJoinResult: string = 'Click "Simulate API Calls" to see results';
  combineLatestInput1: string | null = null;
  combineLatestInput2: string | null = null;
  forkJoinInput1 = '1';
  forkJoinInput2 = '2';
  isForkJoinLoading = false;
  private input1$ = new Subject<string>();
  private input2$ = new Subject<string>();
  private combineLatestSub: Subscription | null = null;

  // Unsubscribing Strategies
  private destroy$ = new Subject<void>();
  private intervalSubscription: Subscription | null = null;
  private componentAlive = true;
  unsubscribeMethod = 'unsubscribe';
  unsubscribeResults: string[] = [];

  constructor(private movieService: Movie, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.setupSearch();
    this.setupSubjects();
    this.setupUnsubscribeExamples();
    this.setupCombineOperators();
  }

  // Subjects Demo
  private setupSubjects(): void {
    this.subjectSubscription = this.subject.pipe(
      tap(value => console.log('Subject emitted:', value))
    ).subscribe(value => {
      this.subjectMessage = value;
    });

    this.behaviorSubjectSubscription = this.behaviorSubject.pipe(
      tap(value => console.log('BehaviorSubject emitted:', value))
    ).subscribe(value => {
      this.behaviorSubjectMessage = value;
    });
  }

  emitSubjectValue(value: string): void {
    this.subject.next(value);
  }

  emitBehaviorSubjectValue(value: string): void {
    this.behaviorSubject.next(value);
  }

  // SwitchMap, MergeMap, ConcatMap Demo
  private setupSearch(): void {
    // SwitchMap example - cancels previous requests
    this.switchMapSubscription = this.switchMapSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(query => {
        this.isLoading.switchMap = true;
        this.addToSearchHistory(query, 'switchMap');
      }),
      switchMap(query => 
        this.searchMovies(query).pipe(
          catchError(error => this.handleSearchError(error, 'switchMap')),
          finalize(() => this.isLoading.switchMap = false)
        )
      )
    ).subscribe(results => {
      this.switchMapResults = results;
    });

    // MergeMap example - processes all requests in parallel
    this.mergeMapSubscription = this.mergeMapSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(query => {
        this.isLoading.mergeMap = true;
        this.addToSearchHistory(query, 'mergeMap');
      }),
      mergeMap(query => 
        this.searchMovies(query).pipe(
          catchError(error => this.handleSearchError(error, 'mergeMap')),
          finalize(() => this.isLoading.mergeMap = false)
        )
      )
    ).subscribe(results => {
      this.mergeMapResults = results;
    });

    // ConcatMap example - processes requests sequentially
    this.concatMapSubscription = this.concatMapSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(query => {
        this.isLoading.concatMap = true;
        this.addToSearchHistory(query, 'concatMap');
      }),
      concatMap(query => 
        this.searchMovies(query).pipe(
          catchError(error => this.handleSearchError(error, 'concatMap')),
          finalize(() => this.isLoading.concatMap = false)
        )
      )
    ).subscribe(results => {
      this.concatMapResults = results;
    });
  }

  onSearchChange(event: Event, operator: 'switchMap' | 'mergeMap' | 'concatMap'): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    
    switch (operator) {
      case 'switchMap':
        this.switchMapSubject.next(input.value);
        break;
      case 'mergeMap':
        this.mergeMapSubject.next(input.value);
        break;
      case 'concatMap':
        this.concatMapSubject.next(input.value);
        break;
    }
  }
  
  private addToSearchHistory(query: string, operator: string): void {
    this.searchHistory.unshift({
      query,
      operator,
      timestamp: new Date()
    });
    
    // Keep only the last 10 searches
    if (this.searchHistory.length > 10) {
      this.searchHistory.pop();
    }
  }
  
  private handleSearchError(error: any, operator: keyof typeof this.isLoading): Observable<any[]> {
    console.error(`${operator} search error:`, error);
    this.apiError = `Error in ${operator}: ${error.message || 'Unknown error'}`;
    return of([]);
  }

  private searchMovies(query: string): Observable<any[]> {
    if (!query.trim()) {
      return of([]);
    }
    
    return this.movieService.searchMovies(query).pipe(
      map((response: MovieSearchResponse) => {
        this.apiError = null;
        return response.results.slice(0, 5); // Limit to 5 results
      }),
      catchError(error => {
        console.error('Error searching movies:', error);
        this.apiError = 'Failed to fetch movies. Please try again later.';
        return of([]);
      })
    );
  }

  // Unsubscribing Strategies Demo
  private setupUnsubscribeExamples(): void {
    // Using takeUntil
    interval(1000).pipe(
      takeUntil(this.destroy$),
      )
    .subscribe();

    // Using takeWhile
    interval(1000).pipe(
      takeWhile(() => this.componentAlive),
    ).subscribe();
  }

  startUnsubscribeExample(method: 'unsubscribe' | 'takeUntil' | 'takeWhile'): void {
    this.unsubscribeMethod = method;
    this.unsubscribeResults = [];
    
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }

    const log = (msg: string) => {
      console.log(msg);
      this.unsubscribeResults = [...this.unsubscribeResults, msg];
    };

    if (method === 'unsubscribe') {
      this.intervalSubscription = interval(1000).subscribe(() => {
        log('Using unsubscribe - Still running...');
      });
    } else if (method === 'takeUntil') {
      const destroy$ = new Subject<void>();
      interval(1000).pipe(
        takeUntil(destroy$)
      ).subscribe({
        next: () => log('Using takeUntil - Still running...'),
        complete: () => log('takeUntil - Completed!'),
        error: (err) => log(`takeUntil - Error: ${err}`)
      });
      
      // Simulate component destruction after 3 seconds
      timer(3000).subscribe(() => {
        destroy$.next();
        destroy$.complete();
      });
    } else if (method === 'takeWhile') {
      let isAlive = true;
      interval(1000).pipe(
        takeWhile(() => isAlive)
      ).subscribe({
        next: () => log('Using takeWhile - Still running...'),
        complete: () => log('takeWhile - Completed!'),
        error: (err) => log(`takeWhile - Error: ${err}`)
      });
      
      // Simulate component destruction after 3 seconds
      timer(3000).subscribe(() => {
        isAlive = false;
      });
    }
  }

  // CombineLatest and ForkJoin Demo Methods
  private setupCombineOperators(): void {
    // Setup combineLatest example
    this.setupCombineLatest();
    
    // Setup forkJoin example
    this.updateForkJoin();
  }

  private setupCombineLatest(): void {
    this.combineLatestSub = combineLatest([this.input1$, this.input2$]).pipe(
      map(([val1, val2]) => {
        const num1 = val1 ? parseInt(val1) : 0;
        const num2 = val2 ? parseInt(val2) : 0;
        return `Combined: ${val1} + ${val2} = ${num1 + num2}`;
      })
    ).subscribe(result => {
      this.combineLatestResult = result;
    });
  }

  updateForkJoin(): void {
    // Show loading state
    this.isForkJoinLoading = true;
    this.forkJoinResult = 'Loading...';

    // Simulate API calls with delays
    const apiCall1 = of(`API 1 result for ID ${this.forkJoinInput1}`).pipe(delay(500));
    const apiCall2 = of(`API 2 result for ID ${this.forkJoinInput2}`).pipe(delay(1000));

    forkJoin([apiCall1, apiCall2]).subscribe({
      next: ([result1, result2]) => {
        this.forkJoinResult = `ForkJoin Results:\n- ${result1}\n- ${result2}\n\n(waits for all observables to complete)`;
        this.isForkJoinLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.forkJoinResult = `Error: ${error.message}`;
        this.isForkJoinLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onCombineInput1Change(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.combineLatestInput1 = value;
    if (value) {
      this.input1$.next(value);
      this.updateCombineLatestStatus();
    } else {
      this.combineLatestResult = 'Waiting for both inputs...';
    }
  }

  onCombineInput2Change(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.combineLatestInput2 = value;
    if (value) {
      this.input2$.next(value);
      this.updateCombineLatestStatus();
    } else {
      this.combineLatestResult = 'Waiting for both inputs...';
    }
  }

  private updateCombineLatestStatus(): void {
    if (this.combineLatestInput1 && this.combineLatestInput2) {
      // The combineLatest subscription will handle the update
    } else if (this.combineLatestInput1) {
      this.combineLatestResult = 'Waiting for second input...';
    } else if (this.combineLatestInput2) {
      this.combineLatestResult = 'Waiting for first input...';
    } else {
      this.combineLatestResult = 'Waiting for both inputs...';
    }
  }

  onForkJoinInput1Change(event: Event): void {
    this.forkJoinInput1 = (event.target as HTMLInputElement).value;
  }

  onForkJoinInput2Change(event: Event): void {
    this.forkJoinInput2 = (event.target as HTMLInputElement).value;
  }

  // Cleanup
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.subjectSubscription?.unsubscribe();
    this.behaviorSubjectSubscription?.unsubscribe();
    
    // Unsubscribe from search subscriptions
    this.switchMapSubscription?.unsubscribe();
    this.mergeMapSubscription?.unsubscribe();
    this.concatMapSubscription?.unsubscribe();
    
    // Unsubscribe from combine operators
    this.combineLatestSub?.unsubscribe();
    this.input1$.complete();
    this.input2$.complete();
    this.intervalSubscription?.unsubscribe();
    
    // Complete the destroy$ subject
    this.destroy$.next();
    this.destroy$.complete();
    
    // Set component as not alive
    this.componentAlive = false;
  }
}
