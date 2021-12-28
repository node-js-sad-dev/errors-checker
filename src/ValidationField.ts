type VariableType = "string" | "number" | "boolean" | "object";

class ValidationField {
    name:               string;
    value:              any;
    variableType:       VariableType;
    optional:           boolean;
    writeToVariable?:   string;
    allowedValues?:     any[];
    objectProperties?:  string[];

    constructor(
        name:               string,
        value:              any,
        variableType:       VariableType,
        optional:           boolean,
        writeToVariable?:   string,
        allowedValues?:     any[],
        objectProperties?:  string[]
    ) {
        this.name               = name;
        this.value              = value;
        this.variableType       = variableType;
        this.optional           = optional;
        this.writeToVariable    = writeToVariable;
        this.allowedValues      = allowedValues;

        if (this.variableType !== 'object' && objectProperties !== undefined) throw new Error("property objectProperties only allowed with variableType === object");

        this.objectProperties = objectProperties;
    }
}

export default ValidationField;