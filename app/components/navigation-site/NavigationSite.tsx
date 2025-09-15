import { Container, Paper } from '@mui/material'
import Box from '@mui/material/Box';
import { LogOut } from './LogOut'
import { BtnLinks } from './BtnLinks'
import { AboutUser } from './UserInfo';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import RecommendIcon from '@mui/icons-material/Recommend';
import { DataPage } from '@/app/(main)/types';
import { containerButtons, containerExit, containerNavigation, havigationIcons, 
    mobileNavigationBox, mobileNavigationContainer, paperNavigation } from '@/app/(main)/home/styles';
import { columnSpaceBetween } from '@/app/styles';


export function NavigationSite() {

    const pages: DataPage[] = [
        {
            name: 'Home',
            path: ['/home', '/cook/:path*'],
            icon: <HomeIcon viewBox="0 1 24 24" sx={havigationIcons} key={1} />
        },
        {
            name: 'Popular',
            path: ['/popular'],
            icon: <RecommendIcon sx={havigationIcons} key={2} />
        },
        {
            name: 'New Recipe',
            path: ['/new-recipe'],
            icon: <AddCircleIcon sx={havigationIcons} key={3} />
        },
        {
            name: 'List',
            path: ['/list', '/list-recipe'],
            icon: <ChecklistRtlIcon sx={havigationIcons} key={4} />
        },
    ];

    return (

        <>
            <Box sx={mobileNavigationBox}>
                <Container disableGutters sx={mobileNavigationContainer}>
                    
                    <Box sx={containerExit}>
                        <LogOut></LogOut>
                    </Box>

                    <Box sx={containerButtons}>
                        {pages.map((page) => (
                            <BtnLinks key={page.path[0]} page={page}></BtnLinks>
                        ))}
                    </Box>

                    <Box>
                        <AboutUser></AboutUser>
                    </Box>

                </Container>
            </Box>



            <Paper sx={[paperNavigation, { display: { xs: 'none', sm: 'block' } }]}>
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
        </>

    )
}