import { Typography } from "@mui/material";
import { emptyInfo } from "./style";



interface Props {
    position?: string
    mobileText?: string
    right?: string
}

export function EmptyInfo({ position = 'absolute', mobileText = 'initial', right = 'calc(50% - 86px)' }: Props) {

    return (
        <Typography
            sx={emptyInfo({position, right, mobileText})}
        >
            There`s nothing here yet
        </Typography>
    )
}