import { HTMLAttributes } from 'react';
export interface ScrollPanelProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    scrollStyle?: React.CSSProperties;
}
export declare const ScrollPanel: import("react").ForwardRefExoticComponent<ScrollPanelProps & import("react").RefAttributes<HTMLDivElement>>;
