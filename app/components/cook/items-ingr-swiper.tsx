'use client'

import { MouseEvent, useState } from "react";
import { Alert, Box, Button, ListItemAvatar, ListItemText, Menu, MenuItem, Slide, SlideProps, Typography } from "@mui/material";
import { addListIngr, btnAddNew, btnListItem, containerContentSlide, menuListItems } from "@/app/(main)/cook/styles";
import { theme } from "@/config/ThemeMUI/theme";
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch } from "@/state/hook";
import { newIngredientList, newUnitIngredientList, updateCookUnit } from "@/state/slices/list-slice";
import { add, bignumber, } from "mathjs";
import { useSnackbar } from "notistack";
import { Ingredients, ReturnData } from "@/app/(main)/cook/types";


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
        <Box sx={containerContentSlide}>
            <ListItemAvatar sx={{
                width: '40px', height: '40px', borderRadius: '50%', minWidth: '0', m: '0 auto',
                [theme.breakpoints.down("md")]: {
                    width: '30px',
                    height: '30px'
                }
            }}>

                <Box sx={{
                    width: '100%', height: '100%',
                }} component="img"
                    src={el.media !== '' ? el.media : '/images/load-ingr.svg'} alt={el.name}
                    loading="lazy"></Box>
            </ListItemAvatar>
            <ListItemText
                primary={el.name}
                sx={{
                    textAlign: 'center', mb: '0', fontSize: '1.1rem',
                    '& span': {
                        [theme.breakpoints.down("md")]: {

                            fontSize: '14px'
                        },
                    }
                }}
            />
            <Box sx={{
                textAlign: 'center', opacity: '0.6', [theme.breakpoints.down("md")]: {
                    fontSize: '14px'
                },
            }}>
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
                        '& .MuiPaper-root': { backgroundColor: "#585B66" }, '@media (hover: hover) and (pointer: fine)': {
                            '& .MuiMenuItem-root:hover': {
                                backgroundColor: 'background.paper',
                                cursor: 'auto'
                            },
                        },
                        '& .MuiList-root': {
                            p: '5px 10px'
                        },

                    }}
                >
                    <MenuItem disabled={true} sx={{ opacity: "1 !important", display: 'block', minHeight: '0' }}>
                        <Typography sx={{ textAlign: 'center', [theme.breakpoints.down("md")]: { fontSize: '14px' } }}>Your List Units</Typography>
                    </MenuItem>
                    {units !== null ?
                        units.map(elem => (
                            <MenuItem key={elem._id} sx={menuListItems}>
                                <Typography sx={{ pr: '5px', [theme.breakpoints.down("md")]: { fontSize: '14px' } }}>{elem.amount}</Typography>
                                <Typography sx={{ pr: '5px', [theme.breakpoints.down("md")]: { fontSize: '14px' } }}>{elem.choice}</Typography>
                                <Button onClick={() => {
                                    addOldUnit(elem)
                                }} sx={btnListItem}><AddIcon sx={{ [theme.breakpoints.down("md")]: { width: '20px', height: '20px' } }}></AddIcon></Button>
                            </MenuItem>
                        ))
                        :
                        <MenuItem disabled sx={{ display: 'block', textAlign: 'center', color: 'text.primary', [theme.breakpoints.down("md")]: { fontSize: '14px' }, '&.Mui-disabled': { opacity: '1' } }}>Nothing</MenuItem>
                    }
                    <MenuItem disabled={true} sx={{ opacity: "1 !important", display: 'block', pt: '0', minHeight: "0" }}>
                        <Typography sx={{ textAlign: 'center', [theme.breakpoints.down("md")]: { fontSize: '14px' } }}>Or</Typography>
                    </MenuItem>

                    <Button disabled={method !== '' ? false : true} onClick={() => addNewUnit(el)} sx={{ ...btnListItem, ...btnAddNew }}>Like a new</Button>
                </Menu>
            </Box>
        </Box>
    )
}



