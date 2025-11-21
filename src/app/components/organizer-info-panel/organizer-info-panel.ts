import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-organizer-info-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './organizer-info-panel.html',
  styleUrl: '../shared/form-panel-shared.css',
})
export class OrganizerInfoPanelComponent {
  @Input({ required: true }) group!: FormGroup;
  @Input({ required: true }) contactPreference: 'email' | 'phone' = 'email';

  protected hasFieldError(controlName: string, errorCode: string): boolean {
    const control = this.group?.get(controlName);
    return Boolean(control && control.touched && control.hasError(errorCode));
  }
}
