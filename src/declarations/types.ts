export declare type CheckWithError = {field: string, error: ERRORS, value?: any};

export declare type CheckField = [
    value: any,
    errors: CheckWithError[]
];

/*
TODO add params
    String
        onlyUpperCase: bool
        onlyLowerCase: bool
        containNumbers: bool
        containSymbols: bool
        encoding: html | url | unicode | base64 | hex
    Number
        isFloat: bool
        isInt: bool
 */

export enum ERRORS {
    TYPE = "TYPE",
    REQUIRED = "REQUIRED",
    STR_TOO_LONG = "STRING_TOO_LONG",
    STR_TOO_SHORT = "STRING_TOO_SHORT",
    STR_HAS_UPPER = "STRING_HAS_UPPER_CASE",
    STR_DONT_HAVE_UPPER = "STRING_DONT_HAVE_UPPER_CASE",
    STR_HAS_LOWER = "STRING_HAS_LOWER_CASE",
    STR_DONT_HAVE_LOWER = "STRING_DONT_HAVE_LOWER_CASE",
    NUM_TOO_SMALL = "NUMBER_TOO_SMALL",
    NUM_TOO_LARGE = "NUMBER_TOO_LARGE",
    OBJ_INVALID_KEY = "OBJECT_INVALID_KEY",
    OBJ_INVALID_KEYS = "OBJECT_INVALID_KEYS",
    ARR_TOO_LONG = "ARRAY_IS_TOO_LONG",
    ARR_TOO_SHORT = "ARRAY_IS_TOO_SHORT"
}

export type DefaultOptions = {
    newPropertyName?: string;
}

export type DefaultArrOptions = {
    maxArrayLength?: number;
    minArrayLength?: number;
    delimiter?: string;
}

type NumberCommonOptions = DefaultOptions & {
    // NUMBER Minimal allowed number
    min?: number;
    // NUMBER Maximum allowed number
    max?: number;
    // NUMBER Count of numbers after decimal point
    round?: number;
}

type NumberDefaultValue = {
    defaultValue?: number;
}

type NumberArrDefaultValue = {
    defaultValue?: number[];
}

export type NumberOptions = NumberCommonOptions & NumberDefaultValue;

export type NumberArrOptions = DefaultArrOptions & NumberCommonOptions & NumberArrDefaultValue;

type StringCommonOptions = DefaultOptions & {
    // STRING Minimum allowed string length
    minLength?: number;
    // STRING Maximum allowed string length
    maxLength?: number;
    // STRING Has string upper case letters or not
    hasUpperCase?: boolean;
    // STRING Has string lower case letters or not
    hasLowerCase?: boolean;
}

type StringDefaultValue = {
    defaultValue?: string;
}

type StringArrDefaultValue = {
    defaultValue?: string[];
}

export type StringOptions = StringCommonOptions & StringDefaultValue;

export type StringArrOptions = DefaultArrOptions & StringCommonOptions & StringArrDefaultValue;

type DateCommonOptions = DefaultOptions & {
    // DATE Date format in which date must be converted
    convertToDateFormat?: "YYYY-MM-DD HH:mm:ss" | "YYYY-MM-DD" | "milliseconds";
}

type DateDefaultValue = {
    defaultValue?: string | Date;
}

type DateArrDefaultValue = {
    defaultValue?: Array<string | Date>
}

export type DateOptions = DateCommonOptions & DateDefaultValue;

export type DateArrOptions = DefaultArrOptions & DateCommonOptions & DateArrDefaultValue;

type BooleanCommonOptions = DefaultOptions & {
    // BOOLEAN Convert bool to number (true = 1, false = 0)
    convertToNumber?: boolean;
};

type BooleanDefaultValue = {
    defaultValue?: boolean | 0 | 1;
}

type BooleanArrDefaultValue = {
    defaultValue?: Array<boolean | 0 | 1>
}

export type BooleanOptions = BooleanCommonOptions & BooleanDefaultValue;

export type BooleanArrOptions = DefaultArrOptions & BooleanCommonOptions & BooleanArrDefaultValue;

type AllowedValuesCommonOptions = DefaultOptions & {
    // ALLOWED_VALUES Allowed values on which need to check
    allowedValues: Array<any>;
}

type AllowedValuesDefaultValue = {
    defaultValue?: any;
}

type AllowedValuesArrDefaultValue = {
    defaultValue?: Array<any>
}

export type AllowedValuesOptions = AllowedValuesCommonOptions & AllowedValuesDefaultValue;

export type AllowedValuesArrOptions = DefaultArrOptions & AllowedValuesCommonOptions & AllowedValuesArrDefaultValue;

type ObjectCommonOptions = DefaultOptions & {
    // Object Set of allowed properties
    allowedProps: Array<string>;
}

type ObjectDefaultValue = {
    defaultValue?: Object;
}

export type ObjectOptions =  ObjectCommonOptions & ObjectDefaultValue;