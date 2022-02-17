import {Field, IOptions} from "./Field";
import {
    CheckField, CheckWithError,
    DateArrOptions,
    DateOptions, ERRORS
} from "../declarations/types";
import {Utils} from "../Utils";

export class DateArrField extends Field implements IOptions<DateArrOptions> {
    readonly options?: DateArrOptions;

    constructor(name: string, value: any, optional: boolean, options?: DateArrOptions) {
        super(name, value, optional);

        this.options = options;
    }

    check(): CheckField {
        if ((this.value === undefined || this.value === null) && !this.optional) {
            return [
                {},
                [Utils.errorObj(this.name, ERRORS.REQUIRED)]
            ];
        }

        let obj: Object = {};

        let propertyName = this.name;

        if (this.options && this.options.newPropertyName) propertyName = this.options.newPropertyName;

        if (this.value === null || this.value === undefined) {
            let resultedObj = {};

            if (this.options?.defaultValue) {
                resultedObj = Utils.formattedObj(this.options.defaultValue, propertyName);
            } else {
                resultedObj = Utils.formattedObj(null, propertyName)
            }

            return [resultedObj, []]
        }

        let delimiter = this.options?.delimiter;

        if (!Array.isArray(this.value) && typeof this.value !== 'string') {
            return [
                {},
                [Utils.errorObj(this.name, ERRORS.TYPE)]
            ];
        }

        let parsedValues = Utils.parseArr(this.value, delimiter);

        let value = [], errors: CheckWithError[] = [];

        for (let el of parsedValues) {
            let [checkedEl, checkedErrors] = Utils.checkDate(el, propertyName, <DateOptions>this.options);

            if (checkedEl) {
                value.push(checkedEl);
            }

            errors.push(...checkedErrors);
        }

        if ((value && !Array.isArray(value)) || (value && Array.isArray(value) && value.length !== 0)) {
            obj = Utils.formattedObj(value, propertyName);
        }

        return [obj, errors];
    }
}