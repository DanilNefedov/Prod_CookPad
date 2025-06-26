import { theme } from "@/config/ThemeMUI/theme";
import { Box, CircularProgress } from "@mui/material";





interface Props {
    color?: string;
    position?: string
}

export function UXLoading({ color = "secondary", position = "absolute" }: Props) {


    return (
        <Box
            sx={{
                position: position,
                top: '50%',
                left: '50%',
                transform: position === 'static' ? 'none' : 'translate(-50%, -50%)',
                zIndex: 10,
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <CircularProgress sx={{
                width: '35px !important',
                height: '35px !important',
                color: color || 'secondary',
                [theme.breakpoints.down(750)]: {
                    width: '28px !important',
                    height: '28px !important'
                }
            }}
            />
        </Box>

    )
}