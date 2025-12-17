import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { retry, delay, catchError, throwError, of } from 'rxjs';

export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  const maxRetries = 3;
  const retryDelay = 1000; // 1 second
  
  // Skip retry for non-GET requests or if the request has the skipRetry header
  if (req.method !== 'GET' || req.headers.has('skipRetry')) {
    return next(req);
  }
  
  return next(req).pipe(
    retry({
      count: maxRetries,
      delay: (error, retryCount) => {
        // Only retry on network errors or 5xx server errors
        if (error instanceof HttpErrorResponse) {
          if (error.status >= 500) {
            // Exponential backoff: 1s, 2s, 4s, etc.
            const delayTime = retryDelay * Math.pow(2, retryCount - 1);
            return of(null).pipe(delay(delayTime));
          }
        }
        // If not a retryable error, throw the error
        return throwError(() => error);
      }
    })
  );
};
