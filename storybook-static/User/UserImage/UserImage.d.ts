export interface UserImageProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string;
    fullName?: string;
    size?: number;
    highlight?: boolean;
}
export declare const UserImage: import("react").ForwardRefExoticComponent<UserImageProps & import("react").RefAttributes<HTMLDivElement>>;
