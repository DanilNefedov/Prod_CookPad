'use client'

import { IngredientForState } from "@/app/types/types";
import { useAppDispatch } from "@/state/hook";
import { MouseEvent, useState } from "react";
import { getUnits, returnData } from "./func/modal-fetch-units";
import { Avatar, Box, Button, ListItemAvatar, ListItemText, Menu, MenuItem, Typography } from "@mui/material";
import { addListIngr, avatartIngredient, containerContentSlide, menuListItems } from "@/app/(main)/cook/[recipe_id]/styles";


interface propsData {
    el: IngredientForState,
    id: string 
}


export function ItemsIngrSwiper({ props }: { props: propsData }) {
    const { el, id } = props
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [units, setUnits] = useState<returnData[]>([])
    const open = Boolean(anchorEl);
    // const listStore = useAppSelector(state => state.list)


    const handleClick = async (event: MouseEvent<HTMLElement>) => {
        const choice = 'list' in el.units && el.units.choice !== ''
            ? el.units.choice
            : ''
        const url = `/api/cook/get-units?connection_id=${id}&name=${el.name}&choice=${choice}`

        setAnchorEl(event.currentTarget);

        const responseData = await getUnits(url)
        setUnits(responseData)
        // console.log(responseData)

    };


    const handleClose = () => {
        setAnchorEl(null);
    };



    // function addNewUnit(el: IngredientForState) {
    //     console.log(el)
    //     if (id !== null ) {
    //         const data = {
    //             connection_id: id,
    //             el
    //         }
    //         dispatch(newUnitCookPage(data))
    //         setAnchorEl(null);
    //     }

    // }

    //Number((0.2 + 0.1).toFixed(5))
    // function addOldUnit(elem: returnData) {
        
    //     const amount = 'list' in el.units ? el.units.amount : ''

    //     if (id && id !== null && typeof amount === 'number') {
    //         const data = {
    //             name:el.name,
    //             connection_id: id,
    //             old_id: elem._id,
    //             // ingredient_id:el.ingredient_id,
    //             new_amount: Number((amount + elem.amount).toFixed(5))
    //         }

    //         dispatch(updateCookUnit(data))
    //         setAnchorEl(null);
    //     }


    // }

    // console.log(units)
    return (
        <Box sx={containerContentSlide}>
            <ListItemAvatar >
                <Avatar
                    alt={el.name}
                    src={el.media !== '' ? el.media : '/images/load-ingr.svg'}
                    sx={avatartIngredient}
                />
            </ListItemAvatar>
            <ListItemText
                primary={el.name}
                sx={{ textAlign: 'center' }}
            />
            <Box sx={{ textAlign: 'center' }}>
                <span
                >
                    {'list' in el.units && el.units.amount !== 0
                        ? el.units.amount
                        : ''}
                </span>
                <span
                >
                    {'list' in el.units && el.units.choice !== ''
                        ? el.units.choice
                        : ''}
                </span>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                {/* <Button sx={addListIngr} onClick={() => addlistRecipe(el)}>Add to List</Button> */}

                <Button
                    sx={addListIngr}
                    id="demo-positioned-button"
                    aria-controls={open ? 'demo-positioned-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                >
                    To List
                </Button>
                <Menu
                    id="demo-positioned-menu"
                    aria-labelledby="demo-positioned-button"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    sx={{
                        '& .MuiPaper-root': { backgroundColor: "#585B66" }, '& .MuiMenuItem-root:hover': {
                            backgroundColor: 'background.paper',
                            cursor: 'auto'
                        },
                        '& .MuiList-root': {
                            p: '5px 10px'
                        },

                    }}
                >
                    <MenuItem disabled={true} sx={{ opacity: "1 !important", display: 'block' }}>
                        <Typography sx={{ textAlign: 'center' }}>Your List Units</Typography>
                    </MenuItem>
                    {units.length > 0 ? units.map(elem => (
                        <MenuItem key={elem._id} sx={menuListItems}>
                            <Typography sx={{ pr: '2px' }}>{elem.amount}</Typography>
                            <Typography sx={{ pr: '5px' }}>{elem.choice}</Typography>
                            {/* <Button onClick={() => {
                                addOldUnit(elem)
                                }} sx={btnListItem}><AddIcon></AddIcon></Button> */}
                        </MenuItem>
                    )) :
                        <MenuItem disabled={true} sx={{ display: 'block', textAlign: 'center' }}>Nothing</MenuItem>
                    }
                    <MenuItem disabled={true} sx={{ opacity: "1 !important", display: 'block', pt: '0' }}>
                        <Typography sx={{ textAlign: 'center' }}>Or</Typography>
                    </MenuItem>

                    {/* <Button onClick={() => addNewUnit(el)} sx={{ ...btnListItem, ...btnAddNew }}>Like a new</Button> */}
                </Menu>
            </Box>
        </Box>
    )
}