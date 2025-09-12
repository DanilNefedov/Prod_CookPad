import { descriptionInstruction } from "@/app/(main)/cook/styles";
import { TextField, Typography } from "@mui/material";
import { ChangeEvent, memo } from "react";
import { SkeletonInfo } from "../SkeletonInfo";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { changeDescription } from "@/state/slices/cook-slice";




interface Props {
    recipe_id:string,
    isEditing:boolean
}



const Description = memo(({recipe_id, isEditing}:Props) => {
    const recipeStatus = useAppSelector(state => state.cook.operations.fetchCook.loading)
    const recipeDescription = useAppSelector(state => state.cook.recipes[recipe_id]?.description)
    const modifiedDescription = useAppSelector(state => state.cook.modified.description)
    const dispatch = useAppDispatch()


    function handleChange(e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>){
        const value = e.target.value;

        if (value.length > 150) {
            return; 
        }

        dispatch(changeDescription({recipe_id, description:value}))
    }

    console.log('description')

    return(
        <Typography component='span' sx={[descriptionInstruction, {display:'flex'}]} variant="body1">
            Description:
            {isEditing ?
                <TextField
                    id="outlined-multiline-flexible"
                    value={modifiedDescription === '' ? recipeDescription : modifiedDescription}
                    multiline
                    name="description"
                    maxRows={8}
                    minRows={4}
                    // helperText='max lenght 150 symbols'
                    onChange={e => handleChange(e)}
                    sx={{
                        width:'70%',
                        ml:'5px',
                        '& .MuiInputBase-root':{
                            p:'0'
                        }
                    }}
                />
            :
                <SkeletonInfo loading={recipeStatus}> {recipeDescription}</SkeletonInfo>
            }
        </Typography>
        
    )
}, (prevProps, nextProps) => {
    return prevProps.isEditing === nextProps.isEditing && 
    prevProps.recipe_id === nextProps.recipe_id 
})

Description.displayName = "Description"

export default Description