import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface MemberBlueprint {
  name?: string;
  role?: string;
  availability?: number;
  skills?: string[];
}

interface SprintBlueprint {
  title?: string;
  startDate?: string;
  endDate?: string;
  capacity?: number;
  goal?: string;
}

type MemberForm = {
  name: FormControl<string>;
  role: FormControl<string>;
  availability: FormControl<number>;
  skillSet: FormArray<FormControl<string>>;
};

type SprintForm = {
  title: FormControl<string>;
  startDate: FormControl<string>;
  endDate: FormControl<string>;
  capacity: FormControl<number>;
  goal: FormControl<string>;
};

@Component({
  selector: 'app-nonnullable-reactive-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './nonnullable-reactive-form.html',
  styleUrl: './nonnullable-reactive-form.css',
})
export class NonNullableReactiveForm {
  private readonly fb = inject(NonNullableFormBuilder);

  readonly roles = ['Tech Lead', 'Frontend', 'Backend', 'QA', 'Designer', 'Product'];
  readonly programTypes: Array<'internal' | 'client'> = ['internal', 'client'];

  readonly budgetHint = signal('Minimum budget for internal programs is $5,000');
  readonly readinessScore = signal(0);
  readonly memberInsights = signal({ avgAvailability: 0, overallocated: 0, totalSkills: 0 });
  readonly sprintInsights = signal({ totalCapacity: 0, timelineWarnings: 0 });
  readonly submittedSnapshot = signal<object | null>(null);

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
      strategicImportance: this.fb.control<'low' | 'medium' | 'high'>('high'),
    }),
    primaryContact: this.fb.group({
      fullName: this.fb.control('', { validators: [Validators.required] }),
      email: this.fb.control('', { validators: [Validators.required, Validators.email] }),
      timezone: this.fb.control('UTC'),
      slackHandle: this.fb.control(''),
    }),
    members: this.fb.array<FormGroup<MemberForm>>([
      this.createMemberRow({ name: 'You', role: 'Tech Lead', availability: 80, skills: ['Angular', 'Mentoring'] }),
    ]),
    sprints: this.fb.array<FormGroup<SprintForm>>([
      this.createSprintRow({ title: 'Sprint 1', goal: 'Foundation', capacity: 120 }),
    ]),
    readinessChecklist: this.fb.group({
      scopeDefined: this.fb.control(true),
      stakeholdersAligned: this.fb.control(false),
      toolingReady: this.fb.control(false),
      risksLogged: this.fb.control(false),
    }),
  });

  readonly programType = computed(() => this.programForm.get('programInfo.type')?.value ?? 'internal');
  readonly totalMemberAvailability = computed(() =>
    this.members.controls.reduce((acc, control) => acc + control.controls.availability.value, 0)
  );

  constructor() {
    this.watchBudgetRule();
    this.watchReadiness();
    this.watchMembers();
    this.watchSprints();
  }

  get members(): FormArray<FormGroup<MemberForm>> {
    return this.programForm.get('members') as FormArray<FormGroup<MemberForm>>;
  }

  get sprints(): FormArray<FormGroup<SprintForm>> {
    return this.programForm.get('sprints') as FormArray<FormGroup<SprintForm>>;
  }

  addMember(): void {
    this.members.push(this.createMemberRow());
    this.updateMemberInsights();
  }

  removeMember(index: number): void {
    if (this.members.length === 1) {
      return;
    }
    this.members.removeAt(index);
    this.updateMemberInsights();
  }

  addSkill(memberIndex: number): void {
    this.getSkillArray(memberIndex).push(
      this.fb.control('New skill', { validators: [Validators.required, Validators.minLength(2)] })
    );
    this.updateMemberInsights();
  }

  removeSkill(memberIndex: number, skillIndex: number): void {
    const skillArray = this.getSkillArray(memberIndex);
    if (skillArray.length === 1) {
      return;
    }
    skillArray.removeAt(skillIndex);
    this.updateMemberInsights();
  }

  addSprint(): void {
    this.sprints.push(this.createSprintRow());
    this.updateSprintInsights();
  }

  removeSprint(index: number): void {
    if (this.sprints.length === 1) {
      return;
    }
    this.sprints.removeAt(index);
    this.updateSprintInsights();
  }

  hasError(path: string, errorCode: string): boolean {
    const control = this.programForm.get(path);
    return Boolean(control && control.touched && control.hasError(errorCode));
  }

  trackMember(index: number): number {
    return index;
  }

  trackSkill(index: number): number {
    return index;
  }

  trackSprint(index: number): number {
    return index;
  }

  submitProgram(): void {
    if (this.programForm.invalid) {
      this.programForm.markAllAsTouched();
      return;
    }
    this.submittedSnapshot.set(this.programForm.getRawValue());
  }

  resetProgram(): void {
    const defaults = this.createDefaults();
    this.programForm.reset(defaults);
    this.syncArrayToDefaults(this.members, defaults.members, (member) => this.createMemberRow(member));
    this.syncArrayToDefaults(this.sprints, defaults.sprints, (sprint) => this.createSprintRow(sprint));
    this.submittedSnapshot.set(null);
    this.updateMemberInsights();
    this.updateSprintInsights();
  }

  private getSkillArray(memberIndex: number): FormArray<FormControl<string>> {
    return this.members.at(memberIndex).controls.skillSet;
  }

  private createMemberRow(initial: MemberBlueprint = {}): FormGroup<MemberForm> {
    return this.fb.group<MemberForm>({
      name: this.fb.control(initial.name ?? '', {
        validators: [Validators.required, Validators.minLength(2)],
      }),
      role: this.fb.control(initial.role ?? this.roles[1], { validators: [Validators.required] }),
      availability: this.fb.control(initial.availability ?? 70, {
        validators: [Validators.min(10), Validators.max(120)],
      }),
      skillSet: this.fb.array<FormControl<string>>(
        (initial.skills?.length ? initial.skills : ['Angular']).map((skill) =>
          this.fb.control(skill, { validators: [Validators.required] })
        )
      ),
    });
  }

  private createSprintRow(initial: SprintBlueprint = {}): FormGroup<SprintForm> {
    return this.fb.group<SprintForm>({
      title: this.fb.control(initial.title ?? 'Sprint', { validators: [Validators.required] }),
      startDate: this.fb.control(initial.startDate ?? '', { validators: [Validators.required] }),
      endDate: this.fb.control(initial.endDate ?? '', { validators: [Validators.required] }),
      capacity: this.fb.control(initial.capacity ?? 100, {
        validators: [Validators.required, Validators.min(40)],
      }),
      goal: this.fb.control(initial.goal ?? 'Goal TBD'),
    });
  }

  private watchBudgetRule(): void {
    const typeControl = this.programForm.get('programInfo.type');
    const budgetControl = this.programForm.get('programInfo.budget');

    typeControl?.valueChanges.pipe(takeUntilDestroyed()).subscribe((type) => {
      if (!budgetControl || !type) {
        return;
      }
      const minBudget = type === 'client' ? 10000 : 5000;
      budgetControl.setValidators([Validators.required, Validators.min(minBudget)]);
      budgetControl.updateValueAndValidity({ emitEvent: false });
      this.budgetHint.set(`Minimum budget for ${type} programs is $${minBudget.toLocaleString()}`);
    });
  }

  private watchReadiness(): void {
    const readinessGroup = this.programForm.get('readinessChecklist');
    readinessGroup?.valueChanges.pipe(takeUntilDestroyed()).subscribe((checklist) => {
      const values = Object.values(checklist ?? {});
      if (!values.length) {
        this.readinessScore.set(0);
        return;
      }
      const ratio = values.filter(Boolean).length / values.length;
      this.readinessScore.set(Math.round(ratio * 100));
    });
    this.readinessScore.set(75);
  }

  private watchMembers(): void {
    this.members.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.updateMemberInsights());
    this.updateMemberInsights();
  }

  private watchSprints(): void {
    this.sprints.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.updateSprintInsights());
    this.updateSprintInsights();
  }

  private updateMemberInsights(): void {
    if (!this.members.length) {
      this.memberInsights.set({ avgAvailability: 0, overallocated: 0, totalSkills: 0 });
      return;
    }
    const stats = this.members.controls.reduce(
      (acc, group) => {
        const availability = group.controls.availability.value;
        const overallocated = availability > 100 ? acc.overallocated + 1 : acc.overallocated;
        const skillCount = group.controls.skillSet.length;
        return {
          totalAvailability: acc.totalAvailability + availability,
          overallocated,
          totalSkills: acc.totalSkills + skillCount,
        };
      },
      { totalAvailability: 0, overallocated: 0, totalSkills: 0 }
    );

    this.memberInsights.set({
      avgAvailability: Math.round(stats.totalAvailability / this.members.length),
      overallocated: stats.overallocated,
      totalSkills: stats.totalSkills,
    });
  }

  private updateSprintInsights(): void {
    if (!this.sprints.length) {
      this.sprintInsights.set({ totalCapacity: 0, timelineWarnings: 0 });
      return;
    }
    const aggregate = this.sprints.controls.reduce(
      (acc, group) => {
        const start = new Date(group.controls.startDate.value);
        const end = new Date(group.controls.endDate.value);
        return {
          totalCapacity: acc.totalCapacity + group.controls.capacity.value,
          timelineWarnings: acc.timelineWarnings + (start && end && start > end ? 1 : 0),
        };
      },
      { totalCapacity: 0, timelineWarnings: 0 }
    );

    this.sprintInsights.set(aggregate);
  }

  private createDefaults() {
    return {
      programInfo: {
        name: 'Launchpad',
        code: 'LP-2025',
        type: 'internal' as 'internal',
        budget: 25000,
        strategicImportance: 'high' as 'high',
      },
      primaryContact: {
        fullName: '',
        email: '',
        timezone: 'UTC',
        slackHandle: '',
      },
      readinessChecklist: {
        scopeDefined: true,
        stakeholdersAligned: false,
        toolingReady: false,
        risksLogged: false,
      },
      members: [
        { name: 'You', role: 'Tech Lead', availability: 80, skills: ['Angular', 'Mentoring'] } as MemberBlueprint,
      ],
      sprints: [{ title: 'Sprint 1', goal: 'Foundation', capacity: 120 } as SprintBlueprint],
    };
  }

  private syncArrayToDefaults<T>(
    formArray: FormArray,
    defaults: T[],
    factory: (value: T) => FormGroup
  ): void {
    formArray.clear();
    defaults.forEach((value) => formArray.push(factory(value)));
  }
}
