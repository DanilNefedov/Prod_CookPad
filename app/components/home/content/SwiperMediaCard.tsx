import { boxSlides, media, videoContainer } from "@/app/(main)/home/styles";
import { RecipeMedia } from "@/app/(main)/types";
import { Box, Skeleton, useMediaQuery } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { CldImage } from "next-cloudinary";
import { CldVideoPlayer } from 'next-cloudinary';
<<<<<<< HEAD
import { v4 as uuidv4 } from 'uuid';
=======
>>>>>>> dev-page




interface Props {
    el: RecipeMedia,
    name: string,
    priority: boolean

}

export default function SwiperMediaCard({ props }: { props: Props }) {
    const { el, name, priority } = props;
    const ref = useRef<HTMLDivElement | null>(null);
    const uniqueId = uuidv4();
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
                <CldImage
                    alt={name}
                    style={{ objectFit: "cover" }}
                    format="auto"
                    sizes="100%"
                    quality="auto"
                    src={el.media_url as string}
                    loading={priority ? "eager" : "lazy"}
                    priority={priority}
                    fill
                />
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
                        />
                </Box>
            ) : (
                <Skeleton variant="rectangular" sx={media} />
            )}
        </Box>
    )
}