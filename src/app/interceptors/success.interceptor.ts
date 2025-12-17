import { HttpInterceptorFn } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export const successInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);
  
  return next(req).pipe(
    map((event: any) => {
      // Only show success for GET requests that return data
      if (req.method === 'GET' && event.body) {
        // Only show for specific endpoints if needed
        if (req.url.includes('/movie/popular') || req.url.includes('/search/movie')) {
          toastr.success('Loaded Successfully', 'Success', { timeOut: 2000 });
        }
      }
      return event;
    })
  );
};
