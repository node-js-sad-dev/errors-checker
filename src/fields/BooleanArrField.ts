import {Field, IOptions} from "./Field";
import {CheckField, CheckWithError, DefaultArrOptions} from "../declarations/types";
import {BooleanArrOptions, BooleanOptions, ERRORS} from "../declarations/types";
import {Utils} from "../Utils";

export class BooleanArrField extends Field implements IOptions<BooleanArrOptions>{
    readonly options?: BooleanArrOptions;

    constructor(name: string, value: any, optional: boolean, options?: BooleanArrOptions) {
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
            let [checkedEl, checkedErrors] = Utils.checkBool(el, propertyName, <BooleanOptions>this.options);

            if (checkedEl !== undefined) {
                value.push(checkedEl);
            }

            errors.push(...checkedErrors);
        }

        if ((value !== undefined && !Array.isArray(value)) || (value !== undefined && Array.isArray(value) && value.length !== 0)) {
            obj = Utils.formattedObj(value, propertyName);
        }

        return [obj, errors];
    }
}