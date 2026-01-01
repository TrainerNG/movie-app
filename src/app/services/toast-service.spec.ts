import { TestBed } from '@angular/core/testing';

import { ToastService } from './toast-service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

describe('ToastService', () => {
  let service: ToastService;
  let toastrService: jasmine.SpyObj<ToastrService>

  beforeEach(() => {
    const toastrSpy = jasmine.createSpyObj('ToastrService',['success','error']);
    TestBed.configureTestingModule({
      imports:[
        ToastrModule.forRoot()
      ],
      providers:[
        ToastService,
        {
          provide:ToastrService,useValue: toastrSpy
        }
      ]
    });
    service = TestBed.inject(ToastService);
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
