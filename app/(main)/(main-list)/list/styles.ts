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

export const mainBoxCreating = { 
    position: 'absolute', 
    right: '28px', 
    bottom: '10px' 
}

export const fabCreating = {
    position:'relative',
    [theme.breakpoints.down(600)]: { 
        width:"36px",
        height:'33px'
    }
}

export const fabIcon = {
    position:'absolute'
}

export const popoverCreating = {
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    width:'600px',
}

export const containerCreationIngr = {
    width:'100%',
    bgcolor:'background.paper',
    p:'20px 10px'
}

export const mainBtnsCreation = {
    display:'flex', 
    justifyContent:'center', 
    gap:'20px'
}

export const containerIngrItem = {
    width:'100%',
    display:'flex',
    alignItems:'center',

    [theme.breakpoints.down(600)]: { 
        flexWrap:'wrap',
        borderStyle:'solid',
        borderColor:'text.desactive',
        pb:'10px',
        mb:'10px'
    }
}