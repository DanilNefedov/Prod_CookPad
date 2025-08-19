
import { RecipeMedia } from "@/app/(main)/types";
import { cardMedia } from "@/app/styles";
import { CardMedia } from "@mui/material";
import { memo } from "react";




interface Props {
    el: RecipeMedia,
}


export const SwiperStepMedia = memo(({ el }: Props) => {    

    return (
        <>
        {
            el.media_type === 'image' ?
            <CardMedia
                sx={cardMedia}
                component='img'
                src={el.media_url as string}
                loading="lazy"
            />
            :
            <CardMedia
                sx={cardMedia}
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
    return prevProps.el.media_id === nextProps.el.media_id 
})



SwiperStepMedia.displayName = "SwiperStepMedia"