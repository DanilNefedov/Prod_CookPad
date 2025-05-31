import { MediaObj } from "@/app/types/types";
import { CardMedia, Skeleton } from "@mui/material";
import { useEffect, useRef, useState } from "react";




interface propsData {
    el: MediaObj,
    name: string,
    
}

export default function SwiperMediaCard({ props }: { props: propsData }) {
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


        <div ref={ref} style={{ width: '100%', height: '100%' }}>
            {el.media_type === 'image' ? (
                <CardMedia
                    component="img"
                    alt={name}
                    sx={{ height: '100%', objectFit: 'cover' }}
                    src={el.media_url as string}
                    loading="lazy"
                />
            ) : !isVisible ? (
                <CardMedia
                    component='video'
                    sx={{height: '100%', objectFit: "cover",  width: '100%',}}
                    autoPlay
                    loop
                    muted
                    poster={el.media_url as string}
                    
                >
                    <source src={el.media_url as string} type="video/mp4" />
                </CardMedia>
            ) : (
                <Skeleton variant="rectangular" sx={{objectFit: "cover", width:'100%', height:'100%'}}/>

            )}
        </div>
    

    )
}