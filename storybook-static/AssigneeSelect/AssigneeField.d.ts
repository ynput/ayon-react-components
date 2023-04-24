export interface AssigneeFieldProps extends React.HTMLAttributes<HTMLDivElement> {
    value: {
        name: string;
        fullName?: string;
        avatarUrl?: string;
    }[];
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    disabled?: boolean;
    isMultiple?: boolean;
    placeholder?: string;
    emptyMessage?: string;
    emptyIcon?: boolean;
    size?: number;
}
export declare const AssigneeField: import("react").ForwardRefExoticComponent<AssigneeFieldProps & import("react").RefAttributes<HTMLDivElement>>;
