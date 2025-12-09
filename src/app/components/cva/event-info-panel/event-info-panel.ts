import { Component, forwardRef, inject, Input } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, 
  NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors, Validator, 
  ValidatorFn, Validators } from '@angular/forms';
import { createDefaultEventInfoFormValue, EventInfoFormValue } from '../../../interfaces/event-info-form';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-info-panel-cva',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './event-info-panel.html',
  styleUrl: './event-info-panel.css',
  providers:[
    {
      provide:NG_VALUE_ACCESSOR,
      multi: true,
      useExisting:forwardRef(() => EventInfoPanel)
    },
    {
      provide:NG_VALIDATORS,
      multi: true,
      useExisting:forwardRef(() => EventInfoPanel)
    }
  ]
})
export class EventInfoPanel implements ControlValueAccessor, Validator {

private readonly fb = inject(FormBuilder);
@Input({required: true}) categories: readonly string[]=[];

readonly form = this.fb.group(
  {
  title: this.fb.nonNullable.control('',[Validators.required, Validators.minLength(4)]),
  description:this.fb.nonNullable.control('',[Validators.required, Validators.maxLength(500)]),
  category:this.fb.nonNullable.control('',Validators.required),
  startDate:this.fb.nonNullable.control('', Validators.required),
  endDate:this.fb.nonNullable.control('', Validators.required),
  isVirtual: this.fb.nonNullable.control(false),
},
{
  validators: this.dateOrderValidator('startDate','endDate')
})

private onChange:(value: EventInfoFormValue)=> void = () =>{} // DECLARATION.
private onTouched:()=> void = () => {};
private onValidatorChange : ()=> void = () =>{};

constructor(){
  this.form.valueChanges.subscribe(()=>{
  this.onChange(this.form.getRawValue() as EventInfoFormValue);
  this.onValidatorChange();
  });

  // IS VIRTUAL PENDING.
}

protected handleTouched(): void {
  this.onTouched();
}

writeValue(value: EventInfoFormValue): void {
  this.form.setValue(value ?? createDefaultEventInfoFormValue());
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


hasFieldError(controlName: string, errorCode: string){
  const control = this.form?.get(controlName);
  return Boolean(control && control.touched && control.hasError(errorCode))
}

hasGroupError(errorCode: string){
  return Boolean(this.form && this.form.touched && this.form.hasError(errorCode));
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

}
