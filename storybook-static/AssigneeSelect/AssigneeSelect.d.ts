export interface AssigneeSelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
    value: string[];
    options: {
        name: string;
        fullName?: string;
        avatarUrl?: string;
    }[];
    editor?: boolean;
    onChange?: (names: string[]) => void;
    widthExpand?: boolean;
    disabled?: boolean;
    align?: 'left' | 'right';
    isMultiple?: boolean;
}
export declare const AssigneeSelect: import("react").ForwardRefExoticComponent<AssigneeSelectProps & import("react").RefAttributes<HTMLDivElement>>;
