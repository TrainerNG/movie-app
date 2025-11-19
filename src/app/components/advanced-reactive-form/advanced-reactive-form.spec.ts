import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedReactiveForm } from './advanced-reactive-form';

describe('AdvancedReactiveForm', () => {
  let component: AdvancedReactiveForm;
  let fixture: ComponentFixture<AdvancedReactiveForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvancedReactiveForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedReactiveForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
