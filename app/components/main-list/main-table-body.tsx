import { Box, Collapse, ListItemText, TableCell, TableRow, Tooltip, Typography, useMediaQuery } from "@mui/material"
import { memo, useState } from "react"
import { MainButtons } from "./main-buttons"
import { imgIngrList, mainIngrList, nameIngredient } from "@/app/(main)/(main-list)/style"
import { Swiper, SwiperSlide } from "swiper/react"
import { theme } from "@/config/ThemeMUI/theme"
import { useAppSelector } from "@/state/hook"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import './list/styles.css';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { usePathname } from "next/navigation"
import { EmptyInfo } from "../ui-helpers/empty-info"
import dynamic from "next/dynamic"
import { UnitsId } from "@/app/(main)/(main-list)/list/types"

const Units = dynamic(() => import('./units'), {
    ssr: false, 
});






interface Props {
    ingredient_id: string,
    recipe_id?: string
}

const MainTableBody = memo(({ props }: { props: Props }) => {
    const { ingredient_id, recipe_id } = props;

    const thisIngredient = useAppSelector(state => {
        if (recipe_id) {
            return state.listRecipe.recipes
                .find(el => el._id === recipe_id)
                ?.ingredients_list.find(ing => ing._id === ingredient_id);
        }
    
        return state.list.list_ingr.find(el => el._id === ingredient_id);
    });
    const isMobile = useMediaQuery("(max-width:800px)");
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const pathName = usePathname()


    if (!thisIngredient) return null;


    const handleToggle = (id: string) => {
        setExpandedId((prevId) => (prevId === id ? null : id));
    }

    return !thisIngredient ? null : (
        <>
            <TableRow sx={{
                ...mainIngrList, opacity: `${thisIngredient.shop_ingr ? 0.4 : 1}`,
                '& .MuiTableCell-root': {
                    borderBottom: `${isMobile ? 'none' : '5px solid '}`,
                    borderColor: `${pathName === '/list-recipe' ? '#1F2128' : '#353842'}`
                },

            }}>
                <TableCell onClick={() => { if (isMobile) handleToggle(thisIngredient._id) }} sx={{ width: '73px', [theme.breakpoints.down(1050)]: { width: '30px' }, }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Box component={'img'} src={thisIngredient.media !== '' ? thisIngredient.media : '/images/load-ingr.svg'} alt={thisIngredient.name} sx={imgIngrList}></Box>
                    </Box>
                </TableCell>
                <TableCell onClick={() => { if (isMobile) handleToggle(thisIngredient._id) }} sx={{
                    maxWidth: '150px',
                    width: '150px',
                    [theme.breakpoints.down(1050)]: {
                        maxWidth: '100px',
                        width: '100px',
                    },

                }}>

                    {isMobile ?
                        <ListItemText
                            sx={nameIngredient}
                            primary={thisIngredient.name}
                        />
                        :
                        <Tooltip title={thisIngredient.name} sx={{ display: isMobile ? 'block' : 'none' }} arrow>
                            <ListItemText
                                sx={nameIngredient}
                                primary={thisIngredient.name}
                            />
                        </Tooltip>
                    }


                </TableCell>


                {
                    isMobile ?
                        <TableCell onClick={() => { if (isMobile) handleToggle(thisIngredient._id) }} sx={{
                            position: 'relative', '& .slide-list-unit': { width: 'auto' }, '& .swiper-list-unit': {
                                position: 'static',
                                m: '0',
                                ml: '7px',
                                mr: '7px'
                            }
                        }}>

                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'end' }}>
                                <Typography sx={{
                                    fontSize: '14px',
                                    color: 'text.disabled',
                                    pr: '5px',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                    maxWidth: '65px'
                                }}>x{thisIngredient.units.length}</Typography>
                                <ExpandMoreIcon sx={{
                                    transition: "transform 0.3s ease",
                                    transform: expandedId === thisIngredient._id ? "rotate(180deg)" : "rotate(0deg)",
                                    color: 'text.disabled'
                                }}></ExpandMoreIcon>
                            </Box>
                        </TableCell>

                        :
                        <TableCell 
                        sx={{
                            position: 'relative', '& .slide-list-unit': { width: 'auto' }, '& .swiper-list-unit': {
                                position: 'static',
                                m: '0',
                                ml: '7px',
                                mr: '7px'
                            },
                            maxWidth:"0px", /*     DO NOT CHANGE!     */
                            width: '100%',
                            
                        }}>
                            <Swiper
                                navigation={{
                                    prevEl: '.custom-prev-list-unit',
                                    nextEl: '.custom-next-list-unit',

                                }}
                                className="swiper-list-unit"
                                slidesPerView={'auto'}
                                modules={[Navigation]}
                                spaceBetween={10}
                                style={{ 
                                  
                                //    width:'100%'
                                }}
                            >
                                {
                                thisIngredient.units.length === 0 ?
                                    <EmptyInfo></EmptyInfo>
                                :
                                thisIngredient.units.map((elem: UnitsId) => (
                                    <SwiperSlide key={elem._id} className="slide-list-unit" style={{ width: 'auto', maxWidth: '100%' }}>
                                        <Units ingredient_id={thisIngredient._id} unit_id={elem._id} recipe_id={recipe_id}/>
                                    </SwiperSlide>


                                ))}

                                <div className={`custom-prev-list-unit ${pathName === '/list-recipe' ? 'list-recipe-disabled-btn' : 'list-disabled-btn'}`}>
                                    <ArrowLeftIcon></ArrowLeftIcon>
                                </div>
                                <div className={`custom-next-list-unit ${pathName === '/list-recipe' ? 'list-recipe-disabled-btn' : 'list-disabled-btn'}`}>
                                    <ArrowRightIcon></ArrowRightIcon>
                                </div>
                            </Swiper>

                            
                        </TableCell>
                }

                <MainButtons props={{ el:thisIngredient, recipe_id }}></MainButtons>



            </TableRow>

            {
                isMobile ?
                    <TableRow sx={{
                        ...mainIngrList, opacity: `${thisIngredient.shop_ingr ? 0.4 : 1}`, p: "0",
                        transition: 'height 300ms ease,',
                    }}>
                        <TableCell colSpan={4} sx={{
                            p: "0 !important", border: 'none',
                            minWidth: 0, width: '100%',
                            borderBottom:`2px solid ${pathName === '/list-recipe' ? '#1F2128' : '#353842'}`
                        }}>
                            <Collapse in={expandedId === thisIngredient._id} timeout={300}>
                                <Box sx={{
                                    position: 'relative', '& .slide-list-unit': { width: 'auto' }, '& .swiper-list-unit': {
                                        position: 'static',

                                        margin: '0 auto 15px'
                                    },
                                    overflow: 'hidden',
                                    transition: 'max-height 300ms ease',
                                    maxHeight: expandedId === thisIngredient._id ? '75px' : '0',
                                    pb: thisIngredient.units.length === 0 ? '15px' : '0'
                                }}>
                                    <Swiper
                                        navigation={{
                                            prevEl: '.custom-prev-list-unit',
                                            nextEl: '.custom-next-list-unit',

                                        }}
                                        className="swiper-list-unit adaptive-list-unit-swiper"
                                        modules={[ Navigation]}
                                        spaceBetween={10}
                                        slidesPerView={'auto'}
                                        style={{ 
                                            // width:'100%'
                                        }}
                                    >
                                        {
                                        thisIngredient.units.length === 0 ?
                                            <EmptyInfo mobileText={'13px'} right={'calc(50% - 70px)'}></EmptyInfo>
                                        :
                                        thisIngredient.units.map((elem: UnitsId) => (
                                            <SwiperSlide key={elem._id} className="slide-list-unit">
                                                <Units ingredient_id={thisIngredient._id} unit_id={elem._id} recipe_id={recipe_id}/>
                                            </SwiperSlide>


                                        ))}

                                        <div className={`custom-prev-list-unit ${pathName === '/list-recipe' ? 'list-recipe-disabled-btn' : 'list-disabled-btn'}`}>
                                            <ArrowLeftIcon></ArrowLeftIcon>
                                        </div>
                                        <div className={`custom-next-list-unit ${pathName === '/list-recipe' ? 'list-recipe-disabled-btn' : 'list-disabled-btn'}`}>
                                            <ArrowRightIcon></ArrowRightIcon>
                                        </div>
                                    </Swiper>
                                </Box>

                            </Collapse>
                        </TableCell>
                    </TableRow>
                    :
                    <></>

            }

        </>
    )
}, (prevProps, nextProps) => {
    const isRecipeIdEqual = 
        ('recipe_id' in prevProps && 'recipe_id' in nextProps)
        ? prevProps.recipe_id === nextProps.recipe_id
        : true;

    return prevProps.props.ingredient_id === nextProps.props.ingredient_id && 
    isRecipeIdEqual;
});


MainTableBody.displayName = "MainTableBody"


export default MainTableBody