import { HTMLAttributes } from 'react';
export interface FormRowProps extends HTMLAttributes<HTMLDivElement> {
    label: string;
    fieldStyle: React.CSSProperties;
    labelStyle: React.CSSProperties;
}
export declare const FormRow: import("react").ForwardRefExoticComponent<FormRowProps & import("react").RefAttributes<HTMLDivElement>>;
