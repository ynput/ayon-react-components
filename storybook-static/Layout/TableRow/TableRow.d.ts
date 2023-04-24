export interface TableRowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onCopy'> {
    name?: string;
    value?: string | number | React.ReactNode;
    tooltip?: string;
    onCopy?: (value: string) => void;
}
export declare const TableRow: import("react").ForwardRefExoticComponent<TableRowProps & import("react").RefAttributes<HTMLDivElement>>;
