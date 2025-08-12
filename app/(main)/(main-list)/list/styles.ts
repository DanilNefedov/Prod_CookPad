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
    // borderTop: '2px solid rgba(255, 0, 0, 0.12)' 
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



