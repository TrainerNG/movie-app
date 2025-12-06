export type ContactPreference = 'email' | 'phone';

export interface EventInfoFormValue {
  title: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  isVirtual: boolean;
  meetingUrl: string;
}

export interface OrganizerFormValue {
  fullName: string;
  email: string;
  phone: string;
  contactPreference: ContactPreference;
}

export const createDefaultEventInfoFormValue = (): EventInfoFormValue => ({
  title: '',
  description: '',
  category: '',
  startDate: '',
  endDate: '',
  isVirtual: false,
  meetingUrl: '',
});

export const createDefaultOrganizerFormValue = (): OrganizerFormValue => ({
  fullName: '',
  email: '',
  phone: '',
  contactPreference: 'email',
});
