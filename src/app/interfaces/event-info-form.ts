export interface EventInfoFormValue {
    title: string;
    description: string;
    category: string;
    startDate: string;
    endDate: string;
    isVirtual: boolean;
}

export const createDefaultEventInfoFormValue=(): EventInfoFormValue=>({
     title: '',
    description: '',
    category: '',
    startDate: '',
    endDate: '',
    isVirtual: false
})