import Field from "./src/Field";
import FieldsCheckOutput from "./src/FieldsCheckOutput";

let fieldsChecker = new FieldsCheckOutput([
    new Field('testO', '2020-01-01 00:23:d3,2020-01-01 00:d3:23', 'dateArr', false, {
        newPropertyName: 'testN',
        convertToDateFormat: "YYYY-MM-DD HH:mm:ss"
    }),
    new Field('test2O', 'asІdsdasdss', 'string', false, {
        hasLowerCase: true,
        hasUpperCase: true
    }),
    new Field('test3O', '2020-01-01 00:23:22', 'date', false),
])

console.log(fieldsChecker.check());