import { inject, Injectable } from '@angular/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastr = inject(ToastrService);

  // Success Toast

  success(message: string, title: string = 'Success',config:Partial<IndividualConfig<any>>){
    this.toastr.success(message, title,{
      timeOut : config.timeOut || 5000
    });
  }

   error(message: string, title: string = 'Error',config:Partial<IndividualConfig<any>>){
    this.toastr.error(message, title,{
      timeOut : config.timeOut || 5000
    });
  }

  successMessage(message: string, title: string = 'Success'){
    this.toastr.success(message, title);
  }
}
