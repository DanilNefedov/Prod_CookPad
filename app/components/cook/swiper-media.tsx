import { mediaContainer, skeletonMedia } from "@/app/(main)/cook/styles";
import { RecipeMedia } from "@/app/(main)/types";
import { cardMedia, centerFlexBlock } from "@/app/styles";
import { Box, CardMedia, Skeleton } from "@mui/material";
import { memo, useEffect, useRef, useState } from "react";




interface Props {
    el: RecipeMedia,
}

const SwiperMediaCook = memo(({ props }: { props: Props }) => {
    const { el } = props

    const containerRef = useRef<HTMLDivElement | null>(null);
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

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);


    return (
        <Box sx={[centerFlexBlock, mediaContainer]} ref={containerRef}>
            {el.media_type === 'image' ? (
                <CardMedia
                    alt='image'
                    sx={cardMedia}
                    component='img'
                    src={el.media_url as string}
                    loading="lazy"
                />
            ) : isVisible ? (
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
            ) : (
                <Skeleton variant="rectangular" sx={skeletonMedia}/>
            )}

        </Box>

    )
}, (prevProps, nextProps) => {
    return prevProps.props.el.media_id === nextProps.props.el.media_id
})



SwiperMediaCook.displayName = "SwiperMediaCook"

export default SwiperMediaCook;