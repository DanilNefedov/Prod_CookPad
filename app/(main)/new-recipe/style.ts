import { theme } from "@/config/ThemeMUI/theme";
import { alpha } from "@mui/material";
import { SxProps, Theme } from "@mui/material";





export const mainPaper = { 
    boxShadow: 'none', 
    width: '100%',           
}

export const container = {
    width: '100%', 
    maxWidth:'100%', 
    display: "flex",
    flexDirection: "column",
    height: "calc(100dvh - 45px)",
    padding: "10px 0",
    
    '&.MuiContainer-root': {
        paddingLeft: 0,
        paddingRight: 0,
    },
}

export const form = {
    '& .MuiTextField-root': {
        m: 1, 
    },
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    mt: '20px',
    width: '100%',
    maxHeight: "calc(84dvh - 45px)",
}

export const containerProgress = { 
    width: '100%', 
    mt: '10px' 
}

export const stepper = {
    '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
        borderColor: 'primary.main',
    },
    '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
        borderColor: 'primary.main',
    },
    '& .MuiStepLabel-iconContainer': {
        [theme.breakpoints.down(500)]: {
            p: '0',
            '& svg': {
                width: '19px',
                height: '19px',
            }
        }
    }
}

export const stepperText = { 
    fontSize: '12px',
    [theme.breakpoints.down(1250)]: { 
        display: 'none' 
    } 
}

export const buildLoaderBox = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: '0',
    left: '0',
    backgroundColor: 'common.black46',
    backdropFilter: 'blur(10px)',
    zIndex: 99999,
}

export const errorBox = {
    maxWidth: "270px",
    width: '100%',
    position: 'absolute',
    bottom: '20px',
    right: 'calc(50% - 135px)',
    zIndex: 99999,
    '& .MuiPaper-root':{
        alignItems:'center'
    },
    
}

export const paperForm: SxProps<Theme> = (theme) => ({  
    display: 'flex',
    backgroundColor: 'background.default',
    flexGrow: '1',
    flexDirection: 'column',
    overflowY: 'auto',
    scrollbarColor: `${theme.palette.background.paper} ${theme.palette.background.default}`,
    [theme.breakpoints.down('md')]:{
        borderRadius:'10px'
    }
})

export const saveBtn = {
    width: '150px',
    m: '0 auto',
    [theme.breakpoints.down(500)]: {
        width: "100px",
    },
}

export const containerBtns = { 
    display: 'flex', 
    justifyContent: 'space-between', 
    mt: '20px' 
}

export const pageBtns = {
    p:'6px 16px'
}

export const nextBtn = {
    ml: 'auto', 
    mr:'0',
}

export const typeDishInput = {
    "& .MuiSvgIcon-root": {
        color: "text.disabled",
    },
    '&&': {
        m: '20px 8px 0',
        [theme.breakpoints.down('md')]: {
            m: '10px 5px'
        }
    },
    '& .MuiSelect-select':{
        p:'10px 16px'
    },
    '& .MuiFormLabel-root':{
        top:'3.5px'
    },

    '& .MuiList-root':{
        p:'7px 0'
    },
    
    '& .MuiFormHelperText-root':{
        color:'text.disabled'
    }
}

export const paperMenu = {
    borderRadius:'10px',

    '& .MuiPaper-root':{
        borderRadius:'10px'
    },

    '& .MuiList-root':{
        m:'10px 0',
    },
    '& .MuiAutocomplete-option[aria-selected="true"]':{
        bgcolor: alpha(theme.palette.primary.main, 0.3),
    },
}

export const typeMenu = {
   
    '& .MuiList-root':{
        m:'7px 0',
    },
    '&.MuiMenuItem-root': {
        color: 'text.primary',
        '@media (hover: hover) and (pointer: fine)': {
            '&:hover': {
                backgroundColor: 'background.default',
            },
        },
        '&.Mui-selected': {
            backgroundColor: alpha(theme.palette.primary.main, 0.3),
            color: 'text.primary',
        },

        [theme.breakpoints.down('md')]: {
            minHeight: '40px',
            paddingTop: '4px',
            paddingBottom: '4px',
        }
    
    },
}

export const checkRecommend = {
    ml: '0',
    [theme.breakpoints.down('md')]: {
        margin: '5px 2px',
    }
}

