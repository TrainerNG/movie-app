import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventInfoPanel } from './event-info-panel';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

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

    // Create a mock form group with all required controlls from the template

    const mockFormGroup = formBuilder.group({
      title:[''],
      description:[''],
      category:[''],
      startDate:[''],
      endDate:[''],
      isVirtual:[false]
    })
    // Set the required input
    component.group = mockFormGroup;
    component.categories = ['Category1', 'Category2'];

    fixture.detectChanges();
  });

  it('should have a valid form group',()=>{
    expect(component.group).toBeTruthy();
    expect(component.group instanceof FormGroup).toBeTrue();
  })

  it('should have categories as input',()=>{
    expect(component.categories.length).toBe(2);
    expect(component.categories).toContain('Category1');
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
