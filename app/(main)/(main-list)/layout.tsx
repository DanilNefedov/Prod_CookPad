import { HeaderList } from "@/app/components/main-list/header-list";
import { AppBar, Box } from "@mui/material";




export default async function ListLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const links = [
        {
            url: '/list',
            name: 'List'
        },
        {
            url: '/list-recipe',
            name: 'Recipes'
        }
    ]

    return (
        // <AlertsProvider>
            <Box sx={{ height: 'inherit' }}>
                <AppBar position="static" sx={{
                    backgroundColor: 'background.default',
                    alignItems: 'center',
                    m: '10px 0',
                    justifyContent: 'center',
                    flexDirection: 'inherit',
                    borderRadius: '10px',
                    p: '10px 0',
                    gap: '20px',
                    boxShadow: 'none',

                }}>
                    {links.map(el => (
                        <HeaderList props={el} key={el.url}></HeaderList>
                    ))}

                </AppBar>
                {children}
            </Box>
        // </AlertsProvider>

    )
}