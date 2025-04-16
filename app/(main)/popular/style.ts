import { theme } from "@/config/ThemeMUI/theme";




export const mainBtnsPopular = {
    backgroundColor: 'rgba(12,13,16, 0.5)', 
    borderRadius:'50%', 
    width:'45px',
    height:'45px', 
    display:'flex', 
    alignItems:'center', 
    justifyContent:'center',
    border:'1px solid #777777',
    cursor:'pointer',
    transition:'0.15s',

    "&:hover":{
        transform: "scale(1.1)"
    },

    [theme.breakpoints.down(1250)]:{
        width:'35px',
        height:'35px', 
    }
}