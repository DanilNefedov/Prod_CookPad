import { theme } from "@/config/ThemeMUI/theme";
import { Alert } from "@mui/material";

interface DataProps {
    handleClose?: () => void
    loading?:boolean
    error?:boolean
}


export function StatusAlert(props:DataProps) {
    const {
        error = false, 
        handleClose = () => {}, 
        loading = false
    } = props
    

    return (
        <Alert
            onClose={handleClose}
            sx={{
                alignItems: 'center',
                position: 'absolute',
                top: '25px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 200,
                maxWidth: '380px',
                width: 'fit-content',
                bgcolor: loading ? "#0288D1" : error ? '#bd3030' : '#388E3C',
                color: 'text.primary',
                '& .MuiSvgIcon-root': {
                    fill: '#fff'
                },
                '& .MuiAlert-action': {
                    mr: '0',
                    p: '0 0 0 12px'
                },
                [theme.breakpoints.down('sm')]: {
                    maxWidth: '70dvw',
                    width: '100%',
                }

            }}
            severity={loading ? "info" : error ? 'error' : 'success'}>

            {loading ? "Loading..." : error ? 'Something happened during the recording' : 'Success!'}
        </Alert>
    )
}