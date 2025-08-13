import { theme } from "@/config/ThemeMUI/theme"




export const pageContainer = { 
    height: 'calc(100dvh - 80px)', 
    overflowY: 'auto' 
}

export const accordionMain = { 
    p: '0', 
    overflow: 'auto', 
    height: '100%', 
    bgcolor: 'background.default', 
    borderRadius: '10px' 
}

export const accordionTable = {
    minWidth: '0', 
    '& .MuiTableCell-root': {
        bgcolor: 'background.paper',
        p: '7px 14px', 
        [theme.breakpoints.down(1050)]: { 
            p: '9px 7px' 
        },
        [theme.breakpoints.down(400)]: { 
            p: '8px 3px' 
        }
    },
}

export const accordionTableBody = { 
    overflow: 'auto', 
    borderTop: '2px solid rgba(255, 0, 0, 0.12)' 
}

export const accorionCell = {
    backgroundColor:'transparent', 
    border:'0', 
    width:"100%",
}

export const mainContainerList = { 
    height: '100%', 
    position: 'relative' 
}

export const containerAccordion = { 
    display: 'flex', 
    alignItems: 'center', 
    mb: '5px'
}

export const accordion = {
    width: "100%",
    backgroundColor: 'background.default',
    height: 'auto',
    overflow: 'none',
    p: '15px',
    '&:first-of-type': { 
        borderTopLeftRadius: '10px', 
        borderTopRightRadius: '10px' 
    },
    '&:last-of-type': { 
        borderBottomLeftRadius: '10px', 
        borderBottomRightRadius: '10px' 
    },
    '&.Mui-expanded': { 
        m: '5px 0 ', 
    },
    '& .MuiButtonBase-root.MuiAccordionSummary-root': { 
        p: '0', justifyContent:'space-between' 
    },
    '& .MuiAccordionSummary-content.Mui-expanded': {
        m: '0 0 20px 0'
    }
}

export const accordionSumm = {
    '& .MuiAccordionSummary-content': {
        alignItems: 'center',
        m: '0',
        maxWidth: '97%'
    },
}

export const accordionMediaBox = { 
    height: '60px', 
    width: '60px', 
    objectFit: 'cover', 
    borderRadius: '50%' 
}

export const accordionName = {
    m: '0 auto',
    fontSize: '18px',
    maxWidth: "65%",
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
}

export const deleteRecipeBtn = {
    position: 'absolute', 
    top: '10px', 
    right: '16px', 
    minWidth: "0", 
    p: '0',
    bgcolor:'transparent'
}

export const deleteRecipeIcon = {
    width: '25px',
    height: '25px',
    [theme.breakpoints.down('md')]: {
        width: '18px',
        height: '18px',
    },
}