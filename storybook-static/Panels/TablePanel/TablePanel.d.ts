import { HTMLAttributes } from 'react';
export interface ScrollPanelProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    scrollStyle?: React.CSSProperties;
    loading?: boolean;
}
export declare const TablePanel: import("react").ForwardRefExoticComponent<ScrollPanelProps & import("react").RefAttributes<HTMLDivElement>>;
