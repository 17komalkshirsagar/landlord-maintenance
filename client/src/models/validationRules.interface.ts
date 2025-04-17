export interface ValidationRules {
    required?: boolean;
    file?: boolean;
    checkbox?: boolean;
    accept?: string[];
    maxSize?: number;
    email?: boolean;
    pattern?: RegExp;
    min?: number;
    max?: number;
    object?: boolean
};
