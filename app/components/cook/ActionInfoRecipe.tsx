import { actionBtns, actionInfoBox, containerInfo, containerTime } from "@/app/(main)/cook/styles";
import { betweenCenter, columnSpaceBetween, favoriteBtnActive, favoriteBtnDesactive } from "@/app/styles";
import { Box, Button, IconButton, Popover, Typography } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { setFavoriteRecipe } from "@/state/slices/recipe-slice";
import { memo, MouseEvent, useState } from "react";
import { newListRecipe } from "@/state/slices/list-recipe-slice";
import Name from "./edit/Name";
import Type from "./edit/Type";
import Description from "./edit/Description";
import Time from "./edit/Time";
import InfoIcon from '@mui/icons-material/Info';



interface Props {
    recipe_id: string
    isEditing: boolean
    handleEdit: () => void
}



const ActionInfoRecipe = memo(({ recipe_id, isEditing, handleEdit }: Props) => {
    const favoriteStatus = useAppSelector(state => state.recipe.operations.setFavoriteRecipe.loading)
    const favoriteRecipe = useAppSelector(state => state.cook.recipes[recipe_id]?.favorite)
    const user_id = useAppSelector(state => state.user.user.connection_id)
    const isListLoading = useAppSelector((state) => state.listRecipe.operations.newListRecipe.loading)
    const modifiedError = useAppSelector(state => state.cook.modifiedError)
    const dispatch = useAppDispatch()
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const id = Boolean(anchorEl) ? 'edit-error' : undefined

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleFavorite = ({ recipe_id }: { recipe_id: string | undefined }): void => {
        if (favoriteStatus) return

        if (recipe_id !== '' && recipe_id) {
            const data = { recipe_id, favorite: favoriteRecipe }
            dispatch(setFavoriteRecipe(data))
        }
    }

    function addToList() {
        if (isListLoading) return

        if (user_id !== '' && recipe_id) {
            dispatch(newListRecipe({ connection_id: user_id, recipe_id: recipe_id }))
        }
    }


    return (
        <Box sx={[columnSpaceBetween, actionInfoBox]}>
            <Box sx={containerInfo}>

                <Name recipe_id={recipe_id} isEditing={isEditing}></Name>

                <Type recipe_id={recipe_id} isEditing={isEditing}></Type>

                <Box sx={containerTime}>

                    <Time recipe_id={recipe_id} isEditing={isEditing}></Time>

                </Box>

                <Description recipe_id={recipe_id} isEditing={isEditing}></Description>

            </Box>


            <Box sx={betweenCenter}>
                <Button color="grayButton" sx={actionBtns} onClick={addToList}>To List</Button>

                <Box sx={{ position: 'relative' }}>
                    <Button
                        color={isEditing ? 'blackRedBtn' : "grayButton"}
                        sx={actionBtns}
                        onClick={handleEdit}
                        disabled={modifiedError.length > 0}
                    >
                        {isEditing ? 'Accept' : 'Edit'}
                    </Button>

                    {
                        modifiedError.length > 0 &&
                        <Box sx={{ position: 'absolute', top: '-5px', right: '-25px' }}>
                            <IconButton aria-describedby={id} onClick={handleClick} color='error'>
                                <InfoIcon sx={{ width: '20px', height: '20px' }}></InfoIcon>
                            </IconButton>
                            <Popover
                                id={id}
                                open={Boolean(anchorEl)}
                                anchorEl={anchorEl}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                slotProps={{
                                    paper: {
                                        sx: {
                                            borderRadius: '10px',
                                        }
                                    }
                                }}
                            >
                                <Typography sx={{ maxWidth: '250px', p: '10px', '& span':{fontWeight:800} }}>
                                    Please fix the following fields: <span>{modifiedError.join(', ')}</span>
                                </Typography>
                            </Popover>
                        </Box>
                    }
                </Box>



                <IconButton sx={{ padding: '0', mr: '20px' }} aria-label="add to favorites" onClick={() => handleFavorite({ recipe_id })}>
                    <FavoriteIcon sx={favoriteRecipe ? favoriteBtnActive : favoriteBtnDesactive} />
                </IconButton>
            </Box>

        </Box>

    )
}, (prevProps, nextProps) => {
    return prevProps.isEditing === nextProps.isEditing &&
        prevProps.recipe_id === nextProps.recipe_id
})


ActionInfoRecipe.displayName = "ActionInfoRecipe"

export default ActionInfoRecipe