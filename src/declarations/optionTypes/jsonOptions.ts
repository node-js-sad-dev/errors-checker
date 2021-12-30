/**
 * @description Allowed format of JsonOption object property "allowedProps"
 * @param name          {string}        name of object property
 * @param optional      {boolean}       optional property or not
 */

declare type JsonAllowedPropsObj = {
    // name of object property
    name: string,
    // optional property or not
    optional: boolean
}

/**
 * @description Options which can be used with JSON field check
 * @param allowedProps {JsonAllowedPropsObj[]} Set of allowed properties
 */

declare type JsonOptions = {
    // Set of allowed properties
    allowedProps: JsonAllowedPropsObj[]
}

declare type JsonOptionsErrors = "";