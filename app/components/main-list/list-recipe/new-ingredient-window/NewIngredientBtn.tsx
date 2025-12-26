import { useAppDispatch, useAppSelector } from "@/state/hook";
import { Box, Button, Popover, Typography } from "@mui/material";
import { useState } from "react";
import { ContainerCreation } from "./ContainerCreation";
import { newIngredient } from "@/state/slices/list-recipe-form";
import { MainButtons } from "./MainButtons";
import { popoverCreating } from "@/app/(main)/(main-list)/list/styles";



interface Props {
    recipeId:string
}



export function NewIngredientBtn({recipeId}:Props) {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const ingredientsForm = useAppSelector(state => state.formListRecipe[recipeId])
    const dispatch = useAppDispatch()


    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);

        if(!ingredientsForm){
            dispatch(newIngredient({recipeId}))
        }
        
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    console.log(ingredientsForm, useAppSelector(state => state.formListRecipe))
    return (
        <>
            <Button
                aria-describedby={id} 
                onClick={handleClick}
                color="blackRedBtn"
            >
                Create
            </Button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}

                slotProps={{
                    paper: {
                        sx: [popoverCreating, {p:'0 15px', bgcolor:'background.default'}],
                    },
                }}  
            >
                <Typography sx={{mt:'20px'}}>At least 1 ingredient completely filled</Typography>
                {
                    ingredientsForm !== undefined 
                    ?
                    ingredientsForm.map(el =>(
                        <ContainerCreation 
                            key={el.ingredient_id}
                            ingredient_id={el.ingredient_id} 
                            length={ingredientsForm.length}
                            recipeId={recipeId}
                        >
                        </ContainerCreation>
                    ))
                    :
                    null
                }

                <MainButtons recipeId={recipeId}></MainButtons>
            </Popover>
        </>
    )
}