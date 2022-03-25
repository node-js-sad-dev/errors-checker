import {Field, IOptions} from "./Field";
import {
    CheckField,
    CheckWithError,
    DefaultArrOptions,
    ERRORS,
    NumberArrOptions,
    NumberOptions
} from "../declarations/types";
import {Utils} from "../utils/Utils";

export class NumberArrField extends Field implements IOptions<NumberArrOptions>{
    readonly options?: NumberArrOptions;

    constructor(name: string, value: any, optional: boolean, options?: NumberArrOptions) {
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

        errors.push(...Utils.checkArrayProperties(this.value, <DefaultArrOptions>this.options, this.name));

        for (let el of parsedValues) {
            let [checkedEl, checkedErrors] = Utils.checkNumber(el, propertyName, <NumberOptions><unknown>this.options);

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