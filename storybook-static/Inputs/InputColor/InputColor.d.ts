import { HTMLAttributes } from 'react';
export interface InputColorProps {
    value: string | number[];
    onChange: (event: {
        target: {
            value: string | number[];
        };
    }) => void;
    alpha?: boolean;
    format?: 'hex' | 'float' | 'uint8' | 'uint16';
    className?: string;
    style?: HTMLAttributes<HTMLDivElement>['style'];
}
export declare const InputColor: import("react").ForwardRefExoticComponent<InputColorProps & import("react").RefAttributes<HTMLDivElement>>;
