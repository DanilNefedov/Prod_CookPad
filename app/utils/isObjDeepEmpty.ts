





//empty lines are considered empty
//0 is considered a value


export function isObjDeepEmpty(value: unknown): boolean {
    if (value == null) return true;

    if (typeof value === 'string') {
        return value.trim() === '';
    }

    if (typeof value !== 'object') return false;

    if (Array.isArray(value)) {
        return value.length === 0 || value.every(isObjDeepEmpty);
    }

    const keys = Object.keys(value);
    return keys.length === 0 || keys.every(key => isObjDeepEmpty((value as Record<string, unknown>)[key]));
}
