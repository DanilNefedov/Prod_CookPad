import { Box, Button, Typography } from "@mui/material";
import ReplayIcon from '@mui/icons-material/Replay';
import { containerErrorInfo, errorPageHeader, errorPageIconRefresh, errorPageSubtitle, refreshErrorBtn } from "./styles";




export function ErrorPageContent({ reset }: { reset: () => void }) {



    return (
        <Box sx={containerErrorInfo}>
            <Typography
                component="h1"
                sx={errorPageHeader}>
                Oops! Something went wrong.
            </Typography>
            <Typography sx={errorPageSubtitle}>
                Please try refreshing the page or come back later.
            </Typography>
            <Button onClick={reset}
                sx={refreshErrorBtn}
            >
                <span>Refresh</span><ReplayIcon sx={errorPageIconRefresh}></ReplayIcon>
            </Button>
        </Box>
    )
}