'use client'

import { btnLink, PageStyles } from "@/app/main-styles";
import { Button } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";



export function BtnLinks({ page }: { page: PageStyles }) {
    const pathname = usePathname()



    return (
        <Button
            key={page.path[0]}
            variant="contained"
            sx={btnLink(page, pathname)}
            component={Link}
            href={page.path[0]}
        >
            {page.icon}
            <span>{page.name}</span>
                   
        </Button>
    )

}