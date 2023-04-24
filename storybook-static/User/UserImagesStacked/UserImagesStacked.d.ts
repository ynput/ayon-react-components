export interface UserImagesStackedProps extends React.HTMLAttributes<HTMLDivElement> {
    users: {
        avatarUrl?: string;
        fullName?: string;
        self?: boolean;
    }[];
    size?: number;
    gap?: number;
    max?: number;
    userStyle?: React.CSSProperties;
}
export declare const UserImagesStacked: import("react").ForwardRefExoticComponent<UserImagesStackedProps & import("react").RefAttributes<HTMLDivElement>>;
