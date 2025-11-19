import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControlStatus, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { TicketFormValue } from '../../interfaces/ticket-form-value';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-advanced-reactive-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './advanced-reactive-form.html',
  styleUrl: './advanced-reactive-form.css',
})
export class AdvancedReactiveForm {
  private readonly fb = inject(FormBuilder);
  readonly categories = signal(['Conference', 'Workshop', 'Meetup', 'Watch party']);
  readonly lastSavedAt = signal<string | null>(null);


  constructor() {
    this.bootstrappRealtimeSummary();
  }

  private bootstrappRealtimeSummary() {
    this.eventPlannerForm.valueChanges.subscribe(() => {
      this.lastSavedAt.set(new Date().toLocaleTimeString());
    })
  }

  hasError(path: string, errorCode: string): boolean {
    const control = this.eventPlannerForm.get(path);
    return Boolean(control && control.touched && control.hasError(errorCode));
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
    ),
    organizer: this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      contactPreference: ['email', Validators.required]
    }),

    tickets: this.fb.array([this.createTicketRow()])
  })

  readonly formStatus = signal<FormControlStatus>(this.eventPlannerForm.status);

  private createTicketRow(initial: Partial<TicketFormValue> = {}): FormGroup {
    return this.fb.group({
      label: [initial.label ?? 'General Admission', Validators.required],
      capacity: [initial.capacity ?? 25, Validators.required],
      price: [initial.price ?? 49, Validators.required],
      avalaibleFrom: [initial.availableFrom ?? '', Validators.required],
      avalaibleTo: [initial.availableTo ?? '', Validators.required],
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
      console.log(new Date(start) <= new Date(end));


      return new Date(start) <= new Date(end) ? null : { dateOrder: true }
    }
  }

  onSubmit() { }

}
