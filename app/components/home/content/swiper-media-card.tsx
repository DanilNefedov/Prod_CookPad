import { MediaObj } from "@/app/types/types";
import { CardMedia } from "@mui/material";




interface propsData {
    el:MediaObj,
    name:string
}

export function SwiperMediaCard ({ props }: { props: propsData }){
    const {el, name} = props


    return(
        
        el.media_type === 'image' ? 
        <CardMedia
            component='img'
            alt={name as string}
            sx={{height: '100%', objectFit: 'cover',}}
            src={el.media_url as string}
            loading="lazy"
        />
        :
        <CardMedia
            component='video'
            sx={{height: '100%', objectFit: "cover",  width: '100%',}}
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

    )
}