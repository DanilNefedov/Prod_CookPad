// 'use client'

import { Container, Paper } from '@mui/material'
import { Button } from '@mui/material'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { text } from 'stream/consumers'
import Box from '@mui/material/Box';

// import { AboutUser } from './about-user'
import { LogOut } from './log-out'
import { btnLink, dataPage, paperNavigation } from '@/app/main-styles'






export function NavigationSite() {
    const pathname = usePathname()
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
                        <Button
                            key={page.path[0]}
                            variant="contained"
                            sx={btnLink(page, pathname)}
                            component={Link}
                            href={page.path[0]}
                        >
                            {page.name}
                        </Button>
                    ))}
                </Box>

                <Box sx={{display:'flex', justifyContent:'center'}}>
                    <LogOut></LogOut>
                </Box>
            </Container>
        </Paper>
    )
}