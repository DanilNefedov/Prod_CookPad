import { theme } from "@/config/ThemeMUI/theme"
import { SxProps, Theme } from "@mui/material"




export const contanierLinks = {
    backgroundColor: 'background.default',
    m: '10px 0',
    flexDirection: 'inherit',
    borderRadius: '10px',
    p: '10px 0',
    gap: '20px',
    boxShadow: 'none',
    position:"static"
}

export const headerLink = { 
    minWidth:'100px',
    [theme.breakpoints.down(1050)]:{
        fontSize:'14px',
        minWidth:'70px'
    },
    [theme.breakpoints.down('md')]:{
        p:'6px 14px',
        maxHeight:'31px'
    }
}

export const mainBox = { 
    height: 'calc(100dvh - 85px)', 
    position: 'relative' 
}

export const tableContainer = { 
    height: '100%',
    '&:firstChild': {
        m: '0 0 15px 0'
    },
    '&:lastChild': {
        mb: '0'
    },
    borderRadius:'10px',
    backgroundColor: "background.paper", 
    boxShadow: 'none', 
    overflow:'hidden' 
}

export const tableHeader = {
    '& .MuiTableCell-root .head': {
        borderBottom: '0',
    },
}

export const cellHeader = {
    '& .MuiTableCell-root': {
        color: 'text.disabled',
        p:'10px 14px',

        '&:last-child': {
            borderRight: '0'
        }
    },
}

export const headerText = {
    alignText:'center',
    fontSize:'16px',
    cursor: 'pointer',

    [theme.breakpoints.down('md')]: { 
        '&.MuiTableCell-root':{
            p:'10px 14px 5px',
        },
    }, 
    [theme.breakpoints.down(500)]: { 
        '&.MuiTableCell-root':{
            p:'10px 5px 5px 10px',
        },
    }, 
}


export const boxText = { 
    borderBottom: '0', 
    pr: '10px' 
}

export const headerArrow = { 
    width: '18px', 
    transition: "transform 0.3s ease", 
    [theme.breakpoints.down('md')]:{
        width: '16px', 
    }
}

export const sortBtnHeader = {
    borderBottom: '0'
}

export const ingredientRow = {
    backgroundColor: 'background.default',
    borderRadius: '15px',
    height:'60px',
    '&:last-child .MuiTableCell-root': {
        borderBottom: '0'
    }
}

export const ingredientImageBox = { 
    width: '73px', 
    [theme.breakpoints.down(1050)]: { 
        '&.MuiTableCell-root':{
            p:'2px',
        },
        width: '30px',
    }, 
}

export const adaptiveIngredientImageBox = {
    [theme.breakpoints.down(800)]: { 
        maxWidth:'70px',
        width: '70px',
        minWidth: '70px',
    }
}

export const ingredientImage = {
    maxHeight: '45px',
    maxWidth:'45px',
    width:'100%',
    height:'100%',
    [theme.breakpoints.down('md')]: {
        width:'35px',
        height:'35px'
    } 
}

export const ingredientNameBox = {
    maxWidth: '150px',
    width: '150px',
    [theme.breakpoints.down(1050)]: {
        maxWidth: '100px',
        width: '100px',
    },                
}

export const nameIngredient = {
    maxWidth: '150px',

    [theme.breakpoints.down(1050)]: {
        maxWidth:'100px',

        '& span':{
            fontSize:'14px'
        }
    },
}

export const mobileUnitInfoBox = {
    display: "flex", 
    alignItems: "center", 
    justifyContent: 'end' 
}

export const mobileUnitText = {
    // fontSize: '14px',
    color: 'text.disabled',
    pr: '5px',
    maxWidth: '65px'
}

export const mobileUnitIcon = {
    transition: "transform 0.3s ease",
    color: 'text.disabled'
}

export const unitBox = {
    position: 'relative', 
   
    '& .swiper-list-unit': {
        position: 'static',
        m: '0',
        ml: '7px',
        mr: '7px'
    },
}

export const unitBoxDesktop = {
    maxWidth:"0px", /*     DO NOT CHANGE!     */
    width: '100%',
}

export const mobileUnitRow = {
    backgroundColor: 'background.default',
    borderRadius: '15px',
    p: "0",
    transition: 'height 300ms ease,',

    '&:last-child .MuiTableCell-root': {
        borderBottom: '0'
    },
}

export const mobileUnitCell = {
    p: "0 !important", 
    border: 'none',
    minWidth: 0, 
    // width: '100%',
}

