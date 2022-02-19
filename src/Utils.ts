import {CheckField, CheckWithError, DefaultArrOptions} from "./declarations/types";
import {
    AllowedValuesOptions,
    BooleanOptions,
    DateOptions,
    ERRORS,
    NumberOptions,
    ObjectOptions,
    StringOptions
} from "./declarations/types";

export class Utils {
    public static formatDate(date: string, format: "YYYY-MM-DD" | "YYYY-MM-DD HH:mm:ss") {
        let d = new Date(date);

        let month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        let hours = '' + d.getHours(),
            minutes = '' + d.getMinutes(),
            seconds = '' + d.getSeconds();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        if (hours.length < 2) hours = '0' + hours;
        if (minutes.length < 2) minutes = '0' + minutes;
        if (seconds.length < 2) seconds = '0' + seconds;

        switch (format) {
            case "YYYY-MM-DD":
                return `${year}-${month}-${day}`;
            case "YYYY-MM-DD HH:mm:ss":
                return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }
    }

    public static compare2Arrays(arr1: Array<any>, arr2: Array<any>): boolean {
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

    public static compare2Objects(obj1: {[key: string]: any}, obj2: {[key: string]: any}): boolean {
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

    public static checkIfStrHasUpperCase(value: string): boolean {
        for (let el of value) {
            if (el === el.toUpperCase()) return true;
        }

        return false;
    }

    public static checkIfStrHasLowerCase(value: string): boolean {
        for (let el of value) {
            if (el === el.toLowerCase()) return true;
        }

        return false;
    }

    public static formattedObj(value: any, propertyName: string): { [key: string]: any } {
        return {[propertyName]: value};
    }

    public static parseArr(value: string | Array<any>, delimiter: string = ','): Array<any> {
        let values: Array<any>;

        if (Array.isArray(value)) {
            values = value;
        } else {
            values = value.split(delimiter);
        }

        return values;
    }

    public static errorObj(name: string, type: ERRORS, value?: any): CheckWithError {
        return {
            value: value ? value : null,
            field: name,
            error: type
        }
    }

    public static checkDate(value: any, name: string, options?: DateOptions): CheckField {
        let errors: CheckWithError[] = [];

        let parsedDate = Date.parse(value);

        if (isNaN(parsedDate)) errors.push(Utils.errorObj(name, ERRORS.TYPE, value));

        if (errors.length > 0) return [null, errors];

        if (options) {
            if (options.convertToDateFormat) {
                switch (options.convertToDateFormat) {
                    case "milliseconds":
                        value = Date.parse(value);
                        break;
                    case "YYYY-MM-DD":
                    case "YYYY-MM-DD HH:mm:ss":
                        value = Utils.formatDate(value, options.convertToDateFormat);
                        break;
                }
            }
        }

        return [value, errors];
    }

    public static checkString(value: any, name: string, options?: StringOptions): CheckField {
        let errors: CheckWithError[] = [];

        if (typeof value !== 'string') errors.push(Utils.errorObj(name, ERRORS.TYPE, value));

        if (errors.length > 0) return [null, errors];

        if (options) {
            if (options.minLength) {
                if (options.minLength > value.length) {
                    errors.push(Utils.errorObj(name, ERRORS.STR_TOO_SHORT, value));
                }
            }

            if (options.maxLength) {
                if (options.maxLength < value.length) {
                    errors.push(Utils.errorObj(name, ERRORS.STR_TOO_LONG, value));
                }
            }

            if (options.hasUpperCase !== undefined) {
                if (options.hasUpperCase !== Utils.checkIfStrHasUpperCase(value)) {
                    if (options.hasUpperCase) errors.push(Utils.errorObj(name, ERRORS.STR_DONT_HAVE_UPPER, value));
                    else errors.push(Utils.errorObj(name, ERRORS.STR_HAS_UPPER, value));
                }
            }

            if (options.hasLowerCase !== undefined) {
                if (options.hasLowerCase !== Utils.checkIfStrHasLowerCase(value)) {
                    if (options.hasLowerCase) errors.push(Utils.errorObj(name, ERRORS.STR_DONT_HAVE_LOWER, value));
                    else errors.push(Utils.errorObj(name, ERRORS.STR_HAS_LOWER, value));
                }
            }
        }

        if (errors.length > 0) return [null, errors];

        return [value, errors];
    }

    public static checkNumber(value: any, name: string, options?: NumberOptions): CheckField {
        let errors: CheckWithError[] = [];

        if (isNaN(value)) errors.push(Utils.errorObj(name, ERRORS.TYPE, value));

        if (typeof value === 'string') value = +value;

        if (errors.length > 0) return [null, errors];

        if (options) {
            if (options.min && value < options.min) {
                errors.push(Utils.errorObj(name, ERRORS.NUM_TOO_SMALL, value));
            }

            if (options.max && value > options.max) {
                errors.push(Utils.errorObj(name, ERRORS.NUM_TOO_LARGE, value));
            }
        }

        if (errors.length > 0) return [value, errors];

        return [value, errors];
    }

    public static checkBool(value: any, name: string, options?: BooleanOptions): CheckField {
        let errors: CheckWithError[] = [];

        if (value === 1 || value === '1' || value === 'true') value = true;
        if (value === 0 || value === '0' || value === 'false') value = false;

        if (value !== 1 && value !== '1' && value !== 'true' && value !== true &&
            value !== 0 && value !== '0' && value !== 'false' && value !== false) errors.push(Utils.errorObj(name, ERRORS.TYPE, value));

        if (errors.length > 0) return [null, errors];

        if (options) {
            if (options.convertToNumber === true) {
                value = value ? 1 : 0;
            }
        }

        return [value, errors];
    }

    public static checkObject(value: any, name: string, options: ObjectOptions): CheckField {
        let errors: CheckWithError[] = [];

        if (!options || !options.allowedProps) throw Error('ALLOWED_PROPS_ARE_NOT_SET');

        let valueType = typeof value;

        if (valueType !== 'object' || Array.isArray(value))         return [null, [Utils.errorObj(name, ERRORS.TYPE, value)]];

        let objKeys = Object.keys(value);

        if (objKeys.length !== options.allowedProps.length)         return [null, [Utils.errorObj(name, ERRORS.OBJ_INVALID_KEYS, value)]];

        for (let allowedProperty of options.allowedProps) {
            if (objKeys.indexOf(allowedProperty) === -1) errors.push(Utils.errorObj(name, ERRORS.OBJ_INVALID_KEY, value))
        }

        if (errors.length > 0) value = null;

        return [value, errors];
    }

    public static checkAllowedValues(value: any, name: string, options: AllowedValuesOptions): CheckField {
        let errors: CheckWithError[] = [];

        let valueType = typeof value;

        switch (valueType) {
            case "object":
                if (Array.isArray(value)) {
                    let checked = false;

                    for (let el of options.allowedValues) {
                        if (Array.isArray(el)) {
                            let arraysCompare = Utils.compare2Arrays(value, el);

                            if (arraysCompare) checked = true;
                        }
                    }

                    if (!checked) return [null, [Utils.errorObj(name, ERRORS.TYPE, value)]];
                } else {
                    let checked = false;

                    for (let el of options.allowedValues) {
                        if (typeof el === "object" && !Array.isArray(el)) {
                            let objectsCompare = Utils.compare2Objects(value, el);

                            if (objectsCompare) checked = true;
                        }
                    }

                    if (!checked) return [null, [Utils.errorObj(name, ERRORS.TYPE, value)]];
                }

                break;
            default:
                if (options.allowedValues.indexOf(value) === -1) return [null, [Utils.errorObj(name, ERRORS.TYPE, value)]];

                break;
        }

        return [value, errors];
    }

    public static checkArrayProperties(value: any, options: DefaultArrOptions, fieldName: string): CheckWithError[] {
        let arr = Utils.parseArr(value, options?.delimiter);

        let errors: CheckWithError[] = [];

        if (options?.maxArrayLength && arr.length > options.maxArrayLength) {
            errors.push({value: arr, error: ERRORS.ARR_TOO_LONG, field: fieldName})
        }

        if (options?.minArrayLength && arr.length < options.minArrayLength) {
            errors.push({value: arr, error: ERRORS.ARR_TOO_SHORT, field: fieldName})
        }

        return errors;
    }
}