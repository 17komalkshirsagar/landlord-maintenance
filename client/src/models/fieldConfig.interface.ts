import { ValidationRules } from "./validationRules.interface";

export interface FieldConfig {
    name: string;
    label?: string;
    type?: string;
    placeholder?: string;
    options?: { label?: string; value?: string | number }[];
    className?: string
    accept?: string
    multiple?: boolean
    displayName?: string
    rows?: number
    cols?: number
    formArray?: FieldConfig[],
    formGroup?: {
        [key: string]: FieldConfig
    },
    object?: boolean
    rules: ValidationRules
}