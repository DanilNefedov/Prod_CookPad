import { imgRecipeContainer } from "@/app/(main)/cook/[recipe_id]/styles";
import { MediaObj } from "@/app/types/types";
import { Box, CardMedia, Skeleton } from "@mui/material";
import { memo, useEffect, useRef, useState } from "react";
import { UXLoading } from "../ux-helpers/loading";




interface propsData {
    el: MediaObj,
}

const SwiperMediaCook = memo(({ props }: { props: propsData }) => {
    const { el } = props

    const ref = useRef<HTMLDivElement | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.disconnect();
                    }
                });
            },
            {
                rootMargin: '100px',
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);


    return (
        <Box sx={{ ...imgRecipeContainer, }} ref={ref}>
            {el.media_type === 'image' ? (
                <CardMedia
                    alt='image'
                    sx={{
                        height: '100%',
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        objectFit: "cover",

                    }}
                    component='img'
                    src={el.media_url as string}
                    loading="lazy"
                />
            ) : isVisible ? (
                <CardMedia
                
                    sx={{
                        height: '100%',
                        objectFit: "cover",
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
            ) : (
                <Skeleton variant="rectangular" sx={{objectFit: "cover", width:'100%', height:'100%', maxWidth: "465px", aspectRatio:" 4 / 5"}}/>
            )}

        </Box>

    )
}, (prevProps, nextProps) => {
    return prevProps.props.el.media_id === nextProps.props.el.media_id
})



SwiperMediaCook.displayName = "SwiperMediaCook"

export default SwiperMediaCook;