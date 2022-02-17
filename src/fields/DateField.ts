import {Field} from "./Field";
import {CheckField, DateOptions, ERRORS} from "../declarations/types";
import {Utils} from "../Utils";

export class DateField extends Field {
    readonly options?: DateOptions;

    constructor(name: string, value: any, optional: boolean, options?: DateOptions) {
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

        let [value, errors] = Utils.checkDate(this.value, propertyName, this.options);

        if ((value && !Array.isArray(value)) || (value && Array.isArray(value) && value.length !== 0)) {
            obj = Utils.formattedObj(value, propertyName);
        }

        return [obj, errors];
    }
}