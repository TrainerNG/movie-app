import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalsDemo } from './signals-demo';

describe('SignalsDemo', () => {
  let component: SignalsDemo;
  let fixture: ComponentFixture<SignalsDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignalsDemo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignalsDemo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
