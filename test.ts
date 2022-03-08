import {AllowedValuesArrField, BooleanArrField, NumberArrField, NumberField, AllowedValuesField, BooleanField, StringArrField, StringField, DateArrField, DateField, ObjectField, FieldCheck} from "./index";

let params = [
    new NumberField('test', '3', false),
    new NumberArrField('test2', '1;2;3;4;5;6;7', false, {
        delimiter: ";"
    }),
    new StringField('test3', null, false),
    new StringArrField('test4', "qweqwe,qweqweqweqwe", true),
    new BooleanField('test5', 0, true),
    new BooleanArrField('test6', [1, 0, true, false, '1', '0', 'true', 'false'], true, {
        convertToNumber: true
    }),
    new DateField('test7', '2020-02-02', true),
    new DateArrField('test8', ['2020-02-02 00:00:00', '2020-02-01'], true, {
        convertToDateFormat: "YYYY-MM-DD"
    }),
    new AllowedValuesField('test9', 8, true, {
        allowedValues: [7, 8, 9]
    }),
    new AllowedValuesArrField('test10', [5, 6, 7, 8], true, {
        allowedValues: [5, 6, 7, 8, 9, 10]
    }),
    new ObjectField('test11', {test: "DDDDDDDDDDDDD"}, true, {
        allowedProps: ['test']
    })
]

let {errors, obj} = new FieldCheck(params).check();

console.log(errors);

console.log(obj);