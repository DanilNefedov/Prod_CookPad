import { descriptionInstruction, instruction } from "@/app/(main)/cook/styles"
import { useAppDispatch, useAppSelector } from "@/state/hook"
import { changeInstruction } from "@/state/slices/cook-slice"
import { Skeleton, TextField, Typography } from "@mui/material"
import { ChangeEvent, memo } from "react"





interface Props {
    recipe_id:string 
    isEditing:boolean
}


const Instruction = memo(({recipe_id, isEditing}:Props) => {
    const recipeStatus = useAppSelector(state => state.cook.operations.fetchCook.loading)
    const recipeInstruction = useAppSelector(state => state.cook.recipes[recipe_id]?.instruction)
    const modifiedInstruction = useAppSelector(state => state.cook.modified.instruction)
    const dispatch = useAppDispatch()


    function handleChange(e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>){
        const value = e.target.value;

        if (value.length > 300) {
            return; 
        }

        dispatch(changeInstruction({recipe_id, instruction:value}))
    }

    return(
        <Typography component='span' variant="body1" sx={[descriptionInstruction, instruction]}>

            {
                isEditing ? 
                    <TextField
                        id="outlined-multiline-flexible"
                        value={modifiedInstruction === '' ? recipeInstruction : modifiedInstruction}
                        multiline
                        name="instruction"
                        maxRows={8}
                        minRows={4}
                        onChange={handleChange}
                        sx={{
                            width:'100%',
                            ml:'5px',
                            '& .MuiInputBase-root':{
                                p:'0'
                            }
                        }}
                    />
                :
                recipeStatus ? 
                    <Skeleton variant="text" height={80}></Skeleton>
                    :
                    <>{recipeInstruction}</>
                        
            }

            
            
        </Typography>
    )

}, (prevProps, nextProps) => {
    return prevProps.isEditing === nextProps.isEditing && 
    prevProps.recipe_id === nextProps.recipe_id 
})

Instruction.displayName = "Instruction"

export default Instruction