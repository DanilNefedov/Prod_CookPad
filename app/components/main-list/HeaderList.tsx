'use client'

import { Button} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { headerLink } from "@/app/(main)/(main-list)/styles";

interface Props {
    url:string,
    name:string
}

export function HeaderList({props}:{props:Props}) {
    const pathname = usePathname()
   
    return (
        <Button
            component={Link}
            color={props.url === pathname ? 'blackRedBtn' : 'grayButton'}
            href={props.url}
            sx={headerLink}
        >
            {props.name}
        </Button>
           
    )
}