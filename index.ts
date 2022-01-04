import Field from "./src/Field";
import FieldsCheckOutput from "./src/FieldsCheckOutput";

let fieldsChecker = new FieldsCheckOutput([
    new Field('testO', '2020-01-01 00:23:23', 'date', false, {
        newPropertyName: 'testN',
        convertToDateFormat: "YYYY-MM-DD HH:mm:ss"
    }),
    new Field('test2O', 'asdsdasdss', 'string', false, {
        hasLowerCase: true,
        hasUpperCase: true
    }),
    new Field('test3O', '2020-01-01 00:23:22', 'date', false, {
        newPropertyName: null
    }),
])

console.log(fieldsChecker.check());