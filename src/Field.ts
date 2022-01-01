import {CheckField, Options, VariableType, ERRORS_TYPES, CheckWithError} from "./declarations/types";

let NumberAllowedOptions:  string[] = ['newPropertyName', 'min', 'max', 'round'];
let StringAllowedOptions:  string[] = ['newPropertyName', 'minLength', 'maxLength', 'hasUpperCase', 'hasLowerCase'];
let BoolAllowedOptions:    string[] = ['newPropertyName', 'convertToNumber'];
let FileAllowedOptions:    string[] = ['newPropertyName', 'allowedExtensions', 'minimumSize', 'maximumSize'];
let DateAllowedOptions:    string[] = ['newPropertyName', 'convertToDateFormat'];
let JsonAllowedOptions:    string[] = ['newPropertyName', 'allowedProps'];

class Field {
    public  name:               string;
    public  value:              any;
    public  variableType:       VariableType;
    public  optional:           boolean;

    public options?:            Options

    constructor(
        name:                   string,
        value:                  any,
        variableType:           VariableType,
        optional:               boolean,

        options?:               Options
    ) {
        this.name               = name;
        this.value              = value;
        this.variableType       = variableType;
        this.optional           = optional;

        if (options && Object.keys(options).length > 0) {
            this.options = options;

            switch (this.variableType) {
                case "SqlStringMany":
                case "SqlStringOne":
                case "MongoStringMany":
                case "MongoStringOne":
                case "stringArr":
                case "string":
                    for (let prop of Object.keys(this.options)) {
                        if (StringAllowedOptions.indexOf(prop) === -1) throw Error(`Option ${prop} not allowed for string types, list of allowed values is: ${StringAllowedOptions.join(', ')}`);
                    }

                    break;
                case "SqlNumMany":
                case "SqlNumOne":
                case "MongoNumMany":
                case "MongoNumOne":
                case "intArr":
                case "int":
                case "floatArr":
                case "float":
                case "numArr":
                case "num":
                    for (let prop of Object.keys(this.options)) {
                        if (NumberAllowedOptions.indexOf(prop) === -1) throw Error(`Option ${prop} not allowed for number types, list of allowed values is: ${NumberAllowedOptions.join(', ')}`);
                    }

                    break;
                case "boolArr":
                case "bool":
                    for (let prop of Object.keys(this.options)) {
                        if (BoolAllowedOptions.indexOf(prop) === -1) throw Error(`Option ${prop} not allowed for bool types, list of allowed values is: ${BoolAllowedOptions.join(', ')}`);
                    }

                    break;
                case 'fileArr':
                case "file":
                    for (let prop of Object.keys(this.options)) {
                        if (FileAllowedOptions.indexOf(prop) === -1) throw Error(`Option ${prop} not allowed for file types, list of allowed values is: ${FileAllowedOptions.join(', ')}`);
                    }

                    break;
                case "dateArr":
                case "date":
                    for (let prop of Object.keys(this.options)) {
                        if (DateAllowedOptions.indexOf(prop) === -1) throw Error(`Option ${prop} not allowed for date types, list of allowed values is: ${DateAllowedOptions.join(', ')}`);
                    }

                    break;
                case "JSON":
                    for (let prop of Object.keys(this.options)) {
                        if (JsonAllowedOptions.indexOf(prop) === -1) throw Error(`Option ${prop} not allowed for JSON type, list of allowed values is: ${JsonAllowedOptions.join(', ')}`);
                    }

                    break;
            }
        }

        // TODO add if option type is compatible with value type
    }

    private static errorObj(name: string, type: ERRORS_TYPES, value?: any) {
        return {
            value: value ? value : null,
            field: name,
            error: type
        }
    }

    private checkDate(): CheckField {
        if (this.value === null || this.value === undefined) return {errors: [], obj: null};

        let value: Array<string>;

        let valueType = typeof this.value;

        switch (valueType) {
            case 'object':
                if (!Array.isArray(this.value)) return {};

                value = this.value;

                break;
            case 'string':
                value = this.value.split(',');

                break;
            default:
                return {
                    errors: [Field.errorObj(this.name, 'TYPE')],
                    obj: null
                };
        }

        for (let el of value) {
            let parsedDate = Date.parse(el);

            if (isNaN(parsedDate)) return {
                obj: null,
                errors: [{
                    field: this.name,
                    error: 'TYPE'
                }]
            }
        }

        let errors: CheckWithError[] = [];
        let obj: {[key: string]: any} | null = null;

        if (this.options && this.options.newPropertyName) obj = {[this.options.newPropertyName]: value}

        return {
            obj,
            errors
        }
    }

    private checkString(): CheckField {
        return {}
    }

    private checkNumber(): CheckField {
        return {}
    }

    private checkFile(): CheckField {
        return {}
    }

    private checkBool(): CheckField {
        return {}
    }

    private checkJSON(): CheckField {
        return {}
    }

    private checkAllowedValues(): CheckField {
        return {}
    }

    public check(): CheckField {
        if ((this.value === undefined || this.value === null) && !this.optional) {
            return {
                obj: null,
                errors: [Field.errorObj(this.name, "REQUIRED")]
            };
        }

        switch (this.variableType) {
            case "date":
            case "dateArr":
                return this.checkDate();
            case "string":
            case "stringArr":
                return this.checkString();
            case "int":
            case "intArr":
            case "float":
            case "floatArr":
            case "num":
            case "numArr":
                return this.checkNumber();
            case "bool":
            case "boolArr":
                return this.checkBool();
            case "file":
            case "fileArr":
                return this.checkFile();
            case "JSON":
                return this.checkJSON();
            case "allowedValues":
                return this.checkAllowedValues();
        }

        return {}; // todo temp func finish
    }
}

export default Field;