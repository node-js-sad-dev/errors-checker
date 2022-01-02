import Field from "./src/Field";

let field = new Field('test', '2020-01-01 00:23:23', 'date', false, {
    newPropertyName: 'test2',
    convertToDateFormat: "YYYY-MM-DD HH:mm:ss"
});

console.log(field.check());