import { theme } from "@/config/ThemeMUI/theme"

export const mainBoxCook = {
    display: 'flex',
    height: 'calc(100dvh - 20px)',
    m: '10px 0',
    
    [theme.breakpoints.down("md")]: {
        flexDirection:'column',
        overflow:'auto',
    }
}


export const headerCook = {
    bgcolor: 'background.default',
    display: 'flex',
    height: '100%',
    borderRadius: '20px',
    boxShadow: 'none',
    maxWidth:'200px',
    width: '100%',
    padding:'10px 3px 10px 15px',


    [theme.breakpoints.down("md")]: {
        padding:'0 3px 0 0',
        maxWidth:'100%',
        bgcolor: 'transparent',
    }
}


export const scrollBox = {
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    // m: '10px 10px 10px 10px',
    borderRight: 1,
    borderColor: 'transparent',
    scrollbarColor: "#353842 #1F2128",
    pr: '10px',
    width: '100%',
    height:'100%',

    [theme.breakpoints.down("md")]: {
        flexDirection: 'initial',
        overflowY: 'hidden',
        gap:'20px',
    }
}


export const btnsCookHeader = {
    padding: '5px 5px',
    minHeight: 'auto',
    borderRadius: '10px',
    minWidth: '110px',
    width: '100%',
    m: '8px auto',
    '@media (hover: hover) and (pointer: fine)': {
        '& .hover': {
            backgroundColor: 'primary.light'
        },
    },
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: 'block',
    textAlign: 'center',
    maxWidth: '120px',
    '& .MuiButtonBase-root': {
        textAlign: 'center'
    },

    [theme.breakpoints.down("md")]: {
        // bgcolor: 'background.default',
        
        m: '0',
    }
}

export const deleteHeaderCook = {
    minWidth: 'inherit',
    p: '5px',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    '@media (hover: hover) and (pointer: fine)': {
        '&:hover': {
            backgroundColor: 'primary.main'
        },
        '&:hover svg': {
            color: '#fff'
        }
    },

    [theme.breakpoints.down("md")]: {
        position:'absolute',
        top:'0',
        right:'0',
        width: '35px',
        height: '35px',
    }

}





export const imgRecipeContainer = {
    // width: '50%',
    // m:'15px 0 20px 15px',
    // maxHeight:"700px",
    // maxWidth:"750px"
    width:'100%',
    height:'100%',
    alignItems:'center',
    justifyContent:'center',
    display:'flex',
    aspectRatio:'4/5',
    maxWidth:'465px'
}

export const imgRecipe = {
    height: '100%',
    objectFit: "cover",
}

export const contentBlock = {
    backgroundColor:'background.default',
    borderRadius:'20px',
    width:'50%',
    overflow: "auto", 
    p:'7px 7px',
    // height:'fit-content',
    flexShrink:'0',
    mr:'20px',
    height:'100%'
}

export const contentContainer ={
    overflowX:'hidden',
    scrollbarColor: "#353842 #1F2128",
    maxHeight:'calc(100dvh - 74px)',
    p:'15px 15px',
    position:'relative'
   
}

export const descriptionRecipt = {
    textAlign: 'center', 
    fontSize: '16px', 
    p: '15px 0 10px'
}


export const containerContentRecipe = {
    width:'calc(100% - 200px)',
    m:'0',
    borderRadius:'20px',
    backgroundColor:'background.default',
    ml:"20px",
    scrollbarColor: "#353842 #1F2128",
    p:'10px',
    
    [theme.breakpoints.down("md")]: {
        // width:'calc(100% - 50px)',
        width:'100%',
        ml:"0px",
        mt:'20px'
    }
}


export const ingredientsCook = {
    display:'flex',
    flexWrap:'wrap',
}

export const ingredientBox = {
    width:'25%',
    display:'block',
    alignItems:'center',
    p:'6px'
}

export const containerContentSlide ={
    p:'5px',

}

export const avatartIngredient = {
    margin:'0 auto', 
    width:'50px', 
    height:"50px",
    objectFit:'cover'
}


export const addListIngr = {
    backgroundColor:'background.default',
    color:'text.secondary',
    textTransform:'none',
    p:'2px 7px',
    lineHeight:'1.7',
    '@media (hover: hover) and (pointer: fine)': {
        '&:hover':{
            color:'text.primary',
            backgroundColor:'primary.main',
        },
    },
    display:'block',
    mt:'10px',
    [theme.breakpoints.down("md")]: {    
        fontSize:'14px',
        minWidth:'0',
        lineHeight:'14px',
        p:"5px 7px"
    }
}



export const menuListItems = {
    backgroundColor:'background.paper',
    width:'100%',
    borderRadius:'10px',
    m:'7px auto',
    minHeight:'0',
    '@media (hover: hover) and (pointer: fine)': {
        '&:hover':{
            backgroundColor:'background.paper'
        },
        
    },

}


export const btnListItem = {
    pointerEvents: 'auto',
    '@media (hover: hover) and (pointer: fine)': {
        '&:hover':{
            backgroundColor:'primary.dark'
        },
        '& svg:hover':{
            color:'text.primary'
        },
    },

    
    p:'4px 4px',
    width:'auto',
    minWidth:'auto',
    ml:'auto',
    [theme.breakpoints.down("md")]: {
        width:'20px',
        height:'20px'
    }
}




export const btnAddNew = {
    display:'flex', 
    m:'0 auto 10px ', 
    transition:'0',
    color:'text.primary',
    textTransform:'capitalize',
    backgroundColor:'background.paper',
    p:'5px 10px',
    '@media (hover: hover) and (pointer: fine)': {
        '&:hover':{
            backgroundColor:'primary.dark',
        }
    },
    [theme.breakpoints.down("md")]: {
        width:'auto',
        height:'auto',
        p:'5px 15px',
        borderRadius:'10px',
        fontSize:'14px',
        lineHeight:'20px'
    }
}