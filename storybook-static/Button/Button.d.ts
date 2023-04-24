import { ButtonHTMLAttributes } from 'react';
import { IconType } from '../Icon';
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
    icon?: IconType;
    tooltip?: string;
    link?: boolean;
    disabled?: boolean;
    iconStyle?: React.CSSProperties;
}
export declare const Button: import("react").ForwardRefExoticComponent<ButtonProps & import("react").RefAttributes<HTMLButtonElement>>;
