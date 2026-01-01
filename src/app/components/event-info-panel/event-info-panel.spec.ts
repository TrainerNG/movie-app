import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventInfoPanel } from './event-info-panel';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

describe('EventInfoPanel', () => {
  let component: EventInfoPanel;
  let fixture: ComponentFixture<EventInfoPanel>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventInfoPanel, ReactiveFormsModule],
      providers:[FormBuilder]
    })
    .compileComponents();
    
    formBuilder = TestBed.inject(FormBuilder);
    fixture = TestBed.createComponent(EventInfoPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
