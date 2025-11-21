import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-info-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-info-panel.html',
  styleUrl: '../shared/form-panel-shared.css',
})
export class EventInfoPanelComponent {
  @Input({ required: true }) group!: FormGroup;
  @Input({ required: true }) categories: readonly string[] = [];

  protected hasFieldError(controlName: string, errorCode: string): boolean {
    const control = this.group?.get(controlName);
    return Boolean(control && control.touched && control.hasError(errorCode));
  }

  protected hasGroupError(errorCode: string): boolean {
    return Boolean(this.group && this.group.touched && this.group.hasError(errorCode));
  }
}
