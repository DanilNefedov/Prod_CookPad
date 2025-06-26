import { theme } from "@/config/ThemeMUI/theme";
import { Typography } from "@mui/material";



interface Props {
    position?: string
    mobileText?: string
    right?: string
}

export function EmptyInfo({ position = 'absolute', mobileText = 'initial', right = 'calc(50% - 86px)' }: Props) {

    return (
        <Typography
            sx={{
                position: position,
                top: 'calc(50% - 12px)',
                right: right,
                zIndex: '10',
                [theme.breakpoints.down('md')]: {
                    fontSize: mobileText
                }
            }}
        >
            There`s nothing here yet
        </Typography>
    )
}