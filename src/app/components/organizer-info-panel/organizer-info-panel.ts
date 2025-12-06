import { CommonModule } from '@angular/common';
import { Component, forwardRef, inject } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  Validators,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ContactPreference, OrganizerFormValue, createDefaultOrganizerFormValue } from '../shared/form-values';

@Component({
  selector: 'app-organizer-info-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './organizer-info-panel.html',
  styleUrl: '../shared/form-panel-shared.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => OrganizerInfoPanelComponent),
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: forwardRef(() => OrganizerInfoPanelComponent),
    },
  ],
})
export class OrganizerInfoPanelComponent implements ControlValueAccessor, Validator {
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    fullName: this.fb.nonNullable.control('', Validators.required),
    email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
    phone: this.fb.control(''),
    contactPreference: this.fb.nonNullable.control<ContactPreference>('email', Validators.required),
  });

  private onChange: (value: OrganizerFormValue) => void = () => {};
  private onTouched: () => void = () => {};
  private onValidatorChange: () => void = () => {};

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.onChange(this.form.getRawValue() as OrganizerFormValue);
      this.onValidatorChange();
    });

    const contactPreferenceControl = this.form.get('contactPreference');
    contactPreferenceControl
      ?.valueChanges.pipe(takeUntilDestroyed())
      .subscribe((preference: ContactPreference | null) =>
        this.updatePhoneValidators((preference ?? 'email') as ContactPreference)
      );

    this.updatePhoneValidators('email');
  }

  protected hasFieldError(controlName: string, errorCode: string): boolean {
    const control = this.form.get(controlName);
    return Boolean(control && control.touched && control.hasError(errorCode));
  }

  protected get contactPreferenceValue(): ContactPreference {
    return this.form.get('contactPreference')?.value ?? 'email';
  }

  protected handleTouched(): void {
    this.onTouched();
  }

  writeValue(value: OrganizerFormValue | null): void {
    this.form.setValue(value ?? createDefaultOrganizerFormValue(), { emitEvent: false });
    this.updatePhoneValidators(this.contactPreferenceValue);
  }

  registerOnChange(fn: (value: OrganizerFormValue) => void): void {
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
    return this.form.valid ? null : { organizerInvalid: true };
  }

  private updatePhoneValidators(preference: ContactPreference): void {
    const phoneControl = this.form.get('phone');
    if (!phoneControl) {
      return;
    }

    if (preference === 'phone') {
      phoneControl.setValidators([Validators.required, Validators.pattern(/^\+?[0-9]{10,15}$/)]);
    } else {
      phoneControl.clearValidators();
      phoneControl.setValue(phoneControl.value ?? '', { emitEvent: false });
    }
    phoneControl.updateValueAndValidity({ emitEvent: false });
    this.onValidatorChange();
  }
}
