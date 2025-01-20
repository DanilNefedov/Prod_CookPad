import { mainCardImg } from "@/app/(main)/home/style";
import { MediaObj } from "@/app/types/types";
import { Box, CardMedia } from "@mui/material";




interface propsData {
    el:MediaObj,
    name:string
}

export function SwiperMediaCard ({ props }: { props: propsData }){
    const {el, name} = props

    // console.log(el, el.media_type)
    return(
        // <Box>
            // {
                el.media_type === 'image' ? 
                <CardMedia
                    component='img'
                    alt={name as string}
                    sx={{height: '100%', objectFit: 'cover',}}
                    src={el.media_url as string}
                    loading="lazy"
                    // className="swiper-lazy"
                />
                :
                <CardMedia
                    component='video'
                    // alt={name as string}
                    // sx={mainCardImg}
                    // src={el.media_url as string}
                    sx={{height: '100%', objectFit: "cover",  width: '100%',}}
                    autoPlay
                    loop
                    muted
                    poster={el.media_url as string}
                    // className="swiper-lazy"
                >
                    <source
                    
                    src={el.media_url as string}
                    type="video/mp4"
                    />
                </CardMedia>
               
            // }
        // </Box>
        
    )
}