// *S - start
// *E - end



//---------------- state S---------------//

export type OperationStatus = {
    loading: boolean;
    error: boolean;
};

// defaultStatus
export function createOperationStatus(
    loading = true,
    error = false
): OperationStatus {
    return { loading, error };
}

export type OperationState<T extends string> = Record<T, OperationStatus>;

export function createOperations<T extends string>(
    keys: T[],
    statusFactory: (key: T) => OperationStatus = () => createOperationStatus()
): OperationState<T> {
    return keys.reduce((acc, key) => {
        acc[key] = statusFactory(key);
        return acc;
    }, {} as OperationState<T>);
}

//---------------- state E---------------//

