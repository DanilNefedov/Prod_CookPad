'use client'


import { useAppDispatch, useAppSelector } from "@/state/hook";
import { popularFetch } from "@/state/slices/popular-slice";
import { useEffect } from "react";
import { Swiper } from "swiper/types";








export function MainPopular() {
    const dispatch = useAppDispatch()
    const popularData = useAppSelector(state => state.popular)
    const userData = useAppSelector(state => state.user)
    const connection_id = userData?.user?.connection_id

    
    useEffect(() => {
        if (connection_id !== '') {
            dispatch(popularFetch({ id: connection_id, count: 10 }))
        }
    }, [connection_id])


    console.log(popularData)
    return (
        <div className="">Main popular</div>
    )
}