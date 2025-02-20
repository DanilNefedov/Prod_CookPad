'use client'

import { IngredientFullData } from "@/app/types/types";
import { MouseEvent, useState } from "react";
import { Avatar, Box, Button, ListItemAvatar, ListItemText, Menu, MenuItem, Typography } from "@mui/material";
import { addListIngr, avatartIngredient, btnAddNew, btnListItem, containerContentSlide, menuListItems } from "@/app/(main)/cook/[recipe_id]/styles";
import { theme } from "@/config/ThemeMUI/theme";
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch } from "@/state/hook";
import { newUnitCookPage } from "@/state/slices/list-slice";


interface propsData {
    el: IngredientFullData,
    id: string 
}

interface returnData {
    choice:string,
    amount:number,
    _id:string
}


export function ItemsIngrSwiper({ props }: { props: propsData }) {
    const { el, id } = props
    const dispatch = useAppDispatch()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [units, setUnits] = useState<returnData[] | null>(null)
    const [method, setMethod] = useState<string>('')
    const open = Boolean(anchorEl);
    // const listStore = useAppSelector(state => state.list)


    

    const handleClick = async (event: MouseEvent<HTMLElement>) => {
        const choice = el.units.choice
           
        const url = `/api/cook/units?connection_id=${id}&name=${el.name}&choice=${choice}`

        setAnchorEl(event.currentTarget);

        const responseData = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!responseData.ok) {
            
            throw new Error('Server Error!');
        }
        

        const dataList = await responseData.json()

        if (dataList.unit_found) {

            setMethod('PATCH')
            setUnits(dataList.units)
            console.log('Данные получены:', dataList);

        } else if(dataList.unit_found === false) {

            setUnits(dataList.units)
            console.log(dataList)
            setMethod('PATCH')

        }else if(dataList.unit_found === null){

            setMethod('POST')
            console.log(dataList)
        }


    };
   


    const handleClose = () => {
        setAnchorEl(null);
    };



    function addNewUnit(el: IngredientFullData) {
        console.log(el)
        if (id !== '' ) {
            if(method === 'POST')
                {const dataUnit = {
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
                dispatch(newUnitCookPage({dataUnit, method}))
            }else if(method === 'PATCH'){
                const dataUnit = {
                    connection_id: id,
                    name: el.name,
                    units: {
                        choice: el.units.choice,
                        amount: el.units.amount,
                        shop_unit: false,
                    },
                }
                dispatch(newUnitCookPage({dataUnit, method}))
            }
            // dispatch(newUnitCookPage(data))
            setAnchorEl(null);
        }

    }





    //Number((0.2 + 0.1).toFixed(5))
    function addOldUnit(elem: returnData) {
        console.log('addOldUnit')
        
        // const amount = 'list' in el.units ? el.units.amount : ''

        // if (id && id !== null && typeof amount === 'number') {
        //     const data = {
        //         name:el.name,
        //         connection_id: id,
        //         old_id: elem._id,
        //         // ingredient_id:el.ingredient_id,
        //         new_amount: Number((amount + elem.amount).toFixed(5))
        //     }

        //     dispatch(updateCookUnit(data))
        //     setAnchorEl(null);
        // }


    }

    // console.log(units)
    return (
        <Box sx={containerContentSlide}>
            <ListItemAvatar sx={{width: '40px', height: '40px', borderRadius: '50%', minWidth:'0', m:'0 auto',
                [theme.breakpoints.down("md")]: {   
                    width:'30px',
                    height:'30px' 
                }
            }}>

                <Box sx={{
                    width: '100%', height: '100%',
                }} component="img"
                src={el.media !== '' ? el.media : '/images/load-ingr.svg'} alt={el.name}
                loading="lazy"></Box>
                {/* <Avatar
                    alt={el.name}
                    src={el.media !== '' ? el.media : '/images/load-ingr.svg'}
                    sx={avatartIngredient}
                /> */}
            </ListItemAvatar>
            <ListItemText
                primary={el.name}
                sx={{ textAlign: 'center', mb:'0', fontSize:'1.1rem',
                    '& span':{[theme.breakpoints.down("md")]: {
                       
                        fontSize:'14px'
                    },}
                }}
            />
            <Box sx={{ textAlign: 'center', opacity:'0.6', [theme.breakpoints.down("md")]: {
                    fontSize:'14px'
                }, }}>
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
                    {units !== null ? units.map(elem => (
                        <MenuItem key={elem._id} sx={menuListItems}>
                            <Typography sx={{ pr: '2px' }}>{elem.amount}</Typography>
                            <Typography sx={{ pr: '5px' }}>{elem.choice}</Typography>
                            <Button onClick={() => {
                                addOldUnit(elem)
                            }} sx={btnListItem}><AddIcon></AddIcon></Button>
                        </MenuItem>
                    )) :
                        <MenuItem disabled={true} sx={{ display: 'block', textAlign: 'center' }}>Nothing</MenuItem>
                    }
                    <MenuItem disabled={true} sx={{ opacity: "1 !important", display: 'block', pt: '0' }}>
                        <Typography sx={{ textAlign: 'center' }}>Or</Typography>
                    </MenuItem>

                    <Button onClick={() => addNewUnit(el)} sx={{ ...btnListItem, ...btnAddNew }}>Like a new</Button>
                </Menu>
            </Box>
        </Box>
    )
}