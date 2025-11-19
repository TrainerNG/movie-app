import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let authReq = req;

  authReq = req.clone({
    setHeaders:{
      Authorization:`Bearer ${environment.apiKey}`
    }
  })
  return next(authReq);
};
