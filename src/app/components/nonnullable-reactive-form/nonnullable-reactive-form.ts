import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators,  } from '@angular/forms';

@Component({
  selector: 'app-nonnullable-reactive-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './nonnullable-reactive-form.html',
  styleUrl: './nonnullable-reactive-form.css',
})
export class NonnullableReactiveForm {
private readonly fb = inject(NonNullableFormBuilder);
readonly programTypes: Array<'internal' | 'client'> = ['internal' ,'client'];

readonly programForm = this.fb.group({
  programInfo:this.fb.group({
    name: this.fb.control('Launchpad',{
      validators:[Validators.required, Validators.minLength(3)],
    }),
    code: this.fb.control('LP-2025',{
      validators:[Validators.required, Validators.pattern(/^[A-Z]{2}-[0-9]{4}$/)],
    }),
    type:this.fb.control<'internal' | 'client'>('internal')
  })
})

submitProgram(){}

hasError(path: string, errorCode: string): boolean{
  const control = this.programForm.get(path);
  return Boolean(control && control.touched && control.hasError(errorCode))
}
}
