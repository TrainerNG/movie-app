import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AdvancedReactiveForm } from './advanced-reactive-form';
import { ReactiveFormsModule } from '@angular/forms';

describe('AdvancedReactiveForm', () => {
  let component: AdvancedReactiveForm;
  let fixture: ComponentFixture<AdvancedReactiveForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvancedReactiveForm, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AdvancedReactiveForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose default reactive state', () => {
    expect(component.eventPlannerForm.valid).toBeFalse();
    expect(component.categories()).toEqual(['Conference', 'Workshop', 'Meetup', 'Watch party']);
    expect(component.summary()).toEqual({ totalCapacity: 25, potentialRevenue: 1225 });
    expect(component.contactPreference()).toBe('email');
  });

  describe('agreement validation', () => {
    it('should require agreement checkbox to be true', () => {
      const agreementControl = component.eventPlannerForm.get('agreement');
      agreementControl?.setValue(false);
      expect(component.eventPlannerForm.valid).toBeFalse();

      agreementControl?.setValue(true);
      expect(component.eventPlannerForm.valid).toBeFalse();

      // populate minimal required data for embedded CVAs
      component.eventPlannerForm.get('eventInfo')?.setValue({
        title: 'Test Event',
        description: 'Great event',
        category: 'Conference',
        startDate: '2024-01-01',
        endDate: '2024-01-02',
        isVirtual: false
      });
      component.eventPlannerForm.get('organizer')?.setValue({
        fullName: 'Alex Doe',
        email: 'alex@example.com',
        phone: '',
        contactPreference: 'email'
      });

      expect(component.eventPlannerForm.valid).toBeTrue();
    });
  });

  describe('ticket management', () => {
    it('should add new tickets', () => {
      const initialLength = component.tickets.length;
      component.addTicket();
      expect(component.tickets.length).toBe(initialLength + 1);
    });

    it('should not remove the last remaining ticket', () => {
      const initialLength = component.tickets.length;
      component.removeTicket(0);
      expect(component.tickets.length).toBe(initialLength);
    });

    it('should remove a ticket when more than one exists', () => {
      component.addTicket();
      const lengthWithTwo = component.tickets.length;
      component.removeTicket(0);
      expect(component.tickets.length).toBe(lengthWithTwo - 1);
    });
  });

  describe('summary tracking', () => {
    it('should recalculate totals when ticket entries change', () => {
      const firstTicket = component.tickets.at(0);
      firstTicket.get('capacity')?.setValue(10);
      firstTicket.get('price')?.setValue(50);

      component.addTicket();
      const secondTicket = component.tickets.at(1);
      secondTicket.get('capacity')?.setValue(20);
      secondTicket.get('price')?.setValue(25);

      // trigger change detection to process valueChanges subscription
      fixture.detectChanges();

      expect(component.summary()).toEqual({ totalCapacity: 30, potentialRevenue: 1000 });
    });
  });

  describe('form submission', () => {
    it('should forward ngSubmit to onSubmit handler', () => {
      spyOn(component, 'onSubmit');
      const formDebugEl = fixture.debugElement.query(By.css('form'));
      formDebugEl.triggerEventHandler('ngSubmit', {});
      expect(component.onSubmit).toHaveBeenCalled();
    });
  });
});
