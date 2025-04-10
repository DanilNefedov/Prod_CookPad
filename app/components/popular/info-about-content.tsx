import { useAppDispatch, useAppSelector } from "@/state/hook";
import { Avatar, Box, CardActions, IconButton, Typography } from "@mui/material";
import { memo, useState } from "react";
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CommentIcon from '@mui/icons-material/Comment';
import { likePopContent, savePopContent } from "@/state/slices/popular-slice";
import { PopularAuthorInfoT } from "@/app/types/types";
import numbro from 'numbro';


interface DataPropsT {
    // activeVideo:number,
    author:PopularAuthorInfoT,
    likes:number,
    liked:boolean,
    saved:boolean,
    saves:number,
    comments:number,
    config_id:string,
    openComment: boolean;
    toggleComment: () => void;
}


// export function InfoAboutContent({props}:{props:DataPropsT}) {
export const InfoAboutContent = memo(({ props }: { props: DataPropsT }) => {
    const { author, likes, liked, saved, saves, comments, config_id, openComment, toggleComment} = props

    const popularStatus = useAppSelector(state => state.popular.status)
    // const [activeVideo, setActiveVideo] = useState<number>(0)
    const userData = useAppSelector(state => state.user)
    const connection_id = userData?.user?.connection_id
    // const [openComment, setOpenComment] = useState<boolean>(false)
    const dispatch = useAppDispatch()


    function handleLike() {
        if (connection_id !== '' && !popularStatus) {
            // console.log('3')
            dispatch(likePopContent({
                config_id: config_id,
                liked: liked,
                user_id: connection_id
            }))
        }

    }


    function handleSave() {
        if (connection_id !== '' && !popularStatus) {
            dispatch(savePopContent({
                config_id: config_id,
                saved: saved,
                user_id: connection_id
            }))
        }
    }

    function formatCount (value: number): string  {
        if (!value) return '';
        if (value < 1000) return String(Math.floor(value));
        return numbro(value).format({
            average: true,
            mantissa: 2,
            trimMantissa: true,
            spaceSeparated: false,
        });
    };

    console.log('info-content')
    return (

        <Box sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.35)',
            backdropFilter: 'blur(3px)',
            height: '100%',
            // width:'100px',
            position: "absolute",
            top: '0',
            right: '0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: '0 7px',
            zIndex: 1000,
            width:'80px'
        }}>

            <Avatar alt="name" src={author.author_img} />
            <Typography sx={{ m: '10px 0', textOverflow:'ellipsis', whiteSpace:'nowrap', overflow:'hidden', width:"70px", textAlign:'center' }}>{author.author_name}</Typography>

            <CardActions sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                '&.MuiCardActions-root>:not(style)~:not(style)': {
                    ml: 0,
                }
            }}>
                <IconButton
                    onClick={() => handleLike()}
                    sx={{ m: '5px 0', color: 'text.primary', p: '0', flexDirection: 'column', justifyContent: "center" }}
                >
                    <FavoriteIcon sx={{ color: `${liked ? 'primary.main' : 'text.primary'}` }}></FavoriteIcon>
                    <Typography>{formatCount(Number(likes))}</Typography>
                </IconButton>


                <IconButton
                    onClick={toggleComment}
                    sx={{ m: '10px 0', color: 'text.primary', p: '0', flexDirection: 'column', justifyContent: "center" }}>
                    <CommentIcon sx={{ color: `${openComment ? 'primary.main' : 'text.primary'}` }} ></CommentIcon>
                    <Typography>{formatCount(Number(comments))}</Typography>
                </IconButton>

                <IconButton
                    onClick={() => handleSave()}
                    sx={{ m: '5px 0', color: 'text.primary', p: '0', flexDirection: 'column', justifyContent: "center" }}>
                    <BookmarkIcon sx={{ color: `${saved ? 'primary.main' : 'text.primary'}` }}></BookmarkIcon>
                    <Typography>{formatCount(Number(saves))}</Typography>
                </IconButton>
            </CardActions>

        </Box>
    )
}, (prevProps, nextProps) => {
    return prevProps.props.config_id === nextProps.props.config_id &&
    prevProps.props.likes === nextProps.props.likes &&
    prevProps.props.liked === nextProps.props.liked &&
    prevProps.props.saved === nextProps.props.saved &&
    prevProps.props.saves === nextProps.props.saves &&
    prevProps.props.comments === nextProps.props.comments &&
    prevProps.props.openComment === nextProps.props.openComment
});

