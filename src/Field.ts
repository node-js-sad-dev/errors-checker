import {CheckField, Options, VariableType, ERRORS_TYPES, CheckWithError} from "./declarations/types";
import moment from "moment";

let NumberAllowedOptions:   string[] = ['newPropertyName', 'min', 'max', 'round'];
let StringAllowedOptions:   string[] = ['newPropertyName', 'minLength', 'maxLength', 'hasUpperCase', 'hasLowerCase'];
let BoolAllowedOptions:     string[] = ['newPropertyName', 'convertToNumber'];
let FileAllowedOptions:     string[] = ['newPropertyName', 'allowedExtensions', 'minimumSize', 'maximumSize'];
let DateAllowedOptions:     string[] = ['newPropertyName', 'convertToDateFormat'];
let JsonAllowedOptions:     string[] = ['newPropertyName', 'allowedProps'];

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

    /**
     * @description Class to describe field
     * @constructor
     * @param name {string} Name of parameter
     * @param value {any} Parameter value
     * @param variableType {VariableType} Type of parameter on which need to check
     * @param optional {boolean} Is parameter optional or not
     * @param options {Options} Additional options for check or transformation value
     */

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

    private formattedObj(value: any): { [key: string]: any } {
        let obj: { [key: string]: any } = {};

        if (this.options && this.options.newPropertyName !== undefined) {
            if (this.options.newPropertyName !== null) obj = {[this.options.newPropertyName]: value};
        } else {
            obj = {[this.name]: value};
        }

        return obj;
    }

    private parseArr(): Array<any> {
        let values: Array<any>;

        if (Array.isArray(this._value)) {
            values = this._value;
        } else {
            values = this._value.split(',');
        }

        return values;
    }

    private static errorObj(name: string, type: ERRORS_TYPES, value?: any): CheckWithError {
        return {
            value: value ? value : null,
            field: name,
            error: type
        }
    }

    private checkDate(value: any): CheckField {
        let errors: CheckWithError[] = [];

        let parsedDate = Date.parse(value);

        if (isNaN(parsedDate)) errors.push(Field.errorObj(this.name, "TYPE", value));

        if (errors.length > 0) return [null, errors];

        if (this.options) {
            let options: Options = this.options;

            if (options.convertToDateFormat) {
                switch (this.options.convertToDateFormat) {
                    case "milliseconds":
                        value = Date.parse(value);
                        break;
                    case "YYYY-MM-DD":
                    case "YYYY-MM-DD HH:mm:ss":
                        value = moment(value).format(this.options.convertToDateFormat);
                        break;
                }
            }
        }

        return [value, errors];
    }

    private checkString(value: any): CheckField {
        let errors: CheckWithError[] = [];

        if (typeof value !== 'string') errors.push(Field.errorObj(this.name, "TYPE", value));

        if (errors.length > 0) return [null, errors];

        if (this.options) {
            let options: Options = this.options;

            if (options.minLength) {
                if (options.minLength > value.length) {
                    errors.push(Field.errorObj(this.name, "STRING_TOO_SHORT", value));
                }
            }

            if (options.maxLength) {
                if (options.maxLength < value.length) {
                    errors.push(Field.errorObj(this.name, "STRING_TOO_LONG", value));
                }
            }

            if (options.hasUpperCase !== undefined) {
                if (options.hasUpperCase !== this.checkIfStrHasUpperCase()) {
                    if (options.hasUpperCase) errors.push(Field.errorObj(this.name, "STRING_DONT_HAVE_UPPER_CASE", value));
                    else errors.push(Field.errorObj(this.name, "STRING_HAS_UPPER_CASE", value));
                }
            }

            if (options.hasLowerCase !== undefined) {
                if (options.hasLowerCase !== this.checkIfStrHasLowerCase()) {
                    if (options.hasLowerCase) errors.push(Field.errorObj(this.name, "STRING_DONT_HAVE_LOWER_CASE", value));
                    else errors.push(Field.errorObj(this.name, "STRING_HAS_LOWER_CASE", value));
                }
            }
        }

        if (errors.length > 0) return [null, errors];

        return [value, errors];
    }

    private checkNumber(value: any): CheckField {
        let errors: CheckWithError[] = [];

        if (isNaN(value)) errors.push(Field.errorObj(this.name, "TYPE", value));

        if (typeof value === 'string') value = +value;

        if (errors.length > 0) return [null, errors];

        if (this.options) {
            let options: Options = this.options;

            if (options.min && value < options.min) {
                errors.push(Field.errorObj(this.name, "NUMBER_TOO_SMALL", value));
            }

            if (options.max && value > options.max) {
                errors.push(Field.errorObj(this.name, "NUMBER_TOO_LARGE", value));
            }
        }

        if (errors.length > 0) return [value, errors];

        return [value, errors];
    }

    private checkFile(): CheckField {
        return [null, []];
    }

    private checkBool(value: any): CheckField {
        let errors: CheckWithError[] = [];

        if (value === 1 || value === '1' || value === 'true') value = true;
        if (value === 0 || value === '0' || value === 'false') value = false;

        if (value !== 1 && value !== '1' && value !== 'true' && value !== true &&
            value !== 0 && value !== '0' && value !== 'false' && value !== false) errors.push(Field.errorObj(this.name, "TYPE", value));

        if (errors.length > 0) return [null, errors];

        if (this.options) {
            let options: Options = this.options;

            if (options.convertToNumber === true) {
                value = value ? 1 : 0;
            }
        }

        return [value, errors];
    }

    private checkJSON(): CheckField {
        return [null, []];
    }

    private checkAllowedValues(value: any): CheckField {
        let errors: CheckWithError[] = [];

        let options: Options | undefined = this.options;

        if (!options || !options.allowedValues) return [null, [Field.errorObj(this.name, "ALLOWED_VALUES_NOT_SET", value)]];

        if (!Array.isArray(options.allowedValues)) return [null, [Field.errorObj(this.name, "ALLOWED_VALUES_IN_NOT_ARRAY", value)]];

        console.log("NOW WORK ONLY WITH PRIMITIVE TYPES");

        if (options.allowedValues.indexOf(value) === -1) return [null, [Field.errorObj(this.name, "TYPE", value)]];

        // TODO

        return [null, []];
    }

    /**
     * @description Function to check is field valid or not and transformation to another format if it is needed
     * @return {CheckField} Return is field valid or not and checked value
     */

    public check(): CheckField {
        if ((this._value === undefined || this._value === null) && !this._optional) {
            return [
                {},
                [Field.errorObj(this._name, "REQUIRED")]
            ];
        }

        if (this._value === null || this._value === undefined) return [{}, []];

        let errors: CheckWithError[] = [];
        let obj: { [key: string]: any } = {};

        let value: any;

        let values: Array<any>;

        switch (this._variableType) {
            case "date":
                [value, errors] = this.checkDate(this._value);

                break;
            case "dateArr":
                values = this.parseArr();

                value = [];

                for (let el of values) {
                    let [checkedEl, checkedErrors] = this.checkDate(el);

                    if (checkedEl) {
                        value.push(checkedEl);
                    }

                    errors.push(...checkedErrors);
                }

                break;
            case "string":
                [value, errors] = this.checkString(this._value);

                break;
            case "stringArr":
                values = this.parseArr();

                value = [];

                for (let el of values) {
                    let [checkedEl, checkedErrors] = this.checkString(el);

                    if (checkedEl) {
                        value.push(checkedEl);
                    }

                    errors.push(...checkedErrors);
                }

                break;
            case "num":
                [value, errors] = this.checkNumber(this._value);

                break;
            case "numArr":
                values = this.parseArr();

                value = [];

                for (let el of values) {
                    let [checkedEl, checkedErrors] = this.checkNumber(el);

                    if (checkedEl) {
                        value.push(checkedEl);
                    }

                    errors.push(...checkedErrors);
                }

                break;
            case "bool":
                [value, errors] = this.checkBool(this._value);

                break;
            case "boolArr":
                values = this.parseArr();

                value = [];

                for (let el of values) {
                    let [checkedEl, checkedErrors] = this.checkBool(el);

                    if (checkedEl) {
                        value.push(checkedEl);
                    }

                    errors.push(...checkedErrors);
                }

                break;
            case "file":
            case "fileArr":
                return this.checkFile();
            case "allowedValues":
            case "allowedValuesArr":
                // return this.checkAllowedValues();
            case "JSON":
                return this.checkJSON();
        }

        if ((value && !Array.isArray(value)) || (value && Array.isArray(value) && value.length !== 0)) {
            obj = this.formattedObj(value);
        }

        return [obj, errors];
    }
}

export default Field;