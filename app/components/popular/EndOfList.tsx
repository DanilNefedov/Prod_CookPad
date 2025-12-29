import { infoAlert } from "@/app/(main)/popular/styles";
import { Alert } from "@mui/material";




export function EndOfList() {


    return (
        <Alert variant="filled" severity="info" sx={infoAlert}>
            Wow, you've seen everything.
        </Alert>
    )
}