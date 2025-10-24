import { RootState } from "@/state/store";
import { GlobalStatusNotifierItem } from "./StatusAlertItem";









export type OperationConfig<K extends string = string> = {
    sliceSelector: (state: RootState) => Record<K, { error: boolean; loading: boolean; message:string | undefined }>;
    successMessages: Partial<Record<K, string>>;
    errorMessages: Partial<Record<K, string>>;
    loadingMessages: Partial<Record<K, string>>;
    closeErrorAction: (key: string) => void;
};


type GlobalStatusNotifierProps = {
    operationConfigs: OperationConfig[];
};

export function GlobalStatusNotifier({ operationConfigs }: GlobalStatusNotifierProps) {
    return (
        <>
            {operationConfigs.map((config, idx) => (
                <GlobalStatusNotifierItem key={idx} config={config} />
            ))}
        </>
    );
}
