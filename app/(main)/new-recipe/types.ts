export interface DataType {
    id: string,
    idRecipe: string,
    media_id: string,
    media_url: string,
}


export type SaveFormResult = {
    error?: unknown;
    message?: string | null;
} | null;
