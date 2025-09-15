import { Box, Collapse, ListItemText, TableCell, TableRow, Tooltip, Typography } from "@mui/material"
import { memo, useMemo, useState } from "react"
import { ingredientImage, ingredientImageBox, ingredientNameBox, ingredientRow, mobileUnitBoxSwiper, mobileUnitCell, 
    mobileUnitIcon, mobileUnitInfoBox, mobileUnitRow, mobileUnitText, nameIngredient, unitBox, unitBoxDesktop } from "@/app/(main)/(main-list)/styles"
import { Swiper, SwiperSlide } from "swiper/react"
import useMediaQuery from "@mui/material/useMediaQuery";
import { useAppSelector } from "@/state/hook"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import './list/styles.css';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { usePathname } from "next/navigation"
import { EmptyInfo } from "../ui-helpers/EmptyInfo"
import { centerFlexBlock, textMaxWidth } from "@/app/styles"
import { theme } from "@/config/ThemeMUI/theme"
import UnitContext from "@/config/unit-context/UnitContext"
import MainButtons from "./MainButtons"
import { IngredientUnit } from "./IngredientUnit"





interface Props {
    ingredient_id: string,
    recipe_id?: string
}

const MainTableBody = memo(({ props }: { props: Props }) => {
    const { ingredient_id, recipe_id } = props;

    const thisIngredient = useAppSelector(state => {
        if (recipe_id) {
            return state.listRecipe.ingredients[ingredient_id];
        }
        return state.list.ingredients[ingredient_id];
    });

    const ingredient_shop = useAppSelector(state => {
        if (recipe_id) {
            return state.listRecipe.ingredients[ingredient_id]?.shop_ingr ?? false;
        }
        return state.list.ingredients[ingredient_id]?.shop_ingr ?? false;
    });
     
    const isMobile = useMediaQuery("(max-width:800px)");
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const pathName = usePathname()


    const handleToggle = (id: string) => {
        setExpandedId((prevId) => (prevId === id ? null : id));
    }


    const contextValues = useMemo(() => {

        return thisIngredient.unit_ids.map((elem) => ({
            recipe_id,
            ingredient_id: thisIngredient.ingredient_id,
            unit_id: elem,
        }));
    }, [recipe_id, thisIngredient.ingredient_id, thisIngredient.unit_ids]);


    if (!thisIngredient) return null;

    return (
        <>
            <TableRow sx={[ingredientRow, {
                opacity: `${ingredient_shop ? 0.4 : 1}`,
                '& .MuiTableCell-root': {
                    borderBottom: `${isMobile ? 'none' : '5px solid'}`,
                    borderColor: `${pathName === '/list-recipe' ? 'background.default' : 'background.paper'}`
                },

            }]}>
                <TableCell 
                    onClick={() => { 
                        if (isMobile) handleToggle(thisIngredient.ingredient_id) 
                    }} 
                    sx={[ingredientImageBox, ]}
                >
                    <Box sx={[centerFlexBlock, ]}>
                        <Box 
                            component={'img'} 
                            src={thisIngredient.media !== '' ? thisIngredient.media : '/images/load-ingr.svg'} 
                            alt={thisIngredient.name} 
                            sx={ingredientImage}
                        ></Box>
                    </Box>
                </TableCell>
                <TableCell 
                    onClick={() => { 
                        if (isMobile) handleToggle(thisIngredient.ingredient_id) 
                    }} 
                    sx={ingredientNameBox}
                >
                    {isMobile ?
                        <ListItemText
                            sx={[nameIngredient, {'& span':textMaxWidth}]}
                            primary={thisIngredient.name}
                        />
                        :
                        <Tooltip title={thisIngredient.name} sx={{ display: isMobile ? 'block' : 'none' }} arrow>
                            <ListItemText
                                sx={[nameIngredient, {'& span':textMaxWidth}]}
                                primary={thisIngredient.name}
                            />
                        </Tooltip>
                    }
                </TableCell>


                {
                    isMobile ?
                        <TableCell 
                            onClick={() => { 
                                if (isMobile) handleToggle(thisIngredient.ingredient_id) 
                            }} 
                            sx={unitBox}
                        >
                            <Box sx={mobileUnitInfoBox}>
                                <Typography sx={[mobileUnitText, textMaxWidth]}>x{thisIngredient.unit_ids.length}</Typography>
                                <ExpandMoreIcon sx={[
                                    mobileUnitIcon,
                                    {transform: expandedId === thisIngredient.ingredient_id ? "rotate(180deg)" : "rotate(0deg)"}
                                ]}></ExpandMoreIcon>
                            </Box>
                        </TableCell>

                        :
                        <TableCell 
                        sx={[unitBox, unitBoxDesktop]}>
                            <Swiper
                                navigation={{
                                    prevEl: '.custom-prev-list-unit',
                                    nextEl: '.custom-next-list-unit',

                                }}
                                className="swiper-list-unit"
                                slidesPerView={'auto'}
                                modules={[Navigation]}
                                // spaceBetween={10}
                                breakpoints={{
                                    500: {
                                        spaceBetween: 10,
                                    },
                                    0: {
                                        spaceBetween: 5,
                                    }
                                }}
                                style={{ 
                                //    width:'100%'
                                }}
                            >
                                {
                                thisIngredient.unit_ids.length === 0 ?
                                    <EmptyInfo></EmptyInfo>
                                : 
                                
                                contextValues.map((contextValue,) => (
                                    <SwiperSlide
                                        key={contextValue.unit_id}
                                        className="slide-list-unit"
                                        style={{ width: 'auto', maxWidth: '100%' }}
                                    >
                                        <UnitContext.Provider value={contextValue}>
                                            <IngredientUnit />
                                        </UnitContext.Provider>
                                    </SwiperSlide>
                                )
                                )}
                                

                                <div className={`custom-prev-list-unit ${pathName === '/list-recipe' ? 'list-recipe-disabled-btn' : 'list-disabled-btn'}`}>
                                    <ArrowLeftIcon></ArrowLeftIcon>
                                </div>
                                <div className={`custom-next-list-unit ${pathName === '/list-recipe' ? 'list-recipe-disabled-btn' : 'list-disabled-btn'}`}>
                                    <ArrowRightIcon></ArrowRightIcon>
                                </div>
                            </Swiper>
                        </TableCell>
                }

                <MainButtons ingredient_id={ingredient_id} recipe_id={recipe_id} ingredient_shop={ingredient_shop}></MainButtons>
            
            </TableRow>

            {
                isMobile ?
                    <TableRow 
                        sx={[
                            mobileUnitRow, 
                            {opacity: `${thisIngredient.shop_ingr ? 0.4 : 1}`,
                            }
                                
                        ]}
                    >
                        <TableCell colSpan={4} 
                            sx={[
                                mobileUnitCell,
                                {borderBottom:`3px solid ${
                                    pathName === '/list-recipe'
                                    ? theme.palette.background.default
                                    : theme.palette.background.paper
                                }`}
                            ]}
                        >
                            <Collapse in={expandedId === thisIngredient.ingredient_id} timeout={300}>
                                <Box sx={[
                                    mobileUnitBoxSwiper,
                                    {
                                        '& .swiper-list-unit': {
                                            width: `${pathName === '/list-recipe' ? 'calc(100dvw - 155px)' : 'calc(100dvw - 120px)'}`,
                                            [theme.breakpoints.down('sm')]: { 
                                                width: `${pathName === '/list-recipe' ? 'calc(100dvw - 85px)' : 'calc(100dvw - 65px)'}`,
                                            }
                                        }
                                    }
                                ]}>
                                    <Swiper
                                        navigation={{
                                            prevEl: '.custom-prev-list-unit',
                                            nextEl: '.custom-next-list-unit',

                                        }}
                                        className="swiper-list-unit adaptive-list-unit-swiper"
                                        modules={[Navigation]}
                                        breakpoints={{
                                            600: {
                                                spaceBetween: 10,
                                            },
                                            0: {
                                                spaceBetween: 5,
                                            }
                                        }}
                                        slidesPerView={'auto'}
                                        style={{ 
                                            // width:'100%'
                                        }}
                                    >
                                        {
                                        thisIngredient?.unit_ids.length === 0 ?
                                            <EmptyInfo mobileText={'13px'} right={'calc(50% - 70px)'}></EmptyInfo>
                                        :
                                        contextValues.map((contextValue) => (
                                                <SwiperSlide
                                                    key={contextValue.unit_id}
                                                    className="slide-list-unit"
                                                >
                                                    <UnitContext.Provider value={contextValue}>
                                                        <IngredientUnit />
                                                    </UnitContext.Provider>
                                                </SwiperSlide>
                                            )
                                        )
                                        }

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