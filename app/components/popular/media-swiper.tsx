import { MediaObj } from "@/app/types/types";
import { Box, CardMedia } from "@mui/material";



interface dataPorps {
    elem: MediaObj
}



export function MediaSwiper({ props }: { props: dataPorps }) {
    const { main, media_id, media_type, media_url } = props.elem

    console.log(main, media_id, media_type, media_url)
    return (
        <>
        {
            media_type === 'image' ?
            <CardMedia
                sx={{
                    height: '100%',
                    objectFit: 'cover',
                }}
                component='img'
                src={media_url as string}
                loading="lazy"
            />
            :
            <CardMedia
                sx={{
                    height: '100%',
                    objectFit: 'cover',
                }}
                component='video'
                autoPlay
                loop
                muted
                poster={media_url as string}
            >
                <source
                    src={media_url as string}
                    type="video/mp4"
                />
            </CardMedia>
        }
        </>
        
    )
}