export const checkIcon = {
    color:'text.disabled',
    transition:'0.2s',
    p:'5px',
    m:'5px',
    '@media (hover: hover) and (pointer: fine)': {
        '&:hover':{
            bgcolor: alpha(theme.palette.text.disabled, 0.3),
        },
    },
    [theme.breakpoints.down('md')]: {
        m: '2px',
        maxWidth: '20px',
        maxHeight: "20px",
        '& svg': {
            maxWidth: '20px',
            maxHeight: "20px"
        }
    }
}

export const inputStepper = {
    '&.MuiTextField-root':{
        mt:'20px',
        [theme.breakpoints.down('md')]: {
            m: '10px 5px'
        }
    },
    '& .MuiFormLabel-root':{
        top:'3.5px'
    },
    '& .MuiInputBase-root':{
        height:'43px'
    }
}

export const flexAlign = { 
    display: 'flex', 
    alignItems: 'center' 
}

export const timeBtns = {
    backgroundColor: 'background.paper',
    lineHeight: '15px',
    fontSize: '18px',
    fontWeight:'600',
    color: 'text.primary',
    minWidth: '0',
    width: '27px',
    '@media (hover: hover) and (pointer: fine)': {
        '&:hover': {
            backgroundColor: 'primary.main'
        }
    }
}

export const containerMediaStep = { 
    p: 2, 
    [theme.breakpoints.down('md')]: { 
        p: '10px' 
    } 
}

export const infoMediaStep = {
    maxWidth: '200px', 
    m: '0 auto 20px',
    [theme.breakpoints.down('md')]: {
        padding: '5px 10px',
        fontSize: '12px',
    }
}

export const errorMedia = {
    fontSize: '14px',
    textAlign: 'center',
    mt: 2,
    [theme.breakpoints.down('md')]: {
        mt: "0"
    }
}

export const helperText = {
    fontSize: 13,
    textAlign: 'center',
    mt: 2,
    [theme.breakpoints.down('md')]: {
        mt: "0"
    }
}

export const actionButtons = {
    position: 'absolute',
    backgroundColor: 'background.paper',
    top: '10px',
    '@media (hover: hover) and (pointer: fine)': {
        '&:hover': {
            backgroundColor: 'background.paper'
        },
        '&:hover .MuiSvgIcon-root': {
            color: 'primary.main'
        },
    },
    [theme.breakpoints.down(500)]: {
        width: '20px',
        height: '20px',
    }
}

export const mainBtn = {
    left: '10px'
}

export const deleteBtn = {
    right: '10px'
}

export const actionBtnIcons = {
    width: '20px',
    height: '20px',
    [theme.breakpoints.down(500)]: {
        width: '16px',
        height: '16px'
    }
}

export const swiperArrowsBox = {
    width:'30px',
    height:'30px'
}

export const ingredientStepContainer = {
    p: '20px 10px', 
    '&.MuiContainer-root': {
        paddingLeft: '10px',
        paddingRight: '10px',
    },
    [theme.breakpoints.down('md')]: {
        p:'5px'
    }
}

export const tooltipText = {
    [theme.breakpoints.down(500)]: {
        width:'25px',
        height:'25px'
    }
}

export const ingredientBox = { 
    borderRadius: '10px',
    [theme.breakpoints.down('md')]: {
        p:'0'
    },
    position:"relative",
}

export const errorIngrText = {
    position:"absolute",
    top:'-26px',
    right:'calc(50% - 84px)',
    fontSize:"14px"
}

export const headerIngredient = {
    [theme.breakpoints.down('md')]: {
        mb:'0px'
    },
}

export const ingredientContainer = {             
    display: 'flex', 
    alignItems: 'center', 
    borderColor: 'background.default', 
    width: '100%',
    mb: '10px',
    [theme.breakpoints.down('md')]: {
        mb:'5px'
    },
    [theme.breakpoints.down(600)]: {
        flexWrap:'wrap',
        justifyContent:'center'
    }
}

export const clearBtn = { 
    mb: '0', 
    minWidth: '40px', 
    ackgroundColor: 'background.default', 
    padding: '7px 18px', 
    fontWeight: '600', 
    fontSize: '12px',
    [theme.breakpoints.down('md')]: {
        width:'30px',
        height:'30px',
        p:'5px'
    } 
}

export const ingrdientLine = {
    height:'1px', 
    bgcolor:"text.disabled", 
    width:'100%', 
    display:'none', 
    [theme.breakpoints.down(600)]: {
        display:'block',
        margin: '10px 0',
    }
}

export const addNewIngr = { 
    m: '20px auto 0 ', 
    display: 'block', 
    width: '140px', 
    p:'6px 16px',
    [theme.breakpoints.down('md')]: {
        fontSize:'12px',
    } 
}

