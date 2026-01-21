// *S - start
// *E - end



//---------------- state S---------------//
export interface Message {
    message: string | { message: string };
}


export type OperationStatus = {
    loading: boolean;
    error: boolean;
    message?: string
};

// defaultStatus
export function createOperationStatus(loading = true, error = false, message?: string): OperationStatus {
    // const normalizedMessage: Message | undefined = typeof message === 'string' ? { message } : message;

    return { loading, error, message: message };
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



export interface LoadingContainer {
    position: string,
    right: string,
    mobileText: string
}

export enum ErrorCode {
    NOT_FOUND = 'NOT_FOUND',
    DELETED = 'DELETED',
    SERVER_ERROR = 'SERVER_ERROR',
    INVALID_INPUT = 'INVALID_INPUT'
}

export interface ErrorResponse {
    code: ErrorCode;
    message: string;
    resource?: 'save'; //| 'user' | 'list';
}