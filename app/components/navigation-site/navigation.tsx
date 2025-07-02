
import { Container, Paper } from '@mui/material'
import Box from '@mui/material/Box';

import { LogOut } from './log-out'
import { BtnLinks } from './btn-links'
import { AboutUser } from './user-info';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import RecommendIcon from '@mui/icons-material/Recommend';
import { theme } from '@/config/ThemeMUI/theme';
import { DataPage } from '@/app/(main)/types';


export function NavigationSite() {
    const pages:DataPage[] = [
        { 
            name: 'Home', 
            path: ['/home', '/cook/:path*' ],
            icon: <HomeIcon sx={{mr:'5px'}}/>
        },
        { 
            name: 'Popular',
            path: ['/popular'],
            icon:<RecommendIcon sx={{mr:'5px'}}/>
        },
        { 
            name: 'New Recipe', 
            path: ['/new-recipe'],
            icon:<AddCircleIcon sx={{mr:'5px'}}/>
        },
        { 
            name: 'List', 
            path: ['/list', '/list-recipe'],
            icon:<ChecklistRtlIcon sx={{mr:'5px'}}/>
        },
    ];

    return (
        <Paper 
        sx={{
            backgroundColor: 'background.default',
            flexGrow: 0,
            borderRadius: '0',
            width: '100%',
            maxWidth: '165px',
            [theme.breakpoints.down("md")]: {
                maxWidth:'60px'
            },
            [theme.breakpoints.down(500)]: {
                maxWidth:'45px'
            }
        }}>
            <Container 
            
            sx={{
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between', 
                height: '100dvh', 
                paddingTop: '17px',
                paddingBottom: '25px', '&.MuiContainer-root': {
                    paddingLeft: '12px',
                    paddingRight: '12px',
                    [theme.breakpoints.down("md")]: {
                        pl:'0px',
                        pr:'0',
                    },

                    [theme.breakpoints.down(500)]: {
                        pr:'0'
                    }
                },
            }}>
                <Box>
                    <AboutUser></AboutUser>
                </Box>
                <Box sx={{display:'flex', flexDirection:'column', [theme.breakpoints.down("md")]: {
                        display:'block'
                    }}}>
                    {pages.map((page) => (
                        <BtnLinks key={page.path[0]} page={page}></BtnLinks>
                    ))}
                </Box>

                <Box sx={{display:'flex', justifyContent:'center',[theme.breakpoints.down("md")]: {
                        justifyContent:'flex-start'
                    }}}>
                    <LogOut></LogOut>
                </Box>
            </Container>
        </Paper>
    )
}