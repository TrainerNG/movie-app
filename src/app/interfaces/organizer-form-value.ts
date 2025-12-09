export type ContactPreference = 'email' | 'phone';

export interface OrganizerFormValue {
    fullName: string;
    email: string;
    phone: string;
    contactPreference: ContactPreference;
}


export const createDefaultOrganizerFormValue=(): OrganizerFormValue => ({
    fullName : '',
    email:'',
    phone:'',
    contactPreference: 'email'
})