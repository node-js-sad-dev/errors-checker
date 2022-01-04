import {CheckField, Options, VariableType, ERRORS_TYPES, CheckWithError} from "./declarations/types";
import moment from "moment";

let NumberAllowedOptions: string[] = ['newPropertyName', 'min', 'max', 'round'];
let StringAllowedOptions: string[] = ['newPropertyName', 'minLength', 'maxLength', 'hasUpperCase', 'hasLowerCase'];
let BoolAllowedOptions: string[] = ['newPropertyName', 'convertToNumber'];
let FileAllowedOptions: string[] = ['newPropertyName', 'allowedExtensions', 'minimumSize', 'maximumSize'];
let DateAllowedOptions: string[] = ['newPropertyName', 'convertToDateFormat'];
let JsonAllowedOptions: string[] = ['newPropertyName', 'allowedProps'];

class Field {
    private readonly _name: string;
    private readonly _value: any;
    private readonly _variableType: VariableType;
    private readonly _optional: boolean;

    private readonly _options?: Options;

    get name(): string {
        return this._name;
    }

    get options(): Options | undefined {
        return this._options;
    }

    constructor(
        name: string,
        value: any,
        variableType: VariableType,
        optional: boolean,
        options?: Options
    ) {
        this._name = name;
        this._value = value;
        this._variableType = variableType;
        this._optional = optional;

        if (options && Object.keys(options).length > 0) {
            this._options = options;

            switch (this._variableType) {
                case "stringArr":
                case "string":
                    for (let prop of Object.keys(this._options)) {
                        if (StringAllowedOptions.indexOf(prop) === -1) throw Error(`Option ${prop} not allowed for string types, list of allowed values is: ${StringAllowedOptions.join(', ')}`);
                    }

                    break;
                case "numArr":
                case "num":
                    for (let prop of Object.keys(this._options)) {
                        if (NumberAllowedOptions.indexOf(prop) === -1) throw Error(`Option ${prop} not allowed for number types, list of allowed values is: ${NumberAllowedOptions.join(', ')}`);
                    }

                    break;
                case "boolArr":
                case "bool":
                    for (let prop of Object.keys(this._options)) {
                        if (BoolAllowedOptions.indexOf(prop) === -1) throw Error(`Option ${prop} not allowed for bool types, list of allowed values is: ${BoolAllowedOptions.join(', ')}`);
                    }

                    break;
                case 'fileArr':
                case "file":
                    for (let prop of Object.keys(this._options)) {
                        if (FileAllowedOptions.indexOf(prop) === -1) throw Error(`Option ${prop} not allowed for file types, list of allowed values is: ${FileAllowedOptions.join(', ')}`);
                    }

                    break;
                case "dateArr":
                case "date":
                    for (let prop of Object.keys(this._options)) {
                        if (DateAllowedOptions.indexOf(prop) === -1) throw Error(`Option ${prop} not allowed for date types, list of allowed values is: ${DateAllowedOptions.join(', ')}`);
                    }

                    break;
                case "JSON":
                    for (let prop of Object.keys(this._options)) {
                        if (JsonAllowedOptions.indexOf(prop) === -1) throw Error(`Option ${prop} not allowed for JSON type, list of allowed values is: ${JsonAllowedOptions.join(', ')}`);
                    }

                    break;
            }
        }
    }

    private static errorObj(name: string, type: ERRORS_TYPES, value?: any): CheckWithError {
        return {
            value: value ? value : null,
            field: name,
            error: type
        }
    }

    private checkDate(): CheckField {
        if (this._value === null || this._value === undefined) return {errors: [], obj: {}};

        let value: Array<any>;

        let valueType = typeof this._value;

        let errors: CheckWithError[] = [];
        let obj: { [key: string]: any } = {};

        switch (valueType) {
            case 'object':
                if (!Array.isArray(this._value)) return {
                    errors: [Field.errorObj(this._name, 'TYPE'), this._value],
                    obj: {}
                };

                value = this._value;

                break;
            case 'string':
                value = this._value.split(',');

                break;
            default:
                return {
                    errors: [Field.errorObj(this._name, 'TYPE'), this._value],
                    obj: {}
                };
        }

        for (let el of value) {
            let parsedDate = Date.parse(el);

            if (isNaN(parsedDate)) errors.push(Field.errorObj(this._name, "TYPE", el))
        }

        if (errors.length > 0) return {obj, errors};

        if (this._options) {
            let options: Options = this._options;

            if (options.convertToDateFormat) {
                switch (this._options.convertToDateFormat) {
                    case "milliseconds":
                        value = value.map(el => Date.parse(el));
                        break;
                    case "YYYY-MM-DD":
                    case "YYYY-MM-DD HH:mm:ss":
                        value = value.map(el => moment(el).format(this._options?.convertToDateFormat));
                        break;
                }
            }

            if (options.newPropertyName !== undefined) {
                if (options.newPropertyName !== null) {
                    switch (this._variableType) {
                        case "date":
                            obj = {[options.newPropertyName]: value.join('')}
                            break;
                        case "dateArr":
                            obj = {[options.newPropertyName]: value}
                            break;
                    }
                }
            } else {
                switch (this._variableType) {
                    case "date":
                        obj = {[this._name]: value.join('')}
                        break;
                    case "dateArr":
                        obj = {[this._name]: value}
                        break;
                }
            }

        } else {
            switch (this._variableType) {
                case "date":
                    obj = {[this._name]: value.join('')}
                    break;
                case "dateArr":
                    obj = {[this._name]: value}
                    break;
            }
        }

        return {obj, errors}
    }

