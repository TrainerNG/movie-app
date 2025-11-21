import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControlStatus,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventInfoPanelComponent } from '../event-info-panel/event-info-panel';
import { OrganizerInfoPanelComponent } from '../organizer-info-panel/organizer-info-panel';

interface TicketFormValue {
  label: string;
  capacity: number;
  price: number;
  availableFrom: string;
  availableTo: string;
}

@Component({
  selector: 'app-advanced-reactive-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EventInfoPanelComponent, OrganizerInfoPanelComponent],
  templateUrl: './advanced-reactive-form.html',
  styleUrl: './advanced-reactive-form.css',
})
export class AdvancedReactiveForm {
  private readonly fb = inject(FormBuilder);

  readonly categories = signal(['Conference', 'Workshop', 'Meetup', 'Watch Party']);
  readonly summary = signal({ totalCapacity: 0, potentialRevenue: 0 });
  readonly lastSavedAt = signal<string | null>(null);
  readonly contactPreference = signal<'email' | 'phone'>('email');

  protected submittedPayload: unknown = null;

  readonly eventPlannerForm = this.fb.group({
    eventInfo: this.fb.group(
      {
        title: ['', [Validators.required, Validators.minLength(4)]],
        description: ['', [Validators.required, Validators.maxLength(500)]],
        category: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        isVirtual: [false],
        meetingUrl: [''],
      },
      { validators: this.dateOrderValidator('startDate', 'endDate') }
    ),
    organizer: this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      contactPreference: ['email', Validators.required],
    }),
    tickets: this.fb.array([this.createTicketRow()]),
    agreement: [false, Validators.requiredTrue],
  });

  readonly formStatus = signal<FormControlStatus>(this.eventPlannerForm.status);

  constructor() {
    this.handleVirtualToggle();
    this.handleContactPreference();
    this.bootstrapRealtimeSummary();
    this.updateSummary();

    this.eventPlannerForm.statusChanges
      .pipe(takeUntilDestroyed())
      .subscribe((status) => this.formStatus.set(status));
  }

  get eventInfoGroup(): FormGroup {
    return this.eventPlannerForm.get('eventInfo') as FormGroup;
  }

  get organizerGroup(): FormGroup {
    return this.eventPlannerForm.get('organizer') as FormGroup;
  }

  get tickets(): FormArray<FormGroup> {
    return this.eventPlannerForm.get('tickets') as FormArray<FormGroup>;
  }

  addTicket(): void {
    this.tickets.push(this.createTicketRow());
  }

  removeTicket(index: number): void {
    if (this.tickets.length === 1) {
      return;
    }
    this.tickets.removeAt(index);
    this.updateSummary();
  } 

  onSubmit(): void {
    console.log(this.eventPlannerForm);
    
    if (this.eventPlannerForm.invalid) {
      this.eventPlannerForm.markAllAsTouched();
      return;
    }

    this.submittedPayload = this.eventPlannerForm.getRawValue();
    console.log(this.submittedPayload);
    
  }

  resetForm(): void {
    this.eventPlannerForm.reset({
      organizer: { contactPreference: 'email' },
      eventInfo: { isVirtual: false },
      agreement: false,
    });
    this.tickets.clear();
    this.tickets.push(this.createTicketRow());
    this.submittedPayload = null;
    this.summary.set({ totalCapacity: 0, potentialRevenue: 0 });
  }

  hasError(path: string, errorCode: string): boolean {
    const control = this.eventPlannerForm.get(path);
    return Boolean(control && control.touched && control.hasError(errorCode));
  }

  trackTicket(index: number): number {
    return index;
  }

  private handleVirtualToggle(): void {
    const isVirtualControl = this.eventPlannerForm.get('eventInfo.isVirtual');
    const meetingUrlControl = this.eventPlannerForm.get('eventInfo.meetingUrl');

    isVirtualControl?.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((isVirtual: boolean | null) => {
        if (!meetingUrlControl) {
          return;
        }
        if (Boolean(isVirtual)) {
          meetingUrlControl.addValidators([Validators.required, Validators.pattern(/^https?:\/\//i)]);
        } else {
          meetingUrlControl.clearValidators();
          meetingUrlControl.setValue('', { emitEvent: false });
        }
        meetingUrlControl.updateValueAndValidity();
      });
  }

  private handleContactPreference(): void {
    const contactControl = this.eventPlannerForm.get('organizer.contactPreference');
    const phoneControl = this.eventPlannerForm.get('organizer.phone');

    const applyPreferenceRules = (preference: string | null): void => {
      const nextPreference = ((preference ?? 'email') as 'email' | 'phone');
      this.contactPreference.set(nextPreference);

      if (!phoneControl) {
        return;
      }

      if (nextPreference === 'phone') {
        phoneControl.addValidators([Validators.required, Validators.pattern(/^\+?[0-9]{10,15}$/)]);
      } else {
        phoneControl.clearValidators();
      }
      phoneControl.updateValueAndValidity();
    };

    applyPreferenceRules(contactControl?.value ?? 'email');

    contactControl?.valueChanges.pipe(takeUntilDestroyed()).subscribe(applyPreferenceRules);
  }

  private bootstrapRealtimeSummary(): void {
    this.eventPlannerForm.valueChanges
      .pipe(debounceTime(250), takeUntilDestroyed())
      .subscribe(() => {
        this.updateSummary();
        this.lastSavedAt.set(new Date().toLocaleTimeString());
      });
  }

  private updateSummary(): void {
    const aggregate = this.tickets.controls.reduce(
      (acc, control) => {
        const value = control.getRawValue() as TicketFormValue;
        const quantity = Number(value.capacity) || 0;
        const price = Number(value.price) || 0;

        return {
          totalCapacity: acc.totalCapacity + quantity,
          potentialRevenue: acc.potentialRevenue + quantity * price,
        };
      },
      { totalCapacity: 0, potentialRevenue: 0 }
    );

    this.summary.set(aggregate);
    this.formStatus.set(this.eventPlannerForm.status);
  }

  private dateOrderValidator(startKey: string, endKey: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const start = group.get(startKey)?.value;
      const end = group.get(endKey)?.value;

      if (!start || !end) {
        return null;
      }

      return new Date(start) <= new Date(end) ? null : { dateOrder: true };
    };
  }

  private createTicketRow(initial: Partial<TicketFormValue> = {}): FormGroup {
    return this.fb.group(
      {
        label: [initial.label ?? 'General Admission', Validators.required],
        capacity: [initial.capacity ?? 25, [Validators.required, Validators.min(1)]],
        price: [initial.price ?? 49, [Validators.required, Validators.min(0)]],
        availableFrom: [initial.availableFrom ?? '', Validators.required],
        availableTo: [initial.availableTo ?? '', Validators.required],
      },
      { validators: this.dateOrderValidator('availableFrom', 'availableTo') }
    );
  }
}
