'use client'

import { Button} from "@mui/material";
import Link from "next/link";
import { btnMain } from "@/app/main-styles";
import { usePathname } from "next/navigation";

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
                backgroundColor:props.url === pathname ? 'primary.main' : 'background.paper'
            }}
            href={props.url}
        >
            {props.name}
        </Button>
           
    )
}