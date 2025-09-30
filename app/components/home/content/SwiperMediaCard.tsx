import { boxSlides, media, videoContainer } from "@/app/(main)/home/styles";
import { RecipeMedia } from "@/app/(main)/types";
import { Box, Skeleton, useMediaQuery } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { CldImage } from "next-cloudinary";
import { CldVideoPlayer } from 'next-cloudinary';




interface Props {
    el: RecipeMedia,
    name: string,
    priority: boolean

}

export default function SwiperMediaCard({ props }: { props: Props }) {
    const { el, name, priority } = props;
    const ref = useRef<HTMLDivElement | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const isSmallScreen = useMediaQuery('(max-width:499px)');


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
        <Box ref={ref} sx={boxSlides}>
            {el.media_type === 'image' ? (
                <Box sx={{ position: "relative", aspectRatio: "9/16", width: "100%" }}>
                    <CldImage
                        alt={name}
                        src={el.media_url as string}
                        fill
                        crop="fill"
                        gravity="auto"
                        style={{ objectFit: "cover" }}
                        format="auto"
                        quality="auto"
                        sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        dpr="auto"
                        priority={priority}
                    />
                </Box>
            ) : isVisible ? (

                <Box 
                    sx={videoContainer}
                > 
                    <CldVideoPlayer
                        src={el.media_url as string}
                        width={900}
                        height={isSmallScreen ? 1600 : 1100}
                        autoPlay={true}
                        autoplay={true}
                        playsinline={true}
                        muted
                        loop
                        controls={false}
                        className="my-custom-video"
                    />
                </Box>
            ) : (
                <Skeleton variant="rectangular" sx={media} />
            )}
        </Box>
    )
} 