import { theme } from "@/config/ThemeMUI/theme"

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
    maxHeight: '75px',
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

export const nameIngredient = {
    // m: '0 0 0 15px',
    maxWidth: '150px',

    '& span':{
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
    },

    [theme.breakpoints.down(1050)]: {
        maxWidth:'100px',

        '& span':{
            fontSize:'14px'
        }
    },

    
}

export const imgIngrList = {
    maxHeight: '45px',
    width:'100%',
    height:'100%',
    [theme.breakpoints.down(1050)]: {width:'30px'} 
}


export const blockUnits = {
    display: "flex",
    flexWrap: 'wrap',
    backgroundColor: 'background.paper',
    padding: '4px 10px',
    borderRadius: '10px',
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
    }
    // opacity:'0.3',
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



export const btnsListUnitHover = {
    transition: '0.4s',
    maxWidth:'35px',
    minWidth:'0',
    p:'5px',
    '@media (hover: hover) and (pointer: fine)': {
        '&:hover': {
            backgroundColor: 'primary.main',

            '& .MuiSvgIcon-root': {
                color: 'background.paper'
            }
        },
    },
    [theme.breakpoints.down(800)]: {
        
        maxWidth:'none',
        textAligh:'center',

        '& span':{
            lineHeight:'initial',
        },
        '@media (hover: hover) and (pointer: fine)': {
            '&:hover': {
                backgroundColor: 'background.default',

                '& .MuiSvgIcon-root': {
                    color: 'primary.main'
                }
            },
        }
        // '&:hover': {
        //     backgroundColor: 'background.paper',

        //     '& .MuiSvgIcon-root': {
        //         color: 'inherit'
        //     }
        // },
        
    }

}

export const styleBtnsAdaptiveMenu = {
    backgroundColor:'background.default', 
    p:'5px 10px',
    width:'100%',
    justifyContent:'start',
    
    '& svg':{
        width:'18px'
    }, 

    "& span":{
        textTransform:'none',
        ml:'7px'
    }
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

export const modalContainer = {
    backgroundColor: 'background.paper',
    maxWidth: '50%',
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



export const cellHeader = {
    '& .MuiTableCell-root': {
        color: '#8E94A4',
    }
}


export const sortBtnHeader = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: "center",
    borderBottom: '0'
}




export const calcInput = {
    width: '100%',
    '& .MuiInputBase-input': {
        WebkitTextFillColor: '#fff !important',
        maxWidth: "210px",

        [theme.breakpoints.down('md')]: {
            fontSize:'14px',
            
        }
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#353842 !important'
    },
    [theme.breakpoints.down('md')]: {
        '& .MuiInputBase-root':{
            p:'9.5px 15px'
        }
        
    }
    
}

export const containerCalcGrid = {
    backgroundColor: '#15161B',
    display: 'block',
    borderRadius: '20px',
    width: '100%',

    '&>.MuiGrid-item': {
        p: '0'
    },
    p: '10px'
}


export const containerCalcBtns = {
    '& .MuiGrid-item': {
        width: '25%',
        m: '7px 0',
        '& button': {
            fontWeight: '900'
        }
    }
}

export const menuCalc = {
    '& .MuiPaper-root': {
        maxWidth: '300px',
        backgroundColor: '#15161B',

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