export const boxAutocompliteImg = (theme: Theme) => ({
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    backgroundColor: theme.palette.background.default,
    border: `1px solid ${theme.palette.common.border}`,
    [theme.breakpoints.down('md')]: {
        width: '38px',
        height: '38px',
    },//5.5px 4px 8.5px 5px
});

export const boxImgCloudinary = {
    width: '100%', 
    height: '100%',
    position:'relative',
    
    '& img':{
        p:'5px'
    }
}

export const mainInputAutocomplite = {
    [theme.breakpoints.down('md')]: {
        p:'5.5px 4px 8.5px 5px'
    }
}

export const autocompliteImg = {
    width: '100%', 
    height: '100%', 
    padding: '7px', 
    [theme.breakpoints.down('md')]: {
        p: '5px'
    }
}

// export const secondTextInput = {
//     '& .MuiInputBase-root': {
//         backgroundColor: 'background.default',
//         color: 'text.primary',
//         paddingTop:'0',
//         paddingBottom:'0',
//         '&.Mui-focused': {
//             backgroundColor: 'background.default',
//             color: 'text.primary',
//             '& fieldset': {
//                 borderColor: 'text.primary',
//             },
//         },
//     },
//     '& .MuiInputLabel-root': {
//         color: 'text.primary',
//         '&.Mui-focused': {
//             color: 'text.primary',
//         },
//     },
//     '& .MuiOutlinedInput-root': {
        
//         '& fieldset': {
//             borderColor: 'background.paper',
//         },

//     },
//     '& .MuiInputBase-input':{
//         padding:'5px 15px',
//         height:'none',
//     }
// }


export const autoCompliteItems = {
    flexGrow: '1',

    '& .MuiInputBase-root': {
        color: 'text.primary',
        paddingTop:'0',
        paddingBottom:'0',

        '&.Mui-focused': {
            color: 'text.primary',
        },
    },
    '& .MuiInputBase-input': {
        p: '6px 10px 6px',
    },
    '& .MuiTextField-root': {
        m: '0',
    },
    '&&': {
        m: '4px',
    },
    '& .MuiButtonBase-root': {
        color: 'text.primary',
    },
    
    [theme.breakpoints.down(600)]: {
        width: '80%'
    }
}

export const autocompliteMenuItem = {
    color: 'text.primary', 

    '&.MuiListItem-root.MuiListItem-gutters': {
        minHeight: '38px',

        '@media (hover: hover) and (pointer: fine)': {
            '&:hover': { 
                backgroundColor: 'background.default' 
            },
        },

        [theme.breakpoints.down('md')]: {
            minHeight: '33px'
        },
    }
}

export const autocompMenuBox = {
    display:'flex', 
    width:'100%'
}

export const autocompMenuContainer = {
    flexGrow: 1,
    width: 'calc(100% - 44px)',
}

export const autocompMenuText = {
    '&.MuiMenuItem-root': {
        color: 'text.primary',
        '@media (hover: hover) and (pointer: fine)': {
            ':hover': {
                backgroundColor: 'background.default',
            },
        },
        '&.Mui-selected': {
            backgroundColor: 'background.default',
            color: 'text.primary',
        },
    },
}


export const amoutIngredient = {
    '& .MuiInputBase-input': {
        p: '7.5px 12px 7.5px',
    },
    '& .MuiInputLabel-root': {
        top: '-10px',
        '&.Mui-focused': {
            color: 'text.primary',
        },
    },
    '& .MuiTextField-root': {
        m: '0',
    },
    '&&': {
        m: '4px',
        [theme.breakpoints.down(600)]: {
            ml: '0',

        }
    },
    '& .MuiButtonBase-root': {
        color: 'text.primary',
    },
    width: '17%',
    [theme.breakpoints.down(600)]: {
        width: '38.5%',

    }
}

export const weightItemList = { 
    flexGrow:0, 
    width:'17%', 
    [theme.breakpoints.down(600)]: {
        width: '38.5%',          
    }
}

export const textAreaStepper = {
    '& .MuiInputBase-input':{
        p:'0'
    },
    '& .MuiFormLabel-root[data-shrink=true]':{
        transform:'translate(14px, -13px) scale(0.75);'
    },
    '& .MuiOutlinedInput-root': {
        mb: '0px',
        p:'10px 14px'
    },
    '& .MuiInputLabel-root': {
        top: '5px',
    },
    '& .MuiFormHelperText-root':{
        color:'text.disabled'
    }
}

