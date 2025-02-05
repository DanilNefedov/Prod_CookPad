
import { MediaObj } from "@/app/types/types";
import { theme } from "@/config/ThemeMUI/theme";
import { Box, CardMedia, IconButton, Tooltip } from "@mui/material";




interface propsData {
    el: MediaObj,
}

export function SwiperStepMedia({ props }: { props: propsData }) {
    const { el } = props

    // console.log(el, el.media_type)
    return (
        <>
        {
            el.media_type === 'image' ?
            <CardMedia
                sx={{
                    height: '100%',
                    objectFit: 'cover',
                    maxHeight:'600px',
                    
                }}
                component='img'
                src={el.media_url as string}
                loading="lazy"
            />
            :
            <CardMedia
                sx={{
                    maxHeight:'600px',
                    height: '100%',
                    // objectFit: 'cover',
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
}