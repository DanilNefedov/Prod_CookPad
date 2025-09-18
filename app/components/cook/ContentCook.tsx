"use client"

import { containerContent, containerIngr, containerSwiperInfo,mediaContainer, scrollContainer, 
    secondHeader, skeletonIngredients, swiperContainer} from "@/app/(main)/cook/styles";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { Box, Skeleton, Typography } from "@mui/material";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/grid';
import './styles.css';
import { useEffect, useState } from "react";
import { changeNewInfo, fetchCook } from "@/state/slices/cook-slice";
import { usePathname } from "next/navigation";
import { skeletonSwiperCook } from "@/app/styles";
import SwiperMediaCook from "./SwiperMedia";
import dynamic from "next/dynamic";
import ActionInfoRecipe from "./ActionInfoRecipe";
import Instruction from "./edit/Instruction";

const IngredientSwiper = dynamic(() => import("./IngredientSwiper"), { 
    ssr: false ,
    loading: () => (
        <Skeleton 
        variant="rectangular" 
        sx={skeletonIngredients} 
        />
    ),
});





export function ContentCook() {
    const pathName = usePathname()
    const segments = pathName.split("/");
    const recipe_id = segments[2];
    const [isEditing, setIsEditing] = useState(false);

    const dispatch = useAppDispatch()
    const hasCookRecipe = useAppSelector(state => Boolean(state.cook.recipes[recipe_id]));
    const recipeIngredients = useAppSelector(state => state.cook.recipes[recipe_id]?.ingredients)
    const user_id = useAppSelector(state => state.user.user.connection_id)
    const recipeStatus = useAppSelector(state => state.cook.operations.fetchCook.loading)

    
    useEffect(() => {
        if (!user_id) return; 
        if (!hasCookRecipe) {
            dispatch(fetchCook({ id: user_id, recipe_id }));
        }
    }, [recipe_id, hasCookRecipe, user_id, dispatch]);


    const handleEdit = () => {
        if(isEditing){
            dispatch(changeNewInfo({recipe_id, user_id}))
        }
        setIsEditing(prev => !prev);
    };


    const handleEdit = () => {
        if(isEditing){
            dispatch(changeNewInfo({recipe_id, user_id}))
        }
        setIsEditing(prev => !prev);
    };


    return (
        <Box sx={containerContent}>
            <Box sx={scrollContainer}>
                <Box sx={containerSwiperInfo}>
                    {
                        recipeStatus ? 
                        <Skeleton variant="rectangular" sx={[mediaContainer, skeletonSwiperCook]}/>
                        :
                        <SwiperMediaCook recipe_id={recipe_id}></SwiperMediaCook>
                    }

                
                    <ActionInfoRecipe isEditing={isEditing} handleEdit={handleEdit} recipe_id={recipe_id}></ActionInfoRecipe>
                </Box>

                <Box sx={containerIngr}>
                    <Typography variant="h3" sx={secondHeader}>Ingredients</Typography>
                    <Box sx={swiperContainer}> 
                        {
                            recipeIngredients?.length > 0 ?
                            (<IngredientSwiper recipe_id={recipe_id}></IngredientSwiper>)
                            :
                            <Skeleton variant="rectangular" sx={skeletonIngredients}/>
                        }
                    </Box>
                    <Box>
                        <Typography variant="h3" sx={secondHeader}>Instruction</Typography>
                        
                        <Instruction isEditing={isEditing} recipe_id={recipe_id}></Instruction>
                    </Box>
                </Box>
            </Box>

        </Box >
    )
}