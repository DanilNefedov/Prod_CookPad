
export interface TimeValue {
    hours: number | null;
    minutes: number | null;
}

export interface TimeInputState {
    displayHours: string;
    displayMinutes: string;
}

export interface UseTimeInputReturn {
    displayHours: string;
    displayMinutes: string;
    value: TimeValue;
    handleHoursChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleMinutesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleHoursBlur: () => void;
    handleMinutesBlur: () => void;
}

export interface UseTimeInputOptions {
    initialValue?: Partial<TimeValue>;
}