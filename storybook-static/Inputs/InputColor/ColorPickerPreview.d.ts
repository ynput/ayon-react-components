import { ChangeEvent, FocusEvent } from 'react';
export interface ColorPickerPreviewProps {
    onClick?: () => void;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    backgroundColor?: string;
    value?: string;
    onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
}
declare const ColorPickerPreview: import("react").ForwardRefExoticComponent<ColorPickerPreviewProps & import("react").RefAttributes<HTMLDivElement>>;
export default ColorPickerPreview;
