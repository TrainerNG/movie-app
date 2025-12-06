import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef, inject } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  ValidatorFn,
  Validators,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventInfoFormValue, createDefaultEventInfoFormValue } from '../shared/form-values';

@Component({
  selector: 'app-event-info-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-info-panel.html',
  styleUrl: '../shared/form-panel-shared.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => EventInfoPanelComponent),
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: forwardRef(() => EventInfoPanelComponent),
    },
  ],
})
export class EventInfoPanelComponent implements ControlValueAccessor, Validator {
  private readonly fb = inject(FormBuilder);

  @Input({ required: true }) categories: readonly string[] = [];

  readonly form = this.fb.group(
    {
      title: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(4)]),
      description: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(500)]),
      category: this.fb.nonNullable.control('', Validators.required),
      startDate: this.fb.nonNullable.control('', Validators.required),
      endDate: this.fb.nonNullable.control('', Validators.required),
      isVirtual: this.fb.nonNullable.control(false),
      meetingUrl: this.fb.nonNullable.control(''),
    },
    { validators: this.dateOrderValidator('startDate', 'endDate') }
  );

  private onChange: (value: EventInfoFormValue) => void = () => {};
  private onTouched: () => void = () => {};
  private onValidatorChange: () => void = () => {};

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.onChange(this.form.getRawValue() as EventInfoFormValue);
      this.onValidatorChange();
    });

    this.form
      .get('isVirtual')
      ?.valueChanges.pipe(takeUntilDestroyed())
      .subscribe((isVirtual: boolean | null) => this.updateMeetingUrlValidators(Boolean(isVirtual)));
  }

  protected hasFieldError(controlName: string, errorCode: string): boolean {
    const control = this.form.get(controlName);
    return Boolean(control && control.touched && control.hasError(errorCode));
  }

  protected hasGroupError(errorCode: string): boolean {
    return Boolean(this.form.touched && this.form.hasError(errorCode));
  }

  protected handleTouched(): void {
    this.onTouched();
  }

  writeValue(value: EventInfoFormValue | null): void {
    this.form.setValue(value ?? createDefaultEventInfoFormValue(), { emitEvent: false });
    this.updateMeetingUrlValidators(this.form.get('isVirtual')?.value ?? false);
  }

  registerOnChange(fn: (value: EventInfoFormValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable({ emitEvent: false });
    } else {
      this.form.enable({ emitEvent: false });
    }
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  validate(): ValidationErrors | null {
    return this.form.valid ? null : { eventInfoInvalid: true };
  }

  private updateMeetingUrlValidators(isVirtual: boolean): void {
    const control = this.form.get('meetingUrl');
    if (!control) {
      return;
    }

    if (isVirtual) {
      control.setValidators([Validators.required, Validators.pattern(/^https?:\/\//i)]);
    } else {
      control.clearValidators();
      control.setValue('', { emitEvent: false });
    }
    control.updateValueAndValidity({ emitEvent: false });
    this.onValidatorChange();
  }

  private dateOrderValidator(
    startKey: keyof EventInfoFormValue,
    endKey: keyof EventInfoFormValue
  ): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const start = group.get(startKey as string)?.value;
      const end = group.get(endKey as string)?.value;

      if (!start || !end) {
        return null;
      }

      return new Date(start) <= new Date(end) ? null : { dateOrder: true };
    };
  }
}
