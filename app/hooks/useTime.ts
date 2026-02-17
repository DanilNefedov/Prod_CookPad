import { useState, useCallback, useEffect } from "react";
import { TimeInputState, TimeValue, UseTimeInputOptions, UseTimeInputReturn } from "./types";









function stripLeadingZero(val: string): string {
    // Remove leading zeros but keep a single "0"
    const stripped = val.replace(/^0+/, "");
    return stripped === "" ? "" : stripped;
}

export function useTimeInput( options?: UseTimeInputOptions): UseTimeInputReturn {
    const { initialValue } = options ?? {};

    const initHours = String(initialValue?.hours ?? 0);
    const initMinutes = String(initialValue?.minutes ?? 0);

    const [state, setState] = useState<TimeInputState>({
        displayHours: initHours,
        displayMinutes: initMinutes,
    });

    useEffect(() => {
        const newHours = String(initialValue?.hours ?? 0);
        const newMinutes = String(initialValue?.minutes ?? 0);

        setState({
            displayHours: newHours,
            displayMinutes: newMinutes,
        });
    }, [initialValue?.hours, initialValue?.minutes]);

    const getTimeValue = useCallback((dh: string, dm: string): TimeValue => ({
            hours: dh === "" ? null : Number(dh),
            minutes: dm === "" ? null : Number(dm),
        }),
    []);

    const handleHoursChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;

        if (!/^\d*$/.test(raw)) return;

        // Remove leading zeros while typing (e.g. "04" → "4")
        const cleaned = stripLeadingZero(raw);

        if (cleaned !== "" && Number(cleaned) > 99) return;

        setState((prev) => ({ ...prev, displayHours: cleaned === '' ? '0' : cleaned, }));

    },[state.displayMinutes, getTimeValue]);

    const handleMinutesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;

        if (!/^\d*$/.test(raw)) return;

        // Remove leading zeros while typing (e.g. "04" → "4")
        const cleaned = stripLeadingZero(raw);

        if (cleaned !== "" && Number(cleaned) > 59) return;

        setState((prev) => ({ ...prev, displayMinutes: cleaned === '' ? '0' : cleaned,  }));

    },[state.displayHours, getTimeValue]);

    // On blur: if field is empty — show error, reset display to "0"
    const handleHoursBlur = useCallback(() => {
        if (state.displayHours === "") {
            setState((prev) => ({ ...prev, displayHours: "0",})); 
        }
    }, [state.displayHours, state.displayMinutes, getTimeValue]);

    const handleMinutesBlur = useCallback(() => {
        if (state.displayMinutes === "") {
            setState((prev) => ({ ...prev, displayMinutes: "0", }));
        }
    }, [state.displayHours, state.displayMinutes, getTimeValue]);

    return {
        displayHours: state.displayHours,
        displayMinutes: state.displayMinutes,
        value: getTimeValue(state.displayHours, state.displayMinutes),
        handleHoursChange,
        handleMinutesChange,
        handleHoursBlur,
        handleMinutesBlur,
    };
}