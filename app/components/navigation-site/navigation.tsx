
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
import { containerButtons, containerExit, containerNavigation, paperNavigation } from '@/app/(main)/home/styles';
import { columnSpaceBetween } from '@/app/styles';


export function NavigationSite() {
    const pages:DataPage[] = [
        { 
            name: 'Home', 
            path: ['/home', '/cook/:path*' ],
            icon: <HomeIcon viewBox="0 1 24 24" sx={{mr:'5px'}}/>
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
        <Paper sx={paperNavigation}>
            <Container disableGutters sx={[columnSpaceBetween, containerNavigation]}>
                <Box>
                    <AboutUser></AboutUser>
                </Box>
                <Box sx={containerButtons}>
                    {pages.map((page) => (
                        <BtnLinks key={page.path[0]} page={page}></BtnLinks>
                    ))}
                </Box>

                <Box sx={containerExit}>
                    <LogOut></LogOut>
                </Box>
            </Container>
        </Paper>
    )
}