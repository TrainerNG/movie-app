import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const toastr = inject(ToastrService);

  return next(req).pipe(
    
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';

      if(error.error instanceof ErrorEvent){
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      }
      else{
        // Server-side Error
        errorMessage = `Error Status : ${error.status}\nMessage: ${error.message}`;

        switch(error.status){
          case 401:
            errorMessage = 'Unauthorized access, please login in again.';
            break;
        }
      }

      toastr.error(errorMessage,'Error',{
        timeOut: 3000,
        positionClass:'toast-top-right'
      })
      return throwError(()=> error)
    })
  );
};
