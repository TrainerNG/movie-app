import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonnullableReactiveForm } from './nonnullable-reactive-form';

describe('NonnullableReactiveForm', () => {
  let component: NonnullableReactiveForm;
  let fixture: ComponentFixture<NonnullableReactiveForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonnullableReactiveForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonnullableReactiveForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
