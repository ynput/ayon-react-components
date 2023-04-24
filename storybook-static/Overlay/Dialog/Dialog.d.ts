export interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
    onHide?: () => void;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    children?: React.ReactNode;
    headerStyle?: React.CSSProperties;
    bodyStyle?: React.CSSProperties;
    footerStyle?: React.CSSProperties;
    visible?: boolean;
}
export declare const Dialog: import("react").ForwardRefExoticComponent<DialogProps & import("react").RefAttributes<HTMLDivElement>>;
