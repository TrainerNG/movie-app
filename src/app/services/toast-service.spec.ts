import { TestBed } from '@angular/core/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ToastService } from './toast-service';

describe('ToastService', () => {
  let service: ToastService;
  let toastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(() => {
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    TestBed.configureTestingModule({
      imports: [
        ToastrModule.forRoot()
      ],
      providers: [
        ToastService,
        { provide: ToastrService, useValue: toastrSpy }
      ]
    });

    service = TestBed.inject(ToastService);
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call toastr success with default config', () => {
    const message = 'Test message';
    const title = 'Success';
    
    service.successMessage(message, title);
    
    expect(toastrService.success).toHaveBeenCalledWith(message, title);
  });
});
