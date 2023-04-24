export interface AssigneeDropdownProps {
    name: string;
    fullName?: string;
    avatarUrl?: string;
    isSelected?: boolean;
    onClick?: () => void;
    size?: number;
}
export declare const AssigneeDropdownTemplate: ({ name, avatarUrl, fullName, isSelected, onClick, size, }: AssigneeDropdownProps) => JSX.Element;
