







import { imgRecipeContainer } from "@/app/(main)/cook/[recipe_id]/styles";
import { MediaObj } from "@/app/types/types";
import { Box, CardMedia } from "@mui/material";




interface propsData {
    el:MediaObj,
    // name:string | null
}

export function SwiperMediaCook ({ props }: { props: propsData }){
    const {el} = props

    // console.log(el, el.media_type)
    return(
        <Box sx={{ ...imgRecipeContainer, }}>
            {el.media_type === 'image' ? 
                <CardMedia
                sx={{
                    height:'100%', 
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    objectFit:"cover",

                }}
                component='img'
                // alt={name as string}
                // sx={mainCardImg}
                src={el.media_url as string}
                loading="lazy"
                    // className="swiper-lazy"
                />
                :
                <CardMedia
                sx={{
                    height:'100%', 
                    objectFit:"cover",
                }}
                component='video'
                // alt={name as string}
                // sx={mainCardImg}
                // src={el.media_url as string}
                
                // sx={{objectFit: "cover"}}
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
               
            }
        </Box>
        
    )
}