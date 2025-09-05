import { Box, TextField, Typography } from "@mui/material";
import { SkeletonInfo } from "../SkeletonInfo";
import { textMaxWidth } from "@/app/styles";
import { nameRecipe } from "@/app/(main)/cook/styles";
import { useAppSelector } from "@/state/hook";
import { memo, useState } from "react";



interface Props {
    name:string
    isEditing:boolean
}



const Name = memo(({name, isEditing}:Props) => {
    const recipeStatus = useAppSelector(state => state.cook.operations.fetchCook.loading)
    const [localName, setLocalName] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalName(e.target.value);
    };
    console.log(name, localName)

    return(
        isEditing ? (
            <Box sx={{display:'flex', justifyContent:'center', height: '38px'}}>
                <TextField
                    variant="outlined"
                    value={localName === '' ? name : localName}
                    onChange={handleChange}
                    size="small"
                    sx={[textMaxWidth, {
                        height: '37px',
                        '& .MuiOutlinedInput-root': {
                            height: '100%',
                            fontSize: '2rem',
                            lineHeight: '37px',
                            boxSizing: 'border-box',
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderWidth: '0 0 1px 0',
                                borderRadius: 0,
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderWidth: '0 0 2px 0',
                            },
                        },
                        '& .MuiInputBase-input': {
                            height: '100%',
                            padding: 0,
                            textAlign: 'center',
                            boxSizing: 'border-box',
                        },
                    }]}
                />
            </Box>
            
        ) : (
            <Typography variant="h2" sx={[textMaxWidth, nameRecipe]}>
                <SkeletonInfo loading={recipeStatus}>{name}</SkeletonInfo>
            </Typography>
        )
    )
}, (prevProps, nextProps) => {
    return prevProps.isEditing === nextProps.isEditing && 
    prevProps.name === nextProps.name 
})

Name.displayName = "Name"

export default Name