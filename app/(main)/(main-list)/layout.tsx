import { HeaderList } from "@/app/components/main-list/HeaderList";
import { AppBar, Box } from "@mui/material";
import { contanierLinks } from "./styles";
import { centerFlexBlock } from "@/app/styles";




export default async function ListLayout({children}: {children: React.ReactNode}) {

    const links = [
        {
            url: '/list',
            name: 'Ingredients'
        },
        {
            url: '/list-recipe',
            name: 'Recipe List'
        }
    ]

    return (
        <Box sx={{ height: 'inherit' }}>
            <AppBar sx={[centerFlexBlock, contanierLinks]}>
                {links.map(el => (
                    <HeaderList props={el} key={el.url}></HeaderList>
                ))}
            </AppBar>
            {children}
        </Box>

    )
}