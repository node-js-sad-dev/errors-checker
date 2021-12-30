/**
 * @description Options which can be used with string field check
 * @param minLength {number} Minimum allowed string length
 * @param maxLength {number} Maximum allowed string length
 * @param hasUpperCase {boolean} Has string upper case letters or not
 * @param hasLowerCase {boolean} Has string lower case letters or not
 */

declare type StringOptions = {
    // Minimum allowed string length
    minLength?: number;
    // Maximum allowed string length
    maxLength?: number;
    // Has string upper case letters or not
    hasUpperCase?: boolean;
    // Has string lower case letters or not
    hasLowerCase?: boolean;
}

declare type StringOptionsErrors = "";