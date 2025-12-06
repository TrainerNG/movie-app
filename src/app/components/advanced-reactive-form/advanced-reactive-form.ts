import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControlStatus, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { TicketFormValue } from '../../interfaces/ticket-form-value';
import { CommonModule } from '@angular/common';
import { EventInfoPanel } from "../event-info-panel/event-info-panel";

@Component({
  selector: 'app-advanced-reactive-form',
  imports: [ReactiveFormsModule, CommonModule, EventInfoPanel],
  templateUrl: './advanced-reactive-form.html',
  styleUrl: './advanced-reactive-form.css',
})
export class AdvancedReactiveForm {
  private readonly fb = inject(FormBuilder);
  readonly categories = signal(['Conference', 'Workshop', 'Meetup', 'Watch party']);
  readonly summary = signal({ totalCapacity: 0, potentialRevenue: 0 })
  readonly lastSavedAt = signal<string | null>(null);
  readonly contactPreference = signal<'email' | 'phone'>('email');


  constructor() {
    this.bootstrappRealtimeSummary();
    this.handleVirtualToggle();
    this.handleContactPreference();
    this.updateSummary();
  }

  private bootstrappRealtimeSummary() {
    this.eventPlannerForm.valueChanges.subscribe(() => {
      this.updateSummary();
      this.lastSavedAt.set(new Date().toLocaleTimeString());
    })
  }

  private updateSummary() {
    const aggregate = this.tickets.controls.reduce(
      (acc, control) => {
        const value = control.getRawValue() as TicketFormValue;
        const quantity = Number(value.capacity) || 0;
        const price = Number(value.price) || 0;

        return {
          totalCapacity: acc.totalCapacity + quantity,
          potentialRevenue: acc.potentialRevenue + quantity * price
        }
      },
      {
        totalCapacity: 0, potentialRevenue: 0
      }
    )

    this.summary.set(aggregate);
    this.formStatus.set(this.eventPlannerForm.status);

  }

  private handleVirtualToggle(): void {
    const isVirtualControl = this.eventPlannerForm.get('eventInfo.isVirtual');
    const meetingUrlControl = this.eventPlannerForm.get('eventInfo.meetingUrl');

    isVirtualControl?.valueChanges.subscribe((isVirtual: boolean | null) => {
      if (!meetingUrlControl) {
        return;
      }
      if (Boolean(isVirtual)) {
        // DYNAMIC VALIDATION, based on condition.
        meetingUrlControl.addValidators([Validators.required, Validators.pattern(/^https?:\/\//i)]);
      }
      else {
        meetingUrlControl.clearValidators();
        meetingUrlControl.setValue('');
      }
      meetingUrlControl.updateValueAndValidity();
    })
  }


  private handleContactPreference() {
    const contactControl = this.eventPlannerForm.get('organizer.contactPreference');
    const phoneControl = this.eventPlannerForm.get('organizer.phone');

    const applyPreferenceRule = (preference: string | null) => {
      const nextPreference = ((preference ?? 'email') as 'email' | 'phone');
      this.contactPreference.set(nextPreference);
      if (!phoneControl) {
        return;
      }

      if (nextPreference === 'phone') {
        phoneControl.addValidators([Validators.required, Validators.pattern(/^\+?[0-9]{10,15}$/)])
      }
      else {
        phoneControl.clearValidators();
      }
      phoneControl.updateValueAndValidity();
    }

    applyPreferenceRule(contactControl?.value ?? 'email');

    contactControl?.valueChanges.subscribe(applyPreferenceRule);
  }

  hasError(path: string, errorCode: string): boolean {
    const control = this.eventPlannerForm.get(path);
    return Boolean(control && control.touched && control.hasError(errorCode));
  }


  get eventInfoGroup() : FormGroup{
    return this.eventPlannerForm.get('eventInfo') as FormGroup
  }

  readonly eventPlannerForm = this.fb.group({
    eventInfo: this.fb.group({
      title: ['', [Validators.required, Validators.minLength(4)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      category: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      isVirtual: [false],
      meetingUrl: ['', Validators.maxLength(100)]
    },
      {
        validators: this.dateOrderValidator('startDate', 'endDate')
      }
    ),
    organizer: this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      contactPreference: ['email', Validators.required]
    }),

    tickets: this.fb.array([this.createTicketRow()]),
    agreement:[false,Validators.requiredTrue]
  })

  readonly formStatus = signal<FormControlStatus>(this.eventPlannerForm.status);

  private createTicketRow(initial: Partial<TicketFormValue> = {}): FormGroup {
    return this.fb.group({
      label: [initial.label ?? 'General Admission', Validators.required],
      capacity: [initial.capacity ?? 25, Validators.required],
      price: [initial.price ?? 49, Validators.required],
      // avalaibleFrom: [initial.availableFrom ?? '', Validators.required],
      // avalaibleTo: [initial.availableTo ?? '', Validators.required],
    },
      {
        validators: this.dateOrderValidator('avalaibleFrom', 'avalaibleTo')
      }
    )
  }

  private dateOrderValidator(startKey: string, endKey: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const start = group.get(startKey)?.value;
      const end = group.get(endKey)?.value;
      if (!start || !end) {
        return null;
      }
      return new Date(start) <= new Date(end) ? null : { dateOrder: true }
    }
  }

  get tickets(): FormArray<FormGroup> {
    return this.eventPlannerForm.get('tickets') as FormArray<FormGroup>
  }

  addTicket() {
    this.tickets.push(this.createTicketRow());
  }

  removeTicket(index: number) {
    if (this.tickets.length === 1) {
      return;
    }
    this.tickets.removeAt(index);
  }

  onSubmit() { }

}
