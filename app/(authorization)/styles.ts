import { theme } from "@/config/ThemeMUI/theme"
import { SxProps, Theme } from "@mui/material"



export const layoutAuth = {
  backgroundColor: 'background.paper',
  borderRadius: '20px',
  height: '600px',
  margin: 'auto',
  flexDirection: 'column',
}

//------- login -------//

export const templateHeaderAuth = {
  textAlign: "center", 
  fontWeight: "600", 
  padding: "15px 0", 
  fontSize: "1.3rem",
  [theme.breakpoints.down("md")]: {
    fontSize: "18px",
  },
}

export const containerLoading: SxProps<Theme> = {//serv component
  position:'absolute', 
  top:'0', 
  bottom:'0', 
  width:'100%', 
  height:'100%', 
  zIndex:'9999', 
  bgcolor: 'common.black46'
}

export const linksAuth: SxProps<Theme> = (theme) => ({//client component
  width: 'fit-content',
  display: 'block',
  margin: '10px auto 0',
  color: theme.palette.error.dark,
  transition: 'color 0.2s',
  '&:hover': {
    color: theme.palette.primary.main,
  }
})

export const textPopover: SxProps<Theme>  = {
  p: 2, 
  maxWidth:"300px", 
  bgcolor:'background.default'
}

//------- login -------//

//------- register -------//

export const containerAvatar = {
  mt: '10px', 
  position: 'relative', 
  mb: '23px'
}

export const helperTextAvatar = {
  position: 'absolute', 
  bottom: '-23px', 
  left: 'calc(50% - 79px)', 
  fontSize: '12px', 
}

export const avatar = {
  width: 45, 
  height: 45, 
  mr: 2, 
}

//------- register -------//
