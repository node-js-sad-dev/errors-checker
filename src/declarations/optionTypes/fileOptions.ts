/**
 * @description Options which can be used with file field check
 * @param allowedExtensions {string[]} Allowed file extensions
 * @param minimumSize {number} Minimum file size
 * @param maximumSize {number} Maximum file size
 */

declare type FileOptions = {
    // Allowed file extensions
    allowedExtensions?: string[],
    // Minimum file size
    minimumSize?: number,
    // Maximum file size
    maximumSize?: number
}

declare type FileOptionsErrors = "";