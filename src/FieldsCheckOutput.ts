import Field from "./Field";
import {CheckWithError} from "./declarations/types";

type Response = {
    obj: {[p: string]: any},
    errors: CheckWithError[]
}

export default class FieldsCheckOutput {
    public fields: Field[];

    constructor(fields: Field[]) {
        let arrayOfFieldNames: Array<string> = [];
        let arrayOfNewFieldsNames: Array<string> = [];
        let arrayOfAllNames: Array<string> = [];

        fields.forEach(el => {
            arrayOfFieldNames.push(el.name);
            arrayOfAllNames.push(el.name);

            if (el.options && el.options.newPropertyName) {
                arrayOfNewFieldsNames.push(el.options.newPropertyName);
                arrayOfAllNames.push(el.options.newPropertyName);
            }
        })

        let uniqNamesSet:           Array<string> = Array.from(new Set(arrayOfFieldNames));
        let uniqNewFieldNamesSet:   Array<string> = Array.from(new Set(arrayOfNewFieldsNames));
        let uniqAllNamesSet:        Array<string> = Array.from(new Set(arrayOfAllNames));

        if (arrayOfFieldNames.length !== uniqNamesSet.length)
            throw Error ("Array has duplicate names");
        if (arrayOfNewFieldsNames.length !== uniqNewFieldNamesSet.length)
            throw Error ("Array has duplicate new property names");
        if (uniqAllNamesSet.length !== arrayOfAllNames.length)
            throw Error("Not allowed to have same old and new property names");

        this.fields = fields;
    }

    public check(): Response {
        let obj: {[p: string]: any} = {};
        let errors: CheckWithError[] = [];

        for (let field of this.fields) {
            let [checkedObj, checkedErrors] = field.check();

            obj = Object.assign(obj, checkedObj);

            errors.push(...checkedErrors);
        }

        return {obj, errors}
    }
}