export const blockList = {
    height: '95vh',
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
    '& .MuiTableCell-root': {
        borderBottom: '10px solid #353842',
    },
    '&:last-child .MuiTableCell-root': {
        borderBottom: '0'
    }
}

export const nameIngredient = {
    // m: '0 0 0 15px',
    maxWidth: '200px'
}

export const imgIngrList = {
    maxHeight: '55px',

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
    }
}



export const btnsListUnitHover = {
    transition: '0.4s',
    minWidth:'50px',

    '&:hover': {
        backgroundColor: 'primary.main',

        '& .MuiSvgIcon-root': {
            color: 'background.paper'
        }
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
    maxWidth: '40%',
    top: '50%',
    left: '50%',
    position: 'relative',
    transform: "translate(-50%, -50%)",
    padding: '10px',
    borderRadius: '20px'
}


export const amountNewUnit = {
    '& .MuiInputBase-input': {
        p: '10px',
    },
}


export const btnsModal = {
    padding: '3px 10px',
    borderRadius: '50%',
    minWidth: 'initial',
    margin: '0 5px',

    '&:hover': {
        backgroundColor: 'primary.main'
    },

    '&:hover svg': {
        color: '#fff'
    }
}



export const cellHeader = {
    '& .MuiTableCell-root': {
        color: '#8E94A4',
        borderRight: '2px solid #37393c',
        borderBottom:'2px solid #37393c',
        '&:last-child': {
            borderRight: '0'
        }
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
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#353842 !important'
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