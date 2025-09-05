'use client'


import { containerHome } from "@/app/(main)/home/styles";
import { Container } from "@mui/material";
import { usePathname } from "next/navigation";
import { theme } from "../ThemeMUI/theme";




interface Props {
    children: React.ReactNode;
}


export default function DynamicContainer({ children }: Props) {
    const pathname = usePathname();
    const isPopularPage = pathname === '/popular'


    return (
        <Container sx={[containerHome, {
            [theme.breakpoints.down("md")]: {
                pl: isPopularPage ? '0' : "10px",
                pr: isPopularPage ? '0' : "10px"
            },
        }]} maxWidth={false}>
            {children}
        </Container>
    )
}