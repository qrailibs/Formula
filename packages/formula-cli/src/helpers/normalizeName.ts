/**
 * Normalize name
 * @param name
 * @returns name with '.', '-' replaced to _, prefixed if starts with number
 */
export function normalizeName(name: string): string {
    let formattedName = name.replaceAll(/\.\-\/\\\#\(\)\[\]\{\}\@\!\?\$\%\^\&\*\+\,/g, "_");
    if (/[0-9]/.test(formattedName.substring(0, 1))) {
        formattedName = "_" + formattedName;
    }

    return formattedName;
}
