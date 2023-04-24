import { CSSProperties, InputHTMLAttributes } from 'react';
export interface InputSwitchProps extends InputHTMLAttributes<HTMLInputElement> {
    switchClassName?: string;
    switchStyle?: CSSProperties;
}
export declare const InputSwitch: import("react").ForwardRefExoticComponent<InputSwitchProps & import("react").RefAttributes<HTMLInputElement>>;