export const mobileUnitBoxSwiper = {
    position: 'relative', 
    overflow: 'hidden',
    transition: 'max-height 300ms ease',

    '& .slide-list-unit': { 
        // maxWidth: '100%',
        width:'auto'
    }, 
    '& .swiper-list-unit': {
        position: 'static',
        margin: '0 auto 15px',
        width: 'calc(100dvw - 120px)',
    },
}

export const mainButtonsCell = {
    [theme.breakpoints.down(1150)]: { 
        padding: "7px 10px" 
    },
    [theme.breakpoints.down(1050)]: { 
        width: "30px" 
    }
}

export const modileMenuMainBtnsItem = {
    width:'100%', 
    maxWidth:'100%',
    pl:'10px',
    pr:'10px',
}

export const mobileMenuMainBtns = {
    color: 'text.disabled', 
    maxWidth: '24px', 
    width: '24px', 
    height: '24px', 
    padding: '0' 
}

export const iconMenuMainBtns = {
    width:'100%',
    height:'100%'
}

export const btnsListUnitHover = {
    maxWidth:'40px',
    minWidth:'0',
    minHeight:'40px',
    borderRadius:'50%',
    // p:'8px',
    '& .MuiSvgIcon-root':{
    },
    // '@media (hover: hover) and (pointer: fine)': {
    //     '&:hover': {
    //         backgroundColor: 'primary.main',

    //         '& .MuiSvgIcon-root': {
    //             color: 'background.paper'
    //         }
    //     },
    // },
    [theme.breakpoints.down(1150)]: {
        maxWidth:'100%',
        alignItems:'center',
        borderRadius:'10px',
        

        '& span':{
            lineHeight:'19px',
        },
    },
    // [theme.breakpoints.down(1050)]: {
    //     width:'100%',
    //     maxWidth:'none',
    //     textAligh:'center',
    // }
    //     '& span':{
    //         lineHeight:'initial',
        // },
        // '@media (hover: hover) and (pointer: fine)': {
        //     '&:hover': {
        //         backgroundColor: 'background.default',

        //         '& .MuiSvgIcon-root': {
        //             color: 'primary.main'
        //         }
        //     },
        // }
    // }
}

export const styleBtnsAdaptiveMenu = {
    backgroundColor:'background.default', 
    p:'5px 10px',
    width:'100%',
    justifyContent:'start',
    
    '& svg':{
        width:'20px'
    }, 

    "& span":{
        textTransform:'none',
        ml:'7px'
    }
}

export const mainButtonsBox = {
    display: "flex", 
    justifyContent: "space-between", 
    maxWidth:'130px', 
    width:'100%', 
    minWidth:'0',
    gap:'5px'
}

export const modalContainer = {
    backgroundColor: 'background.paper',
    maxWidth: '40%',
    top: '50%',
    left: '50%',
    position: 'relative',
    transform: "translate(-50%, -50%)",
    padding: '10px',
    borderRadius: '20px',
    [theme.breakpoints.down('md')]: {
        maxWidth:'300px',
    }
}

export const modalTextNewUnit = {
    textAlign: 'center', 
    fontSize:'18px',
}

export const modalInputContainer = {
    p: '20px 0', 
    // '& .MuiFormControl-root .MuiInputBase-root .MuiInputBase-input': {
    //     p: '10px',
    //     [theme.breakpoints.down('md')]: {
    //         // fontSize: '14px',
    //         p: '7px 10px'
    //     }
    // },
    [theme.breakpoints.down('md')]: {
        flexDirection: "column",
        alignItems: 'center',
        p: '15px 0'
    }
}

export const modalInputButtonsBox = {
    display: 'flex', 
    height:'100%',
    gap:'5px',
    [theme.breakpoints.down('md')]: {
        width: '100%',
        justifyContent: 'space-around',
        gap: '25px'
    }
}

export const modalInputButton = {
    borderRadius:'50%', 
    maxHeight:'38px', 
    maxWidth:'38px',
    transition:'all 0.2s',

    '@media (hover: hover) and (pointer: fine)': {
        '&:hover':{
            '& .MuiSvgIcon-root':{
                color:'text.primary'
            }
        }
    }
    
}

