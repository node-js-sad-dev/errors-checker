export declare type VariableType =
    "string"            | "stringArr"           |
    "num"               | "numArr"              |
    "bool"              | "boolArr"             |
    "file"              | "fileArr"             |
    "date"              | "dateArr"             |
    "allowedValues"     | "allowedValuesArr"    |
    "JSON";

/**
 * @description Available date formats
 */

declare type DateFormats = "YYYY-MM-DD HH:mm:ss" | "YYYY-MM-DD" | "milliseconds";

/**
 * @description Allowed format of JsonOption object property "allowedProps"
 * @param name          {string}        name of object property
 * @param optional      {boolean}       optional property or not
 */

declare type JsonAllowedPropsObj = {
    // name of object property
    name?: string,
    // optional property or not
    optional?: boolean
}

export declare type CheckWithError = {field: string, error: ERRORS_TYPES, value?: any};

export declare type CheckField = [
    value: any,
    errors: CheckWithError[]
];

/* ================================================================================================================== */

export declare type ERRORS_TYPES = "REQUIRED" | "TYPE" |
    "STRING_TOO_LONG" | "STRING_TOO_SHORT" | "STRING_HAS_UPPER_CASE" | "STRING_DONT_HAVE_UPPER_CASE" | "STRING_HAS_LOWER_CASE" | "STRING_DONT_HAVE_LOWER_CASE" |
    "NUMBER_TOO_SMALL" | "NUMBER_TOO_LARGE";

/*
TODO add params
    String
        onlyUpperCase: bool
        onlyLowerCase: bool
        containNumbers: bool
        containSymbols: bool
        wrapInPercentages: bool - для преобразования строки в строку по которой можно сделать поиск по сабстроке в sql
        Придумать аналогичное решение для монги (посмотреть как сделал в проекте чатов (бекенд))
        encoding: html | url | unicode | base64 | hex
    Number
        isFloat: bool
        isInt: bool
 */

/**
 * @description Additional options to check
 * @param convertToNumber           {boolean}               BOOLEAN Convert bool to number (true = 1, false = 0)
 * @param convertToDateFormat       {DateFormats}           DATE Date format in which date must be converted
 * @param allowedExtensions         {string[]}              FILE Allowed file extensions
 * @param minimumSize               {number}                FILE Minimum file size
 * @param maximumSize               {number}                FILE Maximum file size
 * @param allowedProps              {JsonAllowedPropsObj[]} JSON Set of allowed properties
 * @param min                       {number}                NUMBER Minimal allowed number
 * @param max                       {number}                NUMBER Maximum allowed number
 * @param round                     {number}                NUMBER Count of numbers after decimal point
 * @param minLength                 {number}                STRING Minimum allowed string length
 * @param maxLength                 {number}                STRING Maximum allowed string length
 * @param hasUpperCase              {boolean}               STRING Has string upper case letters or not
 * @param hasLowerCase              {boolean}               STRING Has string lower case letters or not
 * @param newPropertyName           {string | null}         DEF_OPTIONS Name of property in which need to save result
 */
export declare type Options = {
    // BOOLEAN Convert bool to number (true = 1, false = 0)
    convertToNumber?: boolean;
    // DATE Date format in which date must be converted
    convertToDateFormat?: DateFormats;
    // FILE Allowed file extensions
    allowedExtensions?: string[];
    // FILE Minimum file size
    minimumSize?: number;
    // FILE Maximum file size
    maximumSize?: number;
    // JSON Set of allowed properties
    allowedProps?: JsonAllowedPropsObj[];
    // NUMBER Minimal allowed number
    min?: number;
    // NUMBER Maximum allowed number
    max?: number;
    // NUMBER Count of numbers after decimal point
    round?: number;
    // STRING Minimum allowed string length
    minLength?: number;
    // STRING Maximum allowed string length
    maxLength?: number;
    // STRING Has string upper case letters or not
    hasUpperCase?: boolean;
    // STRING Has string lower case letters or not
    hasLowerCase?: boolean;
    // DEF_OPTIONS Name of property in which need to save result
    newPropertyName?: string | null;
}