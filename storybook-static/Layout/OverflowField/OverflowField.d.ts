export interface OverflowFieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
    value?: string | number | React.ReactNode;
    align?: 'left' | 'right';
    onClick?: (value: string) => void;
}
export declare const OverflowField: import("react").ForwardRefExoticComponent<OverflowFieldProps & import("react").RefAttributes<HTMLDivElement>>;