export const unitsContainer = {
    display: "flex",
    flexWrap: 'wrap',
    padding: '4px 10px',
    borderRadius: '10px',
    gap:'5px',
    m: '0 5px',
    alignItems: 'center',
    flexShrink: '0',
    maxWidth: '420px',
    position: 'relative',
    '&:first-child':{
        ml:'0'
    },
    '&:last-child':{
        mr:'0'
    },
    [theme.breakpoints.down(1150)]: {
        gap:'3px',
        width:'fit-content'
    }
}

export const unitButtonsBox = {
    display:'flex',
    gap:'3px'
}

export const inputUnitList = {
    maxWidth: '140px',
    m: '0',
    maxHeight: '34px',
    p: '0',
    mr: '5px',
    '& .MuiInputBase-input': {
        p: '5px 5px 5px 7px',
    },
    [theme.breakpoints.down(1050)]: {
        '& span':{
            fontSize:'14px'
        }
    },
    [theme.breakpoints.down(460)]: {
        maxWidth:'100px'
    }
}

export const unitAmountText = {
    // paddingRight: '4px', 

    [theme.breakpoints.down(1050)]: { 
        '& span':{fontSize:'14px'}
    } 
}

export const unitChoiceText = { 
    mr: '10px', 
    flex:'none', 
    [theme.breakpoints.down(1050)]: { 
        '& span':{fontSize:'14px'

        }
    }
}

export const unitButton = {
    width:'34px',
    height:'34px',
    borderRadius:'50%',
    p:'5px',
    bgcolor:'transparent',
    transition:'all .2s',

    '@media (hover: hover) and (pointer: fine)': {
        '&:hover':{
            bgcolor:'primary.dark',

            '& .MuiSvgIcon-root':{
                color:'text.primary'
            }
        }
    },
    [theme.breakpoints.down(1150)]: {
        width:'25px',
        height:'25px',

        '& svg': {
            width:'22px',
            height:'22px'
        }
    }
}

export const unitMenuItem = {
    pl:'10px',
    pr:'10px',
    minHeight:'0'
}

export const unitButton2 = {
    position:'absolute',
    top:'calc(50% - 10px)',
    right:'10px',
    width:'20px',
    height:'20px',
    borderRadius:'50%',
    p:'5px',
    bgcolor:'transparent',
    transition:'all .2s',

    '@media (hover: hover) and (pointer: fine)': {
        '&:hover':{
            bgcolor:'primary.dark',

            '& .MuiSvgIcon-root':{
                color:'text.primary'
            }
        }
    },
    [theme.breakpoints.down(1150)]: {
        width:'20px',
        height:'20px',
    }
}

export const menuCalc = {
    '& .MuiPaper-root': {
        maxWidth: '300px',
        backgroundColor: 'supportBackground.dark',

        [theme.breakpoints.down('md')]: {
            maxWidth: '250px',
        }
    },
    '& .MuiButtonBase-root': {
        m: '0',
    },
    '& .MuiList-root': {
        p: '0'
    },
    '& .MuiTouchRipple-root': {
        display: 'none'
    },
}

export const alertCalcBox = {
    p: "0", 
    [theme.breakpoints.down(600)]: {
        minHeight: 'auto'
    }
}

export const alertCalc = {
    pb: '0',
    alignItems: "center",
    '& .MuiAlert-icon, & .MuiAlert-message': { 
        p: '0', 
        color: 'primary.main' 
    },
    [theme.breakpoints.down('md')]: {
        fontSize: "14px",
    },
}

export const calcIntupBox = { 
    width: '100%', 
    position: 'relative', 
    display: 'flex', 
    alignItems: 'center' 
}

export const calcInput = (theme: Theme): SxProps<Theme> => ({
    width: '100%',
    opacity: '1',
    flex:1,
    '& .MuiInputBase-root.Mui-disabled': {
        opacity: '1',
    },

    '& .MuiInputBase-input': {
        opacity: '1',
        // WebkitTextFillColor: theme.palette.text.primary,
        maxWidth: '210px',

        // [theme.breakpoints.down('md')]: {
        //     fontSize: '14px',
        // },
    },

    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: `${theme.palette.background.paper} !important`,
    },

    [theme.breakpoints.down('md')]: {
        '& .MuiInputBase-root': {
            p: '9.5px 15px',
        },
    },
});

