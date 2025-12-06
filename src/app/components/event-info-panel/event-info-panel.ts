import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-info-panel',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './event-info-panel.html',
  styleUrl: './event-info-panel.css',
})
export class EventInfoPanel {
@Input() group!: FormGroup;
@Input() categories: readonly string[]=[];

hasFieldError(controlName: string, errorCode: string){
  const control = this.group?.get(controlName);
  return Boolean(control && control.touched && control.hasError(errorCode))
}

hasGroupError(errorCode: string){
  return Boolean(this.group && this.group.touched && this.group.hasError(errorCode));
}
}
