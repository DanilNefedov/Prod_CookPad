import { theme } from "@/config/ThemeMUI/theme";
import { Box, Button, Typography } from "@mui/material";
import ReplayIcon from '@mui/icons-material/Replay';
import { containerErrorInfo, refreshErrorBtn } from "./style";




export function ErrorPageContent({ reset }: { reset: () => void }) {



    return (
        <Box sx={containerErrorInfo}>
            <Typography
                component="h1"
                sx={{
                    textAlign: 'center',
                    fontSize: "25px",
                    [theme.breakpoints.down("md")]: {
                        fontSize: '18px'
                    }
                }}>
                Oops! Something went wrong.
            </Typography>
            <Typography sx={{
                textAlign: "center",
                fontSize: '18px',
                p: '10px 0',
                [theme.breakpoints.down("md")]: {
                    fontSize: '16px',
                    p: '7px 0',
                }
            }}>
                Please try refreshing the page or come back later.
            </Typography>
            <Button onClick={reset}
                sx={refreshErrorBtn}
            >
                <span>Refresh</span><ReplayIcon sx={{ width: "16px", height: '16px', ml: '7px' }}></ReplayIcon>
            </Button>
        </Box>
    )
}