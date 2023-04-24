export interface FileUploadProps extends React.HTMLAttributes<HTMLFormElement> {
    files: File[];
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
    mode?: 'single' | 'multiple' | 'sequence';
    validExtensions?: string[];
    showMaxFiles?: number;
    style?: React.CSSProperties;
    className?: string;
}
export declare const FileUpload: import("react").ForwardRefExoticComponent<FileUploadProps & import("react").RefAttributes<HTMLFormElement>>;
