import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { EventInfoPanel } from './event-info-panel';

describe('EventInfoPanel', () => {
  let component: EventInfoPanel;
  let fixture: ComponentFixture<EventInfoPanel>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventInfoPanel, ReactiveFormsModule],
      providers: [FormBuilder]
    }).compileComponents();

    formBuilder = TestBed.inject(FormBuilder);
    fixture = TestBed.createComponent(EventInfoPanel);
    component = fixture.componentInstance;
    
    // Create a mock form group with all required controls from the template
    const mockFormGroup = formBuilder.group({
      // From the template
      title: [''],
      description: [''],
      category: [''],
      startDate: [''],
      endDate: [''],
      isVirtual: [false]  // This is the missing control
    });
    
    // Set the required input
    component.group = mockFormGroup;
    component.categories = ['Category 1', 'Category 2'];
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a valid form group', () => {
    expect(component.group).toBeTruthy();
    expect(component.group instanceof FormGroup).toBeTrue();
  });

  it('should have categories input', () => {
    expect(component.categories.length).toBe(2);
    expect(component.categories).toContain('Category 1');
  });
});