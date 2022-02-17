import {CheckWithError} from "./declarations/types";
import {Field} from "./fields/Field";

export type ValidateError = CheckWithError;

type Response = {
    obj: {[p: string]: any},
    errors: CheckWithError[]
}

export class FieldCheck {
    public fields: Field[];

    constructor(fields: Field[]) {
        let nameArray: Array<string> = [];
        let newPropertyNameArray: Array<string> = [];

        for (let field of fields) {
            nameArray.push(field.name);
            if (field.options && field.options.newPropertyName) {
                if (field.options.newPropertyName === field.name) delete field.options.newPropertyName;
                else newPropertyNameArray.push(field.options.newPropertyName);
            }
        }

        let setArrayOfNames = Array.from(new Set(nameArray));
        let setArrayOfNewPropertyName = Array.from(new Set(newPropertyNameArray));

        if (nameArray.length !== setArrayOfNames.length)
            throw Error ("Array has duplicate names");
        if (newPropertyNameArray.length !== setArrayOfNewPropertyName.length)
            throw Error ("Array has duplicate new property names");

        let combinedArr = [...setArrayOfNewPropertyName, setArrayOfNames];

        if (combinedArr.length !== Array.from(new Set(combinedArr)).length)
            throw Error ("New field names overwrite field names");

        this.fields = fields;
    }

    public check(): Response {
        let obj: Object = {};
        let errors: CheckWithError[] = [];

        for (let field of this.fields) {
            let [checkedObj, checkedErrors] = field.check();

            Object.assign(obj, checkedObj);

            errors.push(...checkedErrors);
        }

        return {obj, errors}
    }
}