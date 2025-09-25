import { media } from "@/app/(main)/home/styles";
import { RecipeMedia } from "@/app/(main)/types";
import { Box, CardMedia, Skeleton } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { CldImage } from "next-cloudinary";
import { getCloudinary } from "@/app/lib/cloudinary";
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

    console.log(el)
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
        <Box ref={ref} style={{ width: '100%', height: '100%', }}>
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

                // <Box
                //     sx={{
                //         width: "100%",
                //         height: "100%",
                //         aspectRatio: "16 / 9",
                //         maxHeight: "450px",
                //         display: 'flex', 
                //         maxWidth: '100%', 
                //         alignItems: 'center',
                //         overflow: "hidden",
                //         position:"relative",

                //         '& .cld-video-player':{
                //             width: '100% !important',
                //             height: '100% !important',
                //             maxHeight: '100% !important',
                //         }
                //     }}
                // >
                <Box sx={{
                    width:'100%',
                    height:'100%',
                    display:'flex',
                    maxWidth:'100%',
                    '& .cld-video-player.cld-fluid': {
                        maxWidth: '100%',
                        width: '100%',
                        height:'100%',
                        overflow: 'hidden',
                        position: 'relative',
                    },
                    '& video':{
                        maxWidth:'100%',
                        left: 0,
                        position: 'absolute',
                        top: 0,
                        height: '100%',
                        width: '100%',
                        display: 'block',
                        // verticalAlign: 'middle',
                        bgcolor:"black",
                        objectFit:'cover'
                    }
                }}> 
                    <CldVideoPlayer
                        src={el.media_url as string}
                        // aspectRatio:'9/13',
                        width={900}
                        height={1300}
                        // id="default"
                    />
                </Box>
            ) : (
                <Skeleton variant="rectangular" sx={media} />
            )}
        </Box>
    )
}