export const calcInputIcon = {
    p: "4px",
    backgroundColor: 'primary.dark',
    borderRadius: "50%",
    position: 'absolute',
    right: '20px',
    width: '30px',
    height: '30px',
    bottom: 'calc(50% - 15px)',
    color: 'text.primary',
    cursor: 'pointer',
    transition:'all .2s',

    '@media (hover: hover) and (pointer: fine)': {
        '&:hover': {
            backgroundColor: 'primary.main',
        },
    },

    [theme.breakpoints.down('md')]: {
        width: '25px',
        height: '25px',
        bottom: 'calc(50% - 12px)',
        // p: '4px'
    }
}

export const containerCalcBtns = {
    gap: 1,
    '& .MuiGrid-item': {
        width: '25%',
        m: '7px 0',
        '& button': {
            fontWeight: '900'
        }
    }
}

export const btnCleanInput = {
    width:'64px',
    backgroundColor: 'primary.dark', 
    [theme.breakpoints.down('md')]: {
        width:'50px',
        minWidth: '50px'
    }
}

export const btnCleanInputIcon = { 
    width: "16px", 
    [theme.breakpoints.down('md')]: {
        mr: '2px' 
    } 
}

export const containerCalcGrid = {
    backgroundColor: 'supportBackground.dark',
    borderRadius: '20px',
    width: '100%',
    cursor: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    alignItems: 'center',
    p: '10px',

    '&>.MuiGrid-item': {
        p: '0'
    },   
}

export const mobileContainerMenuMainBtns = {
    '& .MuiPaper-root':{
        borderRadius:'10px',
    },
    '& .MuiList-root':{
        p:'6px 0'
    }
}
























export const blockList = {
    height: '100%',
    // overflow: 'auto',
    '&:firstChild': {
        m: '0 0 15px 0'
    },
    '&:lastChild': {
        mb: '0'
    },
    borderRadius:'10px'
    // m: '10px 0 0 0',

}


export const mainIngrList = {
    // maxHeight: '75px',
    backgroundColor: 'background.default',
    borderRadius: '15px',
    // m: '15px 0 ',
    // '&:first-child': {
    //     borderSpacing: "0",
    // },
    // '&:last-child': {
    //     borderSpacing: "0",
    // },
    // borderCollapse: "separate",
    // borderSpacing: "0 10px", 
    // '& .MuiTableCell-root': {
    //     borderBottom: '5px solid #353842',
    // },
    '&:last-child .MuiTableCell-root': {
        borderBottom: '0'
    }
}

export const imgIngrList = {
    maxHeight: '45px',
    width:'100%',
    height:'100%',
    [theme.breakpoints.down(1050)]: {width:'30px'} 
}



export const unitBtnsImg = {
    p: '5px',
    width: '30px',
    height: '30px',
    m: '0 5px',

    '& .MuiSvgIcon-root': {
        width: "100%",
        height: '100%',
    },
    [theme.breakpoints.down(1050)]: {
        p: '3px',
        width: '25px',
        height: '25px',
        m:'0 3px'
    }
}








export const scrollUnitsList = {
    display: 'flex',
    maxWidth: '1160px',
    p: '0 0 5px 0'
}


export const boughtBlock = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(50, 50, 50, 0.5)',
    backdropFilter: 'blur(1px)',
    borderRadius: '10px',
    // padding: '20px', 
    width: '100%',
    height: '100%',
    color: '#fff',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

}



export const amountNewUnit = {
    '& .MuiInputBase-root .MuiOutlinedInput-input': {
        p: '10px 10px 10px 14px',
    },
}


export const btnsModal = {
    padding: '3px 10px',
    borderRadius: '50%',
    minWidth: 'initial',
    margin: '0 5px',
    backgroundColor:'background.default',
    '@media (hover: hover) and (pointer: fine)': {
        '&:hover': {
            backgroundColor: 'primary.main'
        }, 
        '&:hover svg': {
            color: '#fff'
        },
    },

   
    [theme.breakpoints.down('md')]: {
        width:"30px",
        height:'30px',

        '& svg': {
            width:'18px',
            height:'18px',
        }
    }
}






// export const containerCalcGrid = {
//     backgroundColor: '#15161B',
//     display: 'block',
//     borderRadius: '20px',
//     width: '100%',

//     '&>.MuiGrid-item': {
//         p: '0'
//     },
//     p: '10px'
// }











export const contentAccordionList = {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: 'background.paper',
    borderRadius: '10px',
    m: '5px 0',
    alignItems: 'center',
    p: '7px 14px'
}

export const blockSwiperAccordion = { 
    position: 'relative', 
    flexGrow:'1', 
    '& .slide-recipe-list': { 
        width: 'auto' 
    } 
}