import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box, CardHeader, Menu, MenuItem, useMediaQuery } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import Link from "next/link";
import { bottomTypeFavCard, contentPostionAbsolute, cookBtn, favoriteBtnActive, favoriteBtnDesactive, mainCard } from "@/app/(main)/home/style";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import './swiper-media.css';
import { Navigation, Virtual } from 'swiper/modules';
import { memo, useState } from "react";
import { useAppDispatch, useAppSelector } from '@/state/hook';
import { setFavoriteRecipe } from '@/state/slices/recipe-slice';
import { theme } from '@/config/ThemeMUI/theme';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { newListRecipe } from '@/state/slices/list-recipe-slice';
import dynamic from 'next/dynamic';


const SwiperMediaCard = dynamic(() => import('./swiper-media-card'), {
    ssr: false, 
    loading: () => <div style={{ height: 200 }}>loading...</div>,
});



interface propsData {
    recipe_id:string,
    id:string
}




export const CardContentBlock = memo(({ props }: { props: propsData }) => {
    const { recipe_id, id} = props
    const recipes = useAppSelector(state => state.recipe.recipes.find(el => el.recipe_id === recipe_id));
    
    const dispatch = useAppDispatch()

    const isMobile = useMediaQuery("(max-width:500px)");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openAdaptive = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };




    const handleCloseAdaptive = () => {
        setAnchorEl(null);
    };

    const handlerFavorite = (recipe_id: string, favorite: boolean | undefined): void => {
        if (recipe_id && id !== '' && favorite !== undefined) {
            const data = { connection_id: id, recipe_id, favorite }
            dispatch(setFavoriteRecipe(data))
        }
    }
   
    function addToList() {
        if (id !== '' && recipe_id) {
            dispatch(newListRecipe({ connection_id: id, recipe_id: recipe_id }))
        }
    }

    

    return (
        <Card sx={mainCard}>
            <CardContent sx={contentPostionAbsolute}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <CardHeader
                        title={recipes?.name}
                        sx={{ padding: 0, maxWidth: "70%", '& .MuiCardHeader-content':{width:'100%'}, [theme.breakpoints.down(500)]: {maxWidth: "57%"}}}
                        slotProps={{
                            title: {
                                sx: { fontSize: '16px', textTransform: 'capitalize',
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis",
                                    width:'100%',
                                    [theme.breakpoints.down("md")]: {
                                        fontSize:'14px'
                                    },
                                 },
                            },
                        }}
                    />


                    <Box display="flex" alignItems="center">
                        <AvTimerIcon
                            sx={{
                                fontSize: "20px",
                                height: '20px',
                                mr: '3px',

                                [theme.breakpoints.down("md")]: {
                                    height: '17px',
                                },
                            }}
                        />
                        <Typography
                            variant="subtitle2"
                            sx={{
                                lineHeight: '0',
                                [theme.breakpoints.down("md")]: {
                                    fontSize: '12px'
                                },
                            }}

                        >
                            {`${recipes?.time.hours === '' ? '00' : recipes?.time.hours}:${recipes?.time.minutes === '' ? '00' : recipes?.time.minutes}h`}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>


            <Swiper
                modules={[Navigation, Virtual ]}
                virtual
                slidesPerView={1}
                className="swiper-media-main"
                navigation={{
                    prevEl: '.btn-prev-media',
                    nextEl: '.btn-next-media',

                }}
            
                spaceBetween={1}
            // lazy={true}
            >
                {recipes?.media
                    .slice()
                    .sort((a, b) => Number(b.main) - Number(a.main))
                    .map(el => (
                        <SwiperSlide key={el.media_id} className="media-main-slide">
                            <SwiperMediaCard props={{ el, name:recipes?.name }} />
                        </SwiperSlide>
                    )
                    )}


                <Box className='btn-next-media' sx={{
                    width:'35px', 
                    height:'35px', 
                    backgroundColor:'rgba(31,33,40, 0.7)',
                    borderRadius:'50%',
                    cursor:'pointer',
                    [theme.breakpoints.down("md")]: { width:'30px', 
                        height:'30px',},

                    [theme.breakpoints.down(600)]: { width:'20px', 
                        height:'20px',}
                    }}>
                    <ArrowRightIcon viewBox="3 3 17 17" sx={{ fontSize: 35, borderRadius:'50%', mt:'-1px',
                
                        [theme.breakpoints.down("md")]: { fontSize: 30 },
                        [theme.breakpoints.down(600)]: { fontSize: 20 }
                    }}></ArrowRightIcon>
                </Box>
                <Box className='btn-prev-media' sx={{
                    width:'35px', 
                    height:'35px', 
                    backgroundColor:'rgba(31,33,40, 0.7)', 
                    borderRadius:'50%',
                    cursor:'pointer',
                    [theme.breakpoints.down("md")]: { width:'30px', 
                        height:'30px',},
                    [theme.breakpoints.down(600)]: { width:'20px', 
                        height:'20px',}
                    }}>
                    <ArrowLeftIcon viewBox="3 3 17 17" sx={{ fontSize: 35, borderRadius:'50%', margin: "-1px 0 0 -2px",
                
                        [theme.breakpoints.down("md")]: { fontSize: 30 },
                        [theme.breakpoints.down(600)]: { fontSize: 20, margin: "0px 0 0 -1px" }
                    }}></ArrowLeftIcon>
                </Box>
            </Swiper>
            


            <CardContent sx={{ ...contentPostionAbsolute, bottom: '0' }}>
                <Box sx={bottomTypeFavCard}>
                    <Typography gutterBottom component="p" mb='0' sx={{
                        fontSize: "15px",
                        color: '#B7BED3',
                        lineHeight: 'inherit',
                        [theme.breakpoints.down("md")]: {
                            fontSize: '12px',
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        },
                    }}>
                        {"type: " + recipes?.recipe_type}
                    </Typography>
                    <IconButton sx={{
                        padding: '0',
                    }} aria-label="add to favorites" onClick={() => handlerFavorite(recipe_id, recipes?.favorite)}>
                        {recipes?.favorite ? <FavoriteIcon sx={favoriteBtnActive} /> : <FavoriteIcon sx={favoriteBtnDesactive} />}
                    </IconButton>
                </Box>
                <Box>
                    <Typography gutterBottom
                        sx={{
                            pb: '8px',
                            m: '0',
                            fontSize: '15px',
                            maxWidth:"80%",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            [theme.breakpoints.down("md")]: {
                                fontSize: '12px',
                            },

                            [theme.breakpoints.down(500)]: { 
                                p:'7px 0 0 0',
                            },
                        }}
                    >
                        {recipes?.description}
                    </Typography>
                </Box>

                {/* <Box sx={{ display: 'flex', justifyContent: 'space-between' }}> */}
                {isMobile ? <><IconButton
                    aria-label="more"
                    id="long-button"
                    aria-controls={openAdaptive ? 'long-menu' : undefined}
                    aria-expanded={openAdaptive ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={handleClick}
                    sx={{color: '#8E94A4', position:'absolute', top:'30px', right:'6px', width:'20px', height:'18px', padding:'0'}}
                >
                    <MoreVertIcon sx={{width:'100%', height:'100%'}}/>
                </IconButton>
                    <Menu
                        id="long-menu"
                        MenuListProps={{
                            'aria-labelledby': 'long-button',
                        }}
                        anchorEl={anchorEl}
                        open={openAdaptive}
                        onClose={handleCloseAdaptive}
                        slotProps={{
                            paper: {
                                style: {
                                    maxHeight: 48 * 4.5,
                                    width: '8ch',
                                },
                            },
                        }}
                    >
                        <MenuItem onClick={handleCloseAdaptive} sx={{minHeight:'auto', justifyContent:'center', p:'4px 7px'}}>
                            <Button href={`/cook/${recipe_id}`} component={Link} size="small" sx={cookBtn}>Cook</Button>
                        </MenuItem>

                        <MenuItem onClick={handleCloseAdaptive} sx={{minHeight:'auto', justifyContent:'center', p:'4px 7px'}}>
                            <Button onClick={() => addToList()} size="small" sx={cookBtn}>To List</Button>
                        </MenuItem>

                        {/* <MenuItem onClick={handleCloseAdaptive} sx={{minHeight:'auto', justifyContent:'center', p:'4px 7px'}}>
                            <Button onClick={handleOpen} size="small" sx={{
                                minWidth: '0', p: '0',
                                color: `${open ? 'primary.dark' : 'text.disabled'}`,
                                '@media (hover: hover) and (pointer: fine)': {
                                    '&:hover': { backgroundColor: 'transparent' },},
                                [theme.breakpoints.down("md")]: {
                                    height: '22px',
                                    width: '19px'
                                },
                            }}>
                                <DeleteIcon sx={{
                                    width: '100%',
                                    height: '100%',
                                    '@media (hover: hover) and (pointer: fine)': {
                                        '&:hover': { 
                                            color: 'primary.main' 
                                        },
                                    },
                                }}></DeleteIcon>
                            </Button>
                        </MenuItem> */}
                    </Menu></>

                    :

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        {/* <Button size="small" sx={cookBtn}> */}
                            <Link 
                            href={{
                                pathname: `/cook/${recipe_id}`,
                                query: { name:recipes?.name },
                            }}
                            className='cookLinkMainContent'
                            >Cook</Link>
                        {/* </Button> */}
                        <Button onClick={() => addToList()} size="small" sx={cookBtn}>To List</Button>
                        {/* <Button onClick={handleOpen} size="small" sx={{
                            minWidth: '0', p: '0',
                            color: `${open ? 'primary.dark' : 'text.disabled'}`,
                            '@media (hover: hover) and (pointer: fine)': {
                            '&:hover': { backgroundColor: 'transparent' },},
                            [theme.breakpoints.down("md")]: {
                                height: '22px',
                                width: '19px'
                            },
                        }}>
                            <DeleteIcon sx={{
                                '&:hover': { 
                                    color: 'primary.main' 
                                },
                                [theme.breakpoints.down("md")]: {
                                    width: '100%',
                                    height: '100%'
                                }
                                
                            }}></DeleteIcon>
                        </Button> */}
                    </Box>
                }




                


                {/* <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        display: "flex",
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderRadius:'20px',
                        [theme.breakpoints.down(500)]: {
                            width:'250px',
                            p:'15px',
                            borderRadius:'10px',
                        }
                    }}>
                        <Typography id="modal-modal-description" sx={{ mt: 2, [theme.breakpoints.down(500)]: {
                            fontSize:'14px', mt:'0'
                        } }}>
                            Confirming the deletion of the prescription?
                        </Typography>
                        <Box sx={{ mt: '10px', justifyContent: "space-around", width: '300px', display: 'flex' }}>
                            <Button
                                onClick={() => handleDelete(recipe_id)}
                                sx={{
                                    minWidth: '0',
                                    p: '3px 15px',
                                    color: 'text.primary',
                                    backgroundColor: 'background.default',
                                    '@media (hover: hover) and (pointer: fine)': {
                                    "&:hover": {
                                        backgroundColor: 'primary.dark'
                                    },},
                                    [theme.breakpoints.down(500)]: {
                                        p:'3px 10px',
                                        borderRadius:'10px',
                                        fontSize:'12px'
                                    }
                                }}>Yes</Button>
                            <Button
                                onClick={handleClose}
                                sx={{
                                    minWidth: '0',
                                    p: '3px 15px',
                                    color: 'text.primary',
                                    backgroundColor: 'background.default',
                                    '@media (hover: hover) and (pointer: fine)': {
                                    "&:hover": {
                                        backgroundColor: 'primary.dark'
                                    },},
                                    [theme.breakpoints.down(500)]: {
                                        p:'3px 10px',
                                        borderRadius:'10px',
                                        fontSize:'12px'
                                    }
                                }}>No</Button>
                        </Box>
                    </Box>
                </Modal> */}

                {/* </Box> */}

            </CardContent>
        </Card>
    )
}
,(prevProps, nextProps) => {
    
    
    return prevProps.props.recipe_id === nextProps.props.recipe_id &&
    prevProps.props.id === nextProps.props.id
   
});


CardContentBlock.displayName = "CardContentBlock"