# errors-checker

**Error validator**

**WARNING! NOT READY FOR PRODUCTION USE**

Simple library for validating input data.

Example of usage:

```typescript
import {Field, FieldsCheckOutput} from "errors-checker";

// create an array of checked params
let params = [
    new Field('test', someValueToValidate, 'num', true, {...options})
];

// pass params to FieldsCheckOutput constructor
let {errors, obj} = new FieldsCheckOutput(params).check();
```

**IMPORTANT! JSON check type work in progress, formatted date returns in UTC format**