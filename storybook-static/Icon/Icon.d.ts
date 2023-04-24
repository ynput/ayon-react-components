import iconSet from './icons.json';
export type IconType = keyof typeof iconSet | string;
export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
    icon: IconType;
}
export declare const Icon: import("react").ForwardRefExoticComponent<IconProps & import("react").RefAttributes<HTMLSpanElement>>;