    private checkString(): CheckField {
        if (this._value === null || this._value === undefined) return {errors: [], obj: {}};

        let value: Array<any>;

        let valueType = typeof this._value;

        let errors: CheckWithError[] = [];
        let obj: { [key: string]: any } = {};

        switch (valueType) {
            case 'object':
                if (!Array.isArray(this._value)) return {
                    errors: [Field.errorObj(this._name, 'TYPE'), this._value],
                    obj: {}
                };

                value = this._value;

                break;
            case 'string':
                value = this._value.split(',');

                break;
            default:
                return {
                    errors: [Field.errorObj(this._name, 'TYPE'), this._value],
                    obj: {}
                };
        }

        for (let el of value) {
            let elType = typeof el;

            if (elType !== "string") {
                errors.push(Field.errorObj(this._name, "TYPE", el));
            } else if (this._options) {
                let options: Options = this._options;

                if (options.minLength) {
                    if (options.minLength > el.length) {
                        errors.push(Field.errorObj(this._name, "STRING_TO_SHORT", el));
                        break;
                    }
                }

                if (options.maxLength) {
                    if (options.maxLength < el.length) {
                        errors.push(Field.errorObj(this._name, "STRING_TO_LONG", el));
                        break;
                    }
                }

                if (options.hasUpperCase !== undefined) {
                    if (options.hasUpperCase !== this.checkIfStrHasUpperCase()) {
                        if (options.hasUpperCase) errors.push(Field.errorObj(this._name, "STRING_DONT_HAVE_UPPER_CASE", el));
                        else errors.push(Field.errorObj(this._name, "STRING_HAS_UPPER_CASE", el));
                        break;
                    }
                }

                if (options.hasLowerCase !== undefined) {
                    if (options.hasLowerCase !== this.checkIfStrHasLowerCase()) {
                        if (options.hasLowerCase) errors.push(Field.errorObj(this._name, "STRING_DONT_HAVE_LOWER_CASE", el));
                        else errors.push(Field.errorObj(this._name, "STRING_HAS_LOWER_CASE", el));
                        break;
                    }
                }
            }
        }

        if (errors.length > 0) return {obj, errors};

        if (this._options) {
            let options: Options = this._options;

            if (options.newPropertyName !== undefined) {
                if (options.newPropertyName !== null) {
                    switch (this._variableType) {
                        case "string":
                            obj = {[options.newPropertyName]: value.join('')}
                            break;
                        case "stringArr":
                            obj = {[options.newPropertyName]: value}
                            break;
                    }
                }
            } else {
                switch (this._variableType) {
                    case "string":
                        obj = {[this._name]: value.join('')}
                        break;
                    case "stringArr":
                        obj = {[this._name]: value}
                        break;
                }
            }

        } else {
            switch (this._variableType) {
                case "string":
                    obj = {[this._name]: value.join('')}
                    break;
                case "stringArr":
                    obj = {[this._name]: value}
                    break;
            }
        }

        return {obj, errors}
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

    private checkIfStrHasUpperCase(): boolean {
        for (let el of this._value) {
            if (el === el.toUpperCase()) return true;
        }

        return false;
    }

    private checkIfStrHasLowerCase(): boolean {
        for (let el of this._value) {
            if (el === el.toLowerCase()) return true;
        }

        return false;
    }

    public check(): CheckField {
        if ((this._value === undefined || this._value === null) && !this._optional) {
            return {
                obj: {},
                errors: [Field.errorObj(this._name, "REQUIRED")]
            };
        }

        switch (this._variableType) {
            case "date":
            case "dateArr":
                return this.checkDate();
            case "string":
            case "stringArr":
                return this.checkString();
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
            case "allowedValuesArr":
                return this.checkAllowedValues();
        }
    }
}

export default Field;