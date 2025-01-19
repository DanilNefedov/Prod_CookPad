export const mainContent = {
    backgroundColor: 'trasparent',
    flex: '1',
    overflowY: 'auto',
    mb: '20px',
    borderRadius: '0'
}

export const mainContainer = {
    height: '100%',
    display: 'flex',
    flexWrap: 'wrap', '&.MuiContainer-root': {
        paddingLeft: 0,
        paddingRight: 0,
    },
    borderRadius: '20px'
}


export const mainCard = {
    width: '32.85%',
    backgroundColor: 'background.default',
    m: '4px',
    // height: 'fit-content',
    borderRadius: '0',
    '&:nth-child(1)': {
        borderRadius: '20px 0 0 0',
    },
    '&:nth-child(3)': {
        borderRadius: '0 20px 0 0',
    },
    alignItems: "stretch",
    height:'450px',
    position:'relative',
}

export const mainCardImg = { 
    // borderRadius: '50%', 
    objectFit: "cover", 
    objectPosition: "center",
    width: '100%',
    height:'100%',
    m: '0 auto',
    flex: '1',
}

export const contentPostionAbsolute = {
    position:'absolute',
    backgroundColor:'rgba(31,33,40, 0.7)',
    width: '100%',
    padding:'7px 15px',
    backdropFilter: 'blur(3px)',
    zIndex:'100',
}


export const bottomTypeFavCard = {
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    bottom:'0'
}

export const bottomDescriptionCard = {
    padding: '0 13px ', 
    maxWidth: '200p'
}


export const favoriteBtnActive ={ 
    color: 'primary.main', 
    '&:hover': { 
        color: 'primary.main' 
    } 
}

export const favoriteBtnDesactive = { 
    color: '#8E94A4', 
    '&:hover': { 
        color: 'primary.main' 
    } 
}


export const cookBtn = {
    padding: '2px 10px', 
    backgroundColor: '#4F5362', 
    color: 'text.primary', 
    textTransform: 'initial', 
    fontSize: '15px', 
    "&:hover": { 
        backgroundColor: 'primary.main', 
        color: "text.primary" 
    }
}