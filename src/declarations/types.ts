export declare type VariableType =
    "string"    | "stringArr"       | "SqlStringOne"    | "SqlStringMany"   | "MongoStringOne"  | "MongoStringMany" |
    "int"       | "intArr"          | "SqlNumOne"       | "SqlNumMany"      | "MongoNumOne"     | "MongoNumMany"    |
    "float"     | "floatArr"        | "num"             | "numArr"          |
    "bool"      | "boolArr"         |
    "file"      | "fileArr"         |
    "JSON"      | "allowedValues";

export declare type CheckWithError = {field: string, error: ERRORS_TYPES};
export declare type CheckWithoutError = {[name: string]: any} | null;

export declare type CheckField = CheckWithError | CheckWithoutError;

/* ================================================================================================================== */

export declare type CommonErrors = "REQUIRED" | "TYPE";

/* ================================================================================================================== */

export declare type ERRORS_TYPES = CommonErrors | StringOptionsErrors | NumberOptionsErrors | BooleanOptionsErrors | JsonOptionsErrors | FileOptionsErrors;

export declare type Options = DefaultOptions | NumberOptions | StringOptions | BooleanOptions | JsonOptions | FileOptions;