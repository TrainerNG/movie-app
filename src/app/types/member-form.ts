import { FormArray, FormControl } from "@angular/forms"

export type MemberForm = {
    name: FormControl<string>;
    role: FormControl<string>;
    availability: FormControl<number>;
    skillSet: FormArray<FormControl<string>>;
}