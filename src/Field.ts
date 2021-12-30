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

        // TODO add if option type is compatible with value type

        this.options            = options;
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