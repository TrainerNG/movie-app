import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators, } from '@angular/forms';
import { MemberForm } from '../../types/member-form';
import { MemberBluePrint } from '../../interfaces/movie';

@Component({
  selector: 'app-nonnullable-reactive-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './nonnullable-reactive-form.html',
  styleUrl: './nonnullable-reactive-form.css',
})
export class NonnullableReactiveForm {
  private readonly fb = inject(NonNullableFormBuilder);
  readonly programTypes: Array<'internal' | 'client'> = ['internal', 'client'];
  readonly budgetHint = signal('Minimum budget for internal programs is $5000');
  readonly roles = ['Tech Lead', 'Frontend', 'Backend', 'QA', 'Designer', 'Product'];
  readonly memberInsights = signal({avgAvailability:0, overallocated: 0 , totalSkills:0});

  readonly programForm = this.fb.group({
    programInfo: this.fb.group({
      name: this.fb.control('Launchpad', {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      code: this.fb.control('LP-2025', {
        validators: [Validators.required, Validators.pattern(/^[A-Z]{2}-[0-9]{4}$/)],
      }),
      type: this.fb.control<'internal' | 'client'>('internal'),
      budget: this.fb.control(25000, {
        validators: [Validators.required, Validators.min(5000)],
      }),
      strategicImportance: this.fb.control<'low' | 'medium' | 'high'>('high')
    }),

    primaryContact: this.fb.group({
      fullName: this.fb.control('', { validators: [Validators.required] }),
      email: this.fb.control('', { validators: [Validators.required, Validators.email] }),
      timezone: this.fb.control('UTC'),
      slackHandle: this.fb.control('')
    }),

    members: this.fb.array([this.createMemberRow({
      name: 'XYZ', role: 'Tech Lead', avalaiblity: 80, skills: ['Angular', 'Mentoring']
    })])
  })

  readonly totalMemberAvailability = computed(()=> this.members.controls.reduce((acc,control) => {
    return acc + control.controls.availability.value 
  }, 0))
  

  get members(): FormArray<FormGroup<MemberForm>> {
    return this.programForm.get('members') as FormArray<FormGroup<MemberForm>>
  }

  constructor() {
    this.watchBudgetRule();
    this.updateMemberInsights();
  }

  // ['Angular', 'Mentoring']

  addMember() {
    this.members.push(this.createMemberRow());
    this.updateMemberInsights();
  }

  private getSkillArray(memberIndex: number) {
    return this.members.at(memberIndex).controls.skillSet;
  }

  addSkill(memberIndex: number) {
    this.getSkillArray(memberIndex).push(
      this.fb.control('New Skill', { validators: [Validators.required, Validators.minLength(2)] })
    )
  }

  removeSkill(memberIndex: number, skillIndex: number) {
    const skillArray = this.getSkillArray(memberIndex);
    if (skillArray.length === 1) {
      return;
    }

    skillArray.removeAt(skillIndex);
  }

  private createMemberRow(initial: MemberBluePrint = {}): FormGroup<MemberForm> {
    return this.fb.group({
      name: this.fb.control(initial.name ?? '', {
        validators: [Validators.required, Validators.minLength(2)],
      }),
      role: this.fb.control(initial.role ?? '', {
        validators: [Validators.required],
      }),
      availability: this.fb.control(initial.avalaiblity ?? 70, {
        validators: [Validators.min(10), Validators.max(120)],
      }),
      skillSet: this.fb.array<FormControl<string>>(
        (
          initial.skills?.length ? initial.skills : ['Angular']
        ).map((skill) => this.fb.control(skill, { validators: [Validators.required] }))
      )
    })
  }

  removeMember(index: number) {
    if (this.members.length === 1) {
      return;
    }
    this.members.removeAt(index);
    this.updateMemberInsights();
  }

  submitProgram() { }

  hasError(path: string, errorCode: string): boolean {
    const control = this.programForm.get(path);
    return Boolean(control && control.touched && control.hasError(errorCode))
  }

  private watchBudgetRule() {
    const typeControl = this.programForm.get('programInfo.type');
    const budgetControl = this.programForm.get('programInfo.budget');

    typeControl?.valueChanges.subscribe((type) => {
      if (!budgetControl || !type) {
        return;
      }
      const minBudget = type === 'client' ? 10000 : 5000;
      budgetControl?.setValidators([Validators.required, Validators.min(minBudget)]);
      budgetControl?.updateValueAndValidity({ emitEvent: false });
      this.budgetHint.set(`Minimum budget for ${type} programs is $${minBudget.toLocaleString()}`)
    })
  }

  private updateMemberInsights() {
    const stats = this.members.controls.reduce((acc, group) => {
      const availability = group.controls.availability.value;
      const overallocated = availability > 100 ? acc.overallocated + 1 : acc.overallocated;
      const skillCount = group.controls.skillSet.length;

      return {
        totalAvailabilty: acc.totalAvailabilty + availability,
        overallocated,
        totalSkills: acc.totalSkills + skillCount
      }
    },
      {
        totalAvailabilty: 0, overallocated: 0, totalSkills: 0
      });

      this.memberInsights.set({
        avgAvailability : Math.round(stats.totalAvailabilty / this.members.length),
        overallocated: stats.overallocated,
        totalSkills: stats.totalSkills
      })
  }
}
