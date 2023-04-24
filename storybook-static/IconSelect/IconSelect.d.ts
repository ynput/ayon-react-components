import { DropdownProps } from '../Dropdown';
import { IconType } from '../Icon';
export interface IconTemplateProps {
    value: IconSelectProps['value'];
    valueTemplate?: boolean;
    isActive?: boolean;
    isSelected?: boolean;
}
export interface IconSelectProps extends Omit<DropdownProps, 'options' | 'valueTemplate' | 'itemTemplate' | 'search' | 'ref'> {
    value: DropdownProps['value'];
    onChange?: DropdownProps['onChange'];
    featured?: IconType[];
    featuredOnly?: boolean;
    multiSelect?: DropdownProps['multiSelect'];
}
export declare const IconSelect: import("react").ForwardRefExoticComponent<IconSelectProps & import("react").RefAttributes<HTMLDivElement>>;
