import Field from "./src/Field"

let field = new Field('test', 'test', 'string', true, {
    newPropertyName: 'test',
    round: 2
});

console.log(field);