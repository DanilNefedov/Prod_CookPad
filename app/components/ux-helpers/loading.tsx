import { Box, CircularProgress } from "@mui/material";





interface DataProps {
    color?: string; 
    position?:string
}

export function UXLoading({color="secondary", position="absolute"}:DataProps) {
    // const {color} = props


    return (
        <Box
            sx={{
                position: position,
                top: '50%',
                left: '50%',
                transform: position === 'static' ? 'none': 'translate(-50%, -50%)',
                zIndex: 10,
                display:'flex',
                justifyContent:'center',
            }}
        >
            <CircularProgress  size="35px" sx={{
                color:color || 'secondary'
            }}
            />
        </Box>

    )
}