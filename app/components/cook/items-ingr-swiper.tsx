'use client'

import { MouseEvent, useState } from "react";
import { Alert, Box, Button, ListItemAvatar, ListItemText, Menu, MenuItem, Slide, SlideProps, Typography } from "@mui/material";
import { addListIngr, avatarIngr, boxOr, btnAddNew, btnListItem, buttonList, containerButtons, containerContentSlide, containerUnit, headerMenu, menuContainer, menuListItems, nameIngr } from "@/app/(main)/cook/styles";
import { theme } from "@/config/ThemeMUI/theme";
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch } from "@/state/hook";
import { newIngredientList, newUnitIngredientList, updateCookUnit } from "@/state/slices/list-slice";
import { add, bignumber, } from "mathjs";
import { useSnackbar } from "notistack";
import { Ingredients, ReturnData } from "@/app/(main)/cook/types";
import Image from "next/image";
import { textMaxWidth } from "@/app/styles";


interface Props {
    el: Ingredients,
    id: string
}


const SlideTransition = (props: SlideProps) => <Slide {...props} direction="down" />;


export function ItemsIngrSwiper({ props }: { props: Props }) {
    const { el, id } = props
    const dispatch = useAppDispatch()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [units, setUnits] = useState<ReturnData[] | null>(null)
    const [method, setMethod] = useState<'PATCH' | 'POST' | ''>('');
    const open = Boolean(anchorEl);
    

    const handleClick = async (event: MouseEvent<HTMLElement>) => {
        const choice = el.units.choice

        const url = `/api/cook/units?connection_id=${id}&name=${el.name}&choice=${choice}`

        setAnchorEl(event.currentTarget);

        const responseData = await fetch(url);

        if (!responseData.ok) {
            enqueueSnackbar('', {
                content: (key) => (
                    <Alert
                        severity="error"
                        onClose={() => closeSnackbar(key)}
                        sx={{ bgcolor: '#d32f2f', color: '#fff', '& .MuiSvgIcon-root': { fill: '#fff' } }}

                    >
                        Unit retrieval error.
                    </Alert>
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
        if (id !== '') {
            if (method === 'POST') {
                console.log('2')
                const dataUnit = {
                    connection_id: id,
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
                    connection_id: id,
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

        if (id !== '') {
            const data = {
                name: el.name,
                connection_id: id,
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
                <img
                    src={el.media !== '' ? el.media : '/images/load-ingr.svg'} 
                    alt={el.name}
                    loading="lazy"
                >
                </img>
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
                    {units !== null ?
                        units.map(elem => (
                            <MenuItem key={elem._id} sx={menuListItems}>
                                <Typography pr={'5px'}>{elem.amount}</Typography>
                                <Typography pr={'5px'}>{elem.choice}</Typography>
                                <Button onClick={() => {
                                    addOldUnit(elem)
                                }}>
                                    <AddIcon sx={{ [theme.breakpoints.down("md")]: { width: '20px', height: '20px' } }}></AddIcon>
                                </Button>
                            </MenuItem>
                        ))
                        :
                        <MenuItem disabled sx={{ display: 'block', textAlign: 'center', color: 'text.primary', [theme.breakpoints.down("md")]: { fontSize: '14px' }, '&.Mui-disabled': { opacity: '1' } }}>Nothing</MenuItem>
                    }
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



