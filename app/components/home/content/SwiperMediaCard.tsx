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
    priority:boolean

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
        <Box ref={ref} style={{ width: '100%', height: '100%', position:'relative' }}>
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
                <CldVideoPlayer
                    autoPlay='true'
                    loop
                    muted
                    width="600"
                    height="500"
                    quality="auto"
                    src={el.media_url as string}
                    transformation={{
            
                        format:'auto',
                        crop: 'fill',
                        gravity: 'auto',
                        
                    }}
                >
                    
                </CldVideoPlayer>
            ) : (
                <Skeleton variant="rectangular" sx={media}/>
            )}
        </Box>
    )
}