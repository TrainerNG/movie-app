import { Component, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, FormBuilder, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors, Validator, Validators } from '@angular/forms';
import { createDefaultOrganizerFormValue, OrganizerFormValue } from '../../../interfaces/organizer-form-value';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-organizer-info-panel',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './organizer-info-panel.html',
  styleUrl: './organizer-info-panel.css',
   providers:[
    {
      provide:NG_VALUE_ACCESSOR,
      multi: true,
      useExisting:forwardRef(() => OrganizerInfoPanel)
    },
    {
      provide:NG_VALIDATORS,
      multi: true,
      useExisting:forwardRef(() => OrganizerInfoPanel)
    }
  ]
})
export class OrganizerInfoPanel implements ControlValueAccessor, Validator {
private readonly fb = inject(FormBuilder);

private onChange:(value: OrganizerFormValue)=> void = () =>{} // DECLARATION.
private onTouched:()=> void = () => {};
private onValidatorChange : ()=> void = () =>{};

constructor(){
  this.form.valueChanges.subscribe(()=>{
  this.onChange(this.form.getRawValue() as OrganizerFormValue);
  this.onValidatorChange();
  });

  // IS VIRTUAL PENDING.
}

readonly form = this.fb.group({
  fullName : this.fb.nonNullable.control('', Validators.required),
  email : this.fb.nonNullable.control('', [Validators.required, Validators.email]),
  phone: this.fb.control(''),
  contactPreference: this.fb.nonNullable.control('email', Validators.required)
})

protected handleTouched(): void {
  this.onTouched();
}

writeValue(value: OrganizerFormValue): void {
  this.form.setValue(value ?? createDefaultOrganizerFormValue());
}

registerOnChange(fn: any): void {
  this.onChange = fn;
}

registerOnValidatorChange(fn: () => void): void {
  this.onValidatorChange = fn;
}

registerOnTouched(fn: any): void {
  this.onTouched = fn;
}

validate(): ValidationErrors | null {
  return this.form.valid ? null : {eventInfoInvalid: true}
}

protected get contactPreferenceValue(){
  return this.form.get('contactPreference')?.value ?? 'email';
}


hasFieldError(controlName: string, errorCode: string){
  const control = this.form?.get(controlName);
  return Boolean(control && control.touched && control.hasError(errorCode))
}

hasGroupError(errorCode: string){
  return Boolean(this.form && this.form.touched && this.form.hasError(errorCode));
}

}
