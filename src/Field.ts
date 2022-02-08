import {CheckField, Options, VariableType, ERRORS_TYPES, CheckWithError} from "./declarations/types";
import {Utils} from "./declarations/Utils";

let NumberAllowedOptions:   string[] = ['newPropertyName', 'min', 'max', 'round'];
let StringAllowedOptions:   string[] = ['newPropertyName', 'minLength', 'maxLength', 'hasUpperCase', 'hasLowerCase'];
let BoolAllowedOptions:     string[] = ['newPropertyName', 'convertToNumber'];
let DateAllowedOptions:     string[] = ['newPropertyName', 'convertToDateFormat'];
let JsonAllowedOptions:     string[] = ['newPropertyName', 'allowedProps'];

export class Field {
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

            if (options.allowedValues && !Array.isArray(options.allowedValues)) throw Error('ALLOWED_VALUES_IN_NOT_ARRAY');

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

    private static compare2Arrays(arr1: Array<any>, arr2: Array<any>): boolean {
        if (arr1.length !== arr2.length) return false;

        arr1 = arr1.sort();
        arr2 = arr2.sort();

        for (let i = 0; i < arr1.length; i++) {
            switch (typeof arr1[i]) {
                case 'object':
                    if (Array.isArray(arr1[i]) && !Array.isArray(arr2[i])) return false;

                    if (!Array.isArray(arr1[i]) && Array.isArray(arr2[i])) return false;

                    if (Array.isArray(arr1[i])) {
                        let areArraysEqual: boolean = this.compare2Arrays(arr1[i], arr2[i]);

                        if (!areArraysEqual) return false;
                    } else {
                        let areObjectsEqual: boolean = this.compare2Objects(arr1[i], arr2[i]);

                        if (!areObjectsEqual) return false;
                    }

                    break;
                default:
                    if (arr1[i] !== arr2[i]) return false;

                    break;
            }
        }

        return true;
    }

    private static compare2Objects(obj1: {[key: string]: any}, obj2: {[key: string]: any}): boolean {
        let firstObjKeys = Object.keys(obj1),
            secondObjKeys = Object.keys(obj2);

        if (firstObjKeys.length !== secondObjKeys.length) return false;

        for (let key of firstObjKeys) {
            let firstObjKeyType = typeof obj1[key];
            let secondObjKeyType = typeof obj2[key];

            if (firstObjKeyType !== secondObjKeyType) return false;

            switch (firstObjKeyType) {
                case "object":
                    if (Array.isArray(obj1[key]) && !Array.isArray(obj2[key])) return false;

                    if (!Array.isArray(obj1[key]) && Array.isArray(obj2[key])) return false;

                    if (Array.isArray(obj1[key])) {
                        let areArraysEqual: boolean = this.compare2Arrays(obj1[key], obj2[key]);

                        if (!areArraysEqual) return false;
                    } else {
                        let areObjectsEqual: boolean = this.compare2Objects(obj1[key], obj2[key]);

                        if (!areObjectsEqual) return false;
                    }

                    break;
                default:
                    if (obj1[key] !== obj2[key]) return false;

                    break;
            }
        }

        return true;
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

    /* ========================================================================================= */

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
                        value = Utils.formatDate(value, this.options.convertToDateFormat);
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

        if (!options || !options.allowedValues) throw Error('ALLOWED_VALUES_NOT_SET');

        let valueType = typeof value;

        switch (valueType) {
            case "object":
                if (Array.isArray(value)) {
                    let checked = false;

                    for (let el of options.allowedValues) {
                        if (Array.isArray(el)) {
                            let arraysCompare = Field.compare2Arrays(value, el);

                            if (arraysCompare) checked = true;
                        }
                    }

                    if (!checked) return [null, [Field.errorObj(this.name, "TYPE", value)]];
                } else {
                    let checked = false;

                    for (let el of options.allowedValues) {
                        if (typeof el === "object" && !Array.isArray(el)) {
                            let objectsCompare = Field.compare2Objects(value, el);

                            if (objectsCompare) checked = true;
                        }
                    }

                    if (!checked) return [null, [Field.errorObj(this.name, "TYPE", value)]];
                }

                break;
            default:
                if (options.allowedValues.indexOf(value) === -1) return [null, [Field.errorObj(this.name, "TYPE", value)]];

                break;
        }

        return [value, errors];
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
            case "allowedValues":
                [value, errors] = this.checkAllowedValues(this._value);

                break;
            case "allowedValuesArr":
                values = this.parseArr();

                value = [];

                for (let el of values) {
                    let [checkedEl, checkedErrors] = this.checkAllowedValues(el);

                    if (checkedEl) {
                        value.push(checkedEl);
                    }

                    errors.push(...checkedErrors);
                }

                break;
            case "JSON":
                return this.checkJSON();
        }

        if ((value && !Array.isArray(value)) || (value && Array.isArray(value) && value.length !== 0)) {
            obj = this.formattedObj(value);
        }

        return [obj, errors];
    }
}