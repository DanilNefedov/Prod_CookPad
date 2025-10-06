import { theme } from "@/config/ThemeMUI/theme";




export const table = {
    mb:'7px',
    minWidth: '0', 
    '& .MuiTableCell-root': {
        p: '7px 14px', 
        [theme.breakpoints.down(1050)]: { 
            p: '12px 7px' 
        },
        [theme.breakpoints.down(400)]: { 
            p: '12px 3px' 
        }
    },

}

export const containerInfo = { 
    backgroundColor: 'transparent', 
    border: '0' 
}

export const tableBody = { 
    overflow: 'auto', 
}

export const moreButton = {
    display: 'flex',
    alignItems: 'center',
    width: '150px',
    height: '32.5px',
    m: '20px auto',

    [theme.breakpoints.down('md')]: { 
        width:'130px',
        height:'30px'
    }
}

export const skeletonTableRow = {
    backgroundColor: 'background.default',
    borderRadius: '15px',
    height:'60px', 

    '& .MuiTableCell-root': {
        borderBottom: '5px solid',
        borderColor: 'background.paper',

        "@media (max-width:800px)": {
            borderBottom: `3px solid`,
            borderColor: 'background.paper',
        }, 
    },
}

export const skeletonBoxUnits = { 
    display: "none",
    gap: "10px",
    overflow: "hidden",
    "@media (min-width:800px)": {
        display: "flex",
    }, 
}

export const skeletonMainBtns = { 
    width: '40px', 
    height: '40px', 
    borderRadius: '50%' 
}


export const skeletonBoxMainBtns = {
    display: "none",
    "@media (min-width:1150px)": {
        display: "flex",
    }, 
}
