import { IconType } from '../../Icon';
export interface LockedInputProps extends Omit<React.InputHTMLAttributes<HTMLDivElement>, 'onSubmit'> {
    value: string;
    onSubmit?: (value: string) => void;
    onEdit?: () => void;
    onCancel?: () => void;
    label?: string;
    disabled?: boolean;
    saveLabel?: string;
    cancelLabel?: string;
    editIcon?: IconType;
    fullUnlock?: boolean;
    type?: React.HTMLInputTypeAttribute;
}
export declare const LockedInput: import("react").ForwardRefExoticComponent<LockedInputProps & import("react").RefAttributes<HTMLDivElement>>;
