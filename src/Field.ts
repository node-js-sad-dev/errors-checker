import {CheckField, Options, VariableType} from "./declarations/types";

class Field {
    public  name:               string;
    public  value:              any;
    public  variableType:       VariableType;
    public  optional:           boolean;

    public options?:            Options

    constructor(
        name:                   string,
        value:                  any,
        variableType:           VariableType,
        optional:               boolean,

        options?:               Options
    ) {
        this.name               = name;
        this.value              = value;
        this.variableType       = variableType;
        this.optional           = optional;

        this.options            = options;

        // TODO add if option type is compatible with value type

        switch (this.variableType) {
            case "SqlStringMany":
            case "SqlStringOne":
            case "MongoStringMany":
            case "MongoStringOne":
            case "stringArr":
            case "string":
                
                break;
            case "SqlNumMany":
            case "SqlNumOne":
            case "MongoNumMany":
            case "MongoNumOne":
            case "intArr":
            case "int":
            case "floatArr":
            case "float":
            case "numArr":
            case "num":

                break;
            case "boolArr":
            case "bool":

                break;
            case 'fileArr':
            case "file":

                break;
            case "dateArr":
            case "date":

                break;
            case "JSON":

                break;
        }

        console.log(typeof this.options);
    }

    public check(): CheckField {
        if ((this.value === undefined || this.value === null) && this.optional) {
            return {
                field: this.name,
                error: "TYPE"
            }
        }

        switch (this.variableType) {

        }

        return null;
    }
}

export default Field;