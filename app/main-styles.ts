import { theme } from "@/config/ThemeMUI/theme";

export interface PageStyles {
    name: string
    path: string[]
    icon:React.ReactNode
}



export const btnMain = {
    textTransform: 'initial',
    color:'text.primary' ,
    backgroundColor: 'background.paper',
    '&:hover': {
        color: '#fff',
        opacity:1,
        backgroundColor: 'primary.dark'
    },
    mb: '20px',
    lineHeight: 'inherit',
}




export const paperNavigation = {
    backgroundColor: 'background.default',
    flexGrow: 0,
    borderRadius: '0',
    width: '100%',
    maxWidth: '140px',
}


export const inputText = {
    '& .MuiInputBase-root': {
        backgroundColor: '#1F2128',
        color: '#fff',
        '&.Mui-focused': {
            
            backgroundColor: '#1F2128',
            color: '#fff',
            '& fieldset': {
                borderColor: '#fff',
            },
        },
    },
    '& .MuiInputLabel-root': {
        [theme.breakpoints.down('md')]: {
            fontSize:'14px',
            lineHeight:'12px',
        },
        '&.Mui-focused': {
            color: '#fff',
        },
    },
    '& .MuiOutlinedInput-root': {
        
        '& fieldset': {
            borderColor: '#353842',
        },

    },
    '& .MuiInputBase-input':{
        [theme.breakpoints.down('md')]: {
            p:"10px",
            fontSize:'14px',
            height:'auto'
        },
    }
}


export const btnIncDec = {
    backgroundColor: 'background.paper',
    lineHeight: '15px',
    fontSize: '20px',
    color: 'text.primary',
    minWidth: '0',
    width: '27px',
    '&:hover': {
        backgroundColor: 'primary.main'
    }
}

export const secondTextInput = {
    '& .MuiInputBase-root': {
        backgroundColor: '#1F2128',
        color: '#fff',
        paddingTop:'0',
        paddingBottom:'0',
        '&.Mui-focused': {
            backgroundColor: '#1F2128',
            color: '#fff',
            '& fieldset': {
                borderColor: '#fff',
            },
        },
    },
    '& .MuiInputLabel-root': {
        color: '#fff',
        '&.Mui-focused': {
            color: '#fff',
        },
    },
    '& .MuiOutlinedInput-root': {
        
        '& fieldset': {
            borderColor: '#353842',
        },

    },
    '& .MuiInputBase-input':{
        padding:'5px 15px',
        height:'none',
    }
}