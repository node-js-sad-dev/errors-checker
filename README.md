# errors-checker

**Error validator**

**WARNING! NOT READY FOR PRODUCTION USE**

Simple library for validating input data.

Example of usage:

```typescript
import {Field, FieldsCheckOutput} from "errors-checker";

// create an array of checked params
let params = [
    new Field('test', someValueToValidate, 'number', true, {...options})
];

// pass params to FieldsCheckOutput constructor
let {errors, obj} = new FieldsCheckOutput(params).check();
```

Options:

| Option name           | Option description                                | Where to use      |
| --------------------- | ------------------------------------------------- | ----------------- |
| convertToNumber       | Convert bool to number (true = 1, false = 0)      | BOOLEAN           |
| convertToDateFormat   | Date format in which date must be converted       | DATE              |
| allowedProps          | Set of allowed properties                         | object            |
| min                   | Minimal allowed number                            | NUMBER            |
| max                   | Maximum allowed number                            | NUMBER            |
| round                 | Count of numbers after decimal point              | NUMBER            |
| minLength             | Minimum allowed string length                     | STRING            |
| maxLength             | Maximum allowed string length                     | STRING            |
| hasUpperCase          | Has string upper case letters or not              | STRING            |
| hasLowerCase          | Has string lower case letters or not              | STRING            |
| allowedValues         | Allowed values on which need to check             | ALLOWED_VALUES    |
| newPropertyName       | Name of property in which need to save result     | DEF_OPTIONS       |

**IMPORTANT! Formatted date returns in UTC timezone**