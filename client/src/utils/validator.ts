import { z } from "zod"
import { ValidationRules } from "../models/validationRules.interface";
import { FieldConfig } from "../models/fieldConfig.interface";

export interface ExtractedRule {
    name: string;
    rules: ValidationRules | ExtractedRule[];
}

const generateSchema = (fieldName: string, rules: ValidationRules) => {
    let schema: z.ZodTypeAny;

    if (Array.isArray(rules)) {
        schema = z.array(z.object(generateArrayOfObjectSchema(rules)))
    } else if (rules.file) {

        schema = z.union([
            z.instanceof(File),
            z.instanceof(FileList),
            z.string(),
        ]);

        if (rules.required) {
            schema = schema.refine((files: FileList | File) => {
                if (files instanceof FileList) {
                    return files.length > 0;
                }
                return files instanceof File && files !== null;
            }, {
                message: `${fieldName} is required`,
            });
        }

        if (rules.accept) {
            schema = schema.refine((files: FileList | File) => {
                if (files instanceof FileList && files.length > 0) {
                    return Array.from(files).every((file) =>
                        rules.accept?.includes(file.type)
                    );
                }
                if (files instanceof File) {
                    return rules.accept?.includes(files.type);
                }
                return true;
            }, {
                message: `${fieldName} must be of type ${rules.accept.join(", ")}`,
            });
        }

        if (rules.maxSize) {
            const sizeInBytes = rules.maxSize * 1024 * 1024;
            schema = schema.refine((files: FileList | File) => {
                if (files instanceof FileList && files.length > 0) {
                    return Array.from(files).every((file) => file.size <= sizeInBytes);
                }
                if (files instanceof File) {
                    return files.size <= sizeInBytes;
                }
                return true;
            }, {
                message: `${fieldName} must be smaller than ${rules.maxSize}MB`,
            });
        }
    } else if (rules.checkbox) {
        schema = z.union([
            z.array(z.string()),
            z.array(z.number()),
            z.string(),
        ]);

        if (rules.required) {
            schema = schema.refine((values: string[] | string) => values.length > 0, {
                message: `${fieldName} is required`,
            });
        }
    }
    else if (rules.object) {
        schema = z.object(generateObjectSchema(rules))
    }
    else {
        schema = z.string();

        if (rules.required) {
            schema = (schema as z.ZodString).min(1, { message: `Field ${fieldName} is required` });
        } else {
            schema = schema.optional();
        }

        if (rules.email) {
            schema = schema.refine((value) => {
                if (value) {
                    return z.string().email().safeParse(value).success
                } else {
                    return true
                }
            }, {
                message: "Please enter a valid email address"
            })
        }

        if (rules.pattern) {
            schema = schema.refine((value) => {
                if (value) {
                    return rules.pattern?.test(value)
                } else {
                    return true
                }
            }, {
                message: `Invalid format for ${fieldName}`
            })
        }

        if (rules.min) {
            schema = schema.refine((value) => {
                if (value) {
                    return rules.min && (value.length >= rules.min)
                } else {
                    return true
                }
            }, {
                message: `${fieldName} must be at least ${rules.min} characters`,
            });
        }

        if (rules.max) {
            schema = schema.refine((value) => {
                if (value) {
                    return rules.max && (value.length <= rules.max)
                } else {
                    return true
                }
            }, {
                message: `${fieldName} must be at most ${rules.max} characters`,
            });
        }
    }

    return schema;
};

const generateArrayOfObjectSchema = (rules: { name: string; rules: ValidationRules }[]) => {
    const schemaObj: Record<string, z.ZodTypeAny> = {};

    for (const item of rules) {
        schemaObj[item.name] = generateSchema(item.name, item.rules);
    }

    return schemaObj;
};

const generateObjectSchema = (rules: Record<string, any>) => {
    const schemaObj: Record<string, z.ZodTypeAny> = {};

    Object.keys(rules).forEach((key) => {
        if (key !== "object") {
            schemaObj[key] = generateSchema(key, rules[key]);
        }
    });

    return schemaObj;
};

export const customValidator = (fields: FieldConfig[]) => {
    // Extract rules from fields and nested structures
    const extractRules = (fields: FieldConfig[]): ExtractedRule[] => {
        return fields.map((item: FieldConfig) => {
            if (!item.formArray && !item.formGroup) {
                return {
                    name: item.name,
                    rules: item.rules,
                };
            }

            if (item.formGroup) {
                const nestedRules: Record<string, ValidationRules> = {};
                Object.values(item.formGroup).forEach((nestedField) => {
                    nestedRules[nestedField.name] = nestedField.rules;
                });

                return {
                    name: item.name,
                    rules: { object: true, ...nestedRules },
                };
            }

            if (item.formArray) {
                const nestedRules = extractRules(item.formArray);
                return {
                    name: item.name,
                    rules: nestedRules,
                };
            }

            return { name: item.name, rules: item.rules, type: item.type };
        });
    };

    // Extract rules
    const rules = extractRules(fields);

    // Generate schema from rules
    const schemaObj: Record<string, z.ZodTypeAny> = {};
    for (const item of rules) {
        schemaObj[item.name] = generateSchema(item.name, item.rules as ValidationRules);
    }

    return z.object(schemaObj);
};

