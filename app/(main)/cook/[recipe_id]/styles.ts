export const mainBoxCook = {
    display: 'flex',
    height: 'calc(100vh - 20px)',
    m: '10px 0',
}


export const headerCook = {
    bgcolor: 'background.default',
    display: 'flex',
    height: '100%',
    borderRadius: '20px',
    boxShadow: 'none',
    width: '14%',
}


export const scrollBox = {
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    m: '10px 10px 10px 10px',
    borderRight: 1,
    borderColor: 'transparent',
    scrollbarColor: "#353842 #1F2128",
    pr: '10px',
    width: '100%',
}


export const btnsCookHeader = {
    padding: '5px 5px',
    minHeight: 'auto',
    borderRadius: '10px',
    minWidth: '110px',
    width: '100%',
    m: '10px auto',
    '& .hover': {
        backgroundColor: 'primary.light'
    },
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: 'block',
    textAlign: 'center',
    maxWidth: '120px',
    '& .MuiButtonBase-root': {
        textAlign: 'center'
    }
}

export const deleteHeaderCook = {
    minWidth: 'inherit',
    p: '5px',
    borderRadius: '50%',
    width: '34px',
    height: '34px',
    ml: '10px',
    '&:hover': {
        backgroundColor: 'primary.main'
    },

    '&:hover svg': {
        color: '#fff'
    }
}





export const imgRecipeContainer = {
    // width: '50%',
    // m:'15px 0 20px 15px',
    // maxHeight:"700px",
    // maxWidth:"750px"
    alignItems:'center',
    justifyContent:'center',
    display:'flex'
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
    p:'0 7px',
    height:'fit-content',
    flexShrink:'0',
    mr:'20px',
}

export const contentContainer ={
    overflowX:'hidden',
    scrollbarColor: "#353842 #1F2128",
    maxHeight:'calc(100vh - 60px)',
    p:'15px 15px',
    position:'relative'
   
}

export const descriptionRecipt = {
    textAlign: 'center', 
    fontSize: '16px', 
    p: '15px 0 10px'
}


export const containerContentRecipe = {
    maxWidth: 'none!important',
    height:'auto',
    minHeight:'auto',
    width:'86%',
    pr:'0!important',

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
    p:'5px'
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
    '&:hover':{
        color:'text.primary',
        backgroundColor:'primary.dark',
    },
    display:'block'
}



export const menuListItems = {
    backgroundColor:'background.paper',
    width:'100%',
    borderRadius:'10px',
    m:'7px auto',

}


export const btnListItem = {
    pointerEvents: 'auto',
    '&:hover':{
        backgroundColor:'primary.dark'
    },

    '& svg:hover':{
        color:'text.primary'
    },
    p:'4px 4px',
    width:'auto',
    minWidth:'auto',
    ml:'auto'
}




export const btnAddNew = {
    display:'flex', 
    m:'0 auto 10px ', 
    transition:'0',
    backgroundColor:'background.paper',
    p:'5px 10px',
    '&:hover':{
        backgroundColor:'primary.dark',
        color:'text.primary'
    }
}