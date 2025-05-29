import { imgRecipeContainer } from "@/app/(main)/cook/[recipe_id]/styles";
import { MediaObj } from "@/app/types/types";
import { Box, CardMedia } from "@mui/material";
import { memo } from "react";




interface propsData {
    el:MediaObj,
}

export const SwiperMediaCook = memo(({ props }: { props: propsData }) => {
    const {el} = props
    
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
                src={el.media_url as string}
                loading="lazy"
                />
                :
                <CardMedia
                sx={{
                    height:'100%', 
                    objectFit:"cover",
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
        </Box>
        
    )
},(prevProps, nextProps) => {
    return prevProps.props.el.media_id === nextProps.props.el.media_id
})



SwiperMediaCook.displayName = "SwiperMediaCook"