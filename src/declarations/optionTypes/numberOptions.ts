/**
 * @description Options which can be used with number field check
 * @param min {number} Minimal allowed number
 * @param max {number} Maximum allowed number
 * @param round {number} Count of numbers after decimal point
 */

declare type NumberOptions = {
    // Minimal allowed number
    min?: number;
    // Maximum allowed number
    max?: number;
    // Count of numbers after decimal point
    round?: number;
};

declare type NumberOptionsErrors = "";