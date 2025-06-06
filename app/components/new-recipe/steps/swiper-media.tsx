
import { MediaObj } from "@/app/types/types";
import { CardMedia } from "@mui/material";
import { memo } from "react";




interface propsData {
    el: MediaObj,
}


export const SwiperStepMedia = memo(({ props }: { props: propsData }) => {
    const { el } = props

    return (
        <>
        {
            el.media_type === 'image' ?
            <CardMedia
                sx={{
                    height: '100%',
                    objectFit: 'cover',
                    width:"100%"
                }}
                component='img'
                src={el.media_url as string}
                loading="lazy"
            />
            :
            <CardMedia
                sx={{
                    width:"100%",
                    height: '100%',
                    objectFit: 'cover',
                }}
                component='video'
                autoPlay
                loop
                muted
                poster={el.media_url as string}
            >
                <source
                    src={el.media_url as string}
                    type="video/mp4"
                />
            </CardMedia>
        }
        </>
    )
},(prevProps, nextProps) => {
    return prevProps.props.el.media_id === nextProps.props.el.media_id 
})



SwiperStepMedia.displayName = "SwiperStepMedia"