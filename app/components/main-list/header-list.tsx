'use client'

import { Button} from "@mui/material";
import Link from "next/link";
import { btnMain } from "@/app/main-styles";
import { usePathname } from "next/navigation";
import { theme } from "@/config/ThemeMUI/theme";

interface PropsData {
    url:string,
    name:string
}

export function HeaderList({props}:{props:PropsData}) {
    const pathname = usePathname()
   
    return (
        <Button
            component={Link}
            sx={{...btnMain, 
                mb:'0', 
                p:'6px 15px', 
                minWidth:'100px',
                backgroundColor:props.url === pathname ? 'primary.main' : 'background.paper',
                [theme.breakpoints.down(1050)]:{
                    p:'3px 10px',
                    fontSize:'14px',
                    minWidth:'70px'
                }
            }}
            href={props.url}
        >
            {props.name}
        </Button>
           
    )
}