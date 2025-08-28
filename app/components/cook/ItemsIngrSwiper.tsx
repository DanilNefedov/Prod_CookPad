'use client'

import { MouseEvent, useState } from "react";
import { Alert, Avatar, Box, Button, Chip, ListItemAvatar, ListItemText, Menu, 
    MenuItem, Slide, SlideProps, Stack, Typography } from "@mui/material";
import { addIcon, avatarImg, avatarIngr, boxOr, buttonList, chipMenu, containerButtons, containerUnit, 
    emptyUnits, headerMenu, menuContainer, menuListItems, nameIngr, scrollItems } from "@/app/(main)/cook/styles";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { newIngredientList, newUnitIngredientList, updateCookUnit } from "@/state/slices/list-slice";
import { add, bignumber, } from "mathjs";
import { useSnackbar } from "notistack";
import { Ingredients, ReturnData } from "@/app/(main)/cook/types";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { alertMui, hideScroll } from "@/app/styles";


interface Props {
    el: Ingredients,
}


const SlideTransition = (props: SlideProps) => <Slide {...props} direction="down" />;


export function ItemsIngrSwiper({ props }: { props: Props }) {
    const { el } = props
    const user_id = useAppSelector(state => state.user.user.connection_id)
    const dispatch = useAppDispatch()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [units, setUnits] = useState<ReturnData[] | null>(null)
    const [method, setMethod] = useState<'PATCH' | 'POST' | ''>('');
    const open = Boolean(anchorEl);
    

    const handleClick = async (event: MouseEvent<HTMLElement>) => {
        const choice = el.units.choice

        const url = `/api/cook/units?connection_id=${user_id}&name=${el.name}&choice=${choice}`

        setAnchorEl(event.currentTarget);

        const responseData = await fetch(url);

        if (!responseData.ok) {
            enqueueSnackbar('', {
                content: (key) => (
                    <Stack>
                       <Alert
                            severity="error"
                            onClose={() => closeSnackbar(key)}
                            sx={alertMui}
                        >
                            Unit retrieval error.
                        </Alert> 
                    </Stack>
                    
                ),
                persist: true, 
                anchorOrigin: { vertical: 'top', horizontal: 'center' },
                TransitionComponent: SlideTransition,
            });
            return;
        }


        const dataList = await responseData.json()

        if (dataList.unit_found) {

            setMethod('PATCH')
            setUnits(dataList.units)

        } else if (dataList.unit_found === false) {
            setMethod('PATCH')
            setUnits(dataList.units)


        } else if (dataList.unit_found === null) {
            setMethod('POST')
        }


    };



    const handleClose = () => {
        setAnchorEl(null);
        setMethod('')
    };

    

    function addNewUnit(el: Ingredients) {
        if (user_id !== '') {
            if (method === 'POST') {
                const dataUnit = {
                    connection_id: user_id,
                    name: el.name,
                    media: el.media,
                    shop_ingr: false,
                    units: [{
                        choice: el.units.choice,
                        amount: el.units.amount,
                        shop_unit: false,
                    }],
                    list: [...el.units.list]
                }
                dispatch(newIngredientList(dataUnit));

            } else if (method === 'PATCH') {
                const dataUnit = {
                    connection_id: user_id,
                    name: el.name,
                    units: {
                        choice: el.units.choice,
                        amount: el.units.amount,
                        shop_unit: false,
                    },
                }
                dispatch(newUnitIngredientList(dataUnit));
            }
        }
        handleClose()
    }





    function addOldUnit(elem: ReturnData) {
        const sum = add(bignumber(el.units.amount), bignumber(elem.amount));
        const newAmount  = Number(sum.toFixed(5));

        if (user_id !== '') {
            const data = {
                name: el.name,
                connection_id: user_id,
                _id: elem._id,
                amount: newAmount 
            }

            dispatch(updateCookUnit(data))
            handleClose()
        }
    }

    return (
        <Box sx={{p:'5px'}}>
            <ListItemAvatar sx={avatarIngr}>
                <Avatar
                    sx={avatarImg}
                    slotProps={{
                        img: {
                            alt: el.name,
                        },
                    }}
                    src={el.media !== '' ? el.media : '/images/load-ingr.svg'} 
                >
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={el.name}
                sx={nameIngr}
            />
            <Box sx={containerUnit}>
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

            <Box sx={containerButtons}>

                <Button
                    sx={buttonList}
                    id="demo-positioned-button"
                    aria-controls={open ? 'demo-positioned-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    color="blackBtn"
                >
                    To List
                </Button>

                <Menu
                    id="demo-positioned-menu"
                    aria-labelledby="demo-positioned-button"
                    anchorEl={anchorEl}
                    open={open}
                    // open
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    sx={menuContainer}
                >
                    <MenuItem disabled={true} sx={headerMenu}>
                        <Typography align="center">Your List Units</Typography>
                    </MenuItem>
                    <Box component='li'>
                        <Box component='ul' sx={[scrollItems, hideScroll]}>
                            {units !== null ?
                                units.map(elem => (
                                    <Box component='li' key={elem._id} sx={menuListItems}>
                                        <Chip
                                            color="secondary"
                                            label={`${elem.amount} ${elem.choice}`}
                                            sx={chipMenu}
                                            onDelete={() => addOldUnit(elem)}
                                            deleteIcon={<AddCircleIcon sx={[addIcon]}/>}
                                        />
                                    </Box>
                                ))
                                :
                                <MenuItem disabled sx={emptyUnits}>Nothing</MenuItem>
                            }
                        </Box>
                        
                    </Box>
                    
                    <MenuItem disabled={true} sx={boxOr}>
                        <Typography align="center">Or</Typography>
                    </MenuItem>

                    <Button 
                        disabled={method !== '' ? false : true} onClick={() => addNewUnit(el)}
                        color="grayButton" 
                        sx={{width:"100%"}}
                    >Like a new</Button>
                </Menu>
            </Box>
        </Box>
    )
}



