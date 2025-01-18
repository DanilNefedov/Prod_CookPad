import { Container, Paper } from '@mui/material'
import Box from '@mui/material/Box';

import { LogOut } from './log-out'
import { dataPage, paperNavigation } from '@/app/main-styles'
import { BtnLinks } from './btn-links'






export function NavigationSite() {
    const pages:dataPage[] = [
        { 
            name: 'Home', 
            path: ['/home', '/cook/:path*' ]
        },
        { 
            name: 'Popular',
            path: ['/popular'] 
        },
        { 
            name: 'New Recipe', 
            path: ['/new-recipe'] 
        },
        { 
            name: 'List', 
            path: ['/list', '/list-recipe'] 
        },
    ];

   
    return (
        <Paper sx={paperNavigation}>
            <Container sx={{
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', paddingTop: '17px', paddingBottom: '25px', '&.MuiContainer-root': {
                    paddingLeft: '12px',
                    paddingRight: '12px',
                }
            }}>
                <Box>
                    {/* <AboutUser></AboutUser> */}
                </Box>
                <Box sx={{display:'flex', flexDirection:'column'}}>
                    {pages.map((page) => (
                        <BtnLinks page={page}></BtnLinks>
                    ))}
                </Box>

                <Box sx={{display:'flex', justifyContent:'center'}}>
                    <LogOut></LogOut>
                </Box>
            </Container>
        </Paper>
    )
}