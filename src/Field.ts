import {CheckField, Options, VariableType, ERRORS_TYPES, CheckWithError} from "./declarations/types";
import moment from "moment";

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

    private static errorObj(name: string, type: ERRORS_TYPES, value?: any): CheckWithError {
        return {
            value: value ? value : null,
            field: name,
            error: type
        }
    }

    private checkDate(): CheckField {
        if (this.value === null || this.value === undefined) return {errors: [], obj: {}};

        let value: Array<any>;

        let valueType = typeof this.value;

        let errors: CheckWithError[] = [];
        let obj: {[key: string]: any} = {};

        switch (valueType) {
            case 'object':
                if (!Array.isArray(this.value)) return {obj: {}, errors: []};

                value = this.value;

                break;
            case 'string':
                value = this.value.split(',');

                break;
            default:
                return {
                    errors: [Field.errorObj(this.name, 'TYPE'), this.value],
                    obj: {}
                };
        }

        for (let el of value) {
            let parsedDate = Date.parse(el);

            if (isNaN(parsedDate)) errors.push(Field.errorObj(this.name, "TYPE", el))
        }

        if (errors.length > 0) return {obj, errors};

        if (this.options?.convertToDateFormat) {
            switch (this.options.convertToDateFormat) {
                case "milliseconds":
                    value = value.map(el => Date.parse(el));
                    break;
                case "YYYY-MM-DD":
                case "YYYY-MM-DD HH:mm:ss":
                    value = value.map(el => moment(el).format(this.options?.convertToDateFormat));
                    break;
            }
        }

        if (this.options && this.options.newPropertyName !== undefined) {
            if (this.options.newPropertyName !== null) {
                switch (this.variableType) {
                    case "date":
                        obj = {[this.options.newPropertyName]: value.join('')}
                        break;
                    case "dateArr":
                        obj = {[this.options.newPropertyName]: value}
                        break;
                }
            }
        } else obj = {[this.name]: value};

        return {obj,errors}
    }

    private checkString(): CheckField {
        return {obj: {}, errors: []}
    }

    private checkNumber(): CheckField {
        return {obj: {}, errors: []}
    }

    private checkFile(): CheckField {
        return {obj: {}, errors: []}
    }

    private checkBool(): CheckField {
        return {obj: {}, errors: []}
    }

    private checkJSON(): CheckField {
        return {obj: {}, errors: []}
    }

    private checkAllowedValues(): CheckField {
        return {obj: {}, errors: []}
    }

    public check(): CheckField {
        if ((this.value === undefined || this.value === null) && !this.optional) {
            return {
                obj: {},
                errors: [Field.errorObj(this.name, "REQUIRED")]
            };
        }

        switch (this.variableType) {
            case "date":
            case "dateArr":
                return this.checkDate();
            case "string":
            case "stringArr":
            case "SqlStringOne":
            case "SqlStringMany":
            case "MongoStringOne":
            case "MongoStringMany":
                return this.checkString();
            case "SqlNumOne":
            case "SqlNumMany":
            case "MongoNumOne":
            case "MongoNumMany":
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
    }
}

export default Field;