import { media } from "@/app/(main)/home/styles";
import { RecipeMedia } from "@/app/(main)/types";
import { Box, CardMedia, Skeleton } from "@mui/material";
import { useEffect, useRef, useState } from "react";




interface Props {
    el: RecipeMedia,
    name: string,
}

export default function SwiperMediaCard({ props }: { props: Props }) {
    const { el, name, } = props;
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
        <Box ref={ref} style={{ width: '100%', height: '100%' }}>
            {el.media_type === 'image' ? (
                <CardMedia
                    component="img"
                    alt={name}
                    sx={media}
                    src={el.media_url as string}
                    loading="lazy"
                />
            ) : isVisible ? (
                <CardMedia
                    component='video'
                    sx={media}
                    autoPlay
                    loop
                    muted
                    poster={el.media_url as string}
                >
                    <source src={el.media_url as string} type="video/mp4" />
                </CardMedia>
            ) : (
                <Skeleton variant="rectangular" sx={media}/>
            )}
        </Box>
    )
}