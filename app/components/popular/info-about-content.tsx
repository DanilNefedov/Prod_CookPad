import { useAppDispatch, useAppSelector } from "@/state/hook";
import { Avatar, Box, CardActions, IconButton, Typography } from "@mui/material";
import { memo, useState } from "react";
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CommentIcon from '@mui/icons-material/Comment';
import { likePopContent, savePopContent } from "@/state/slices/popular-slice";
import { PopularAuthorInfoT } from "@/app/types/types";
import numbro from 'numbro';
import { theme } from "@/config/ThemeMUI/theme";


interface DataPropsT {
    // activeVideo:number,
    author: PopularAuthorInfoT,
    likes: number,
    liked: boolean,
    saved: boolean,
    saves: number,
    comments: number,
    config_id: string,
    openComment: boolean;
    toggleComment: () => void;
}


// export function InfoAboutContent({props}:{props:DataPropsT}) {
export const InfoAboutContent = memo(({ props }: { props: DataPropsT }) => {
    const { author, likes, liked, saved, saves, comments, config_id, openComment, toggleComment } = props

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

    function formatCount(value: number): string {
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
            backgroundColor: 'background.default',
            backdropFilter: 'blur(3px)',
            height: '320px',
            // width:'100px',
            borderRadius: '0px 15px 15px 0px',
            position: "absolute",
            bottom: '0',
            right: '-79px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: '20px 7px',
            zIndex: 1000,
            width: '80px',
            [theme.breakpoints.down('md')]: {
                width:'65px',
                height:'265px',
                top: 'calc(50% - 122px)',
            }
        }}>

            <Avatar alt="name" src={author.author_img} sx={{ [theme.breakpoints.down('md')]: { width: '35px', height: "35px" } }} />
            <Typography sx={{
                m: '10px 0', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', width: "70px", textAlign: 'center',
                [theme.breakpoints.down('md')]: {
                    fontSize: "14px",
                    m: '5px 0'
                }
            }}>{author.author_name}</Typography>

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
                    sx={{ m: '5px 0', color: 'text.primary', p: '0', flexDirection: 'column', justifyContent: "center",
                        [theme.breakpoints.down('md')]:{m: '2px 0'}
                     }}
                >
                    <FavoriteIcon sx={{
                        color: `${liked ? 'primary.main' : 'text.primary'}`,
                        [theme.breakpoints.down('md')]: { width: '20px', height: "20px" }
                    }}></FavoriteIcon>
                    <Typography>{formatCount(Number(likes))}</Typography>
                </IconButton>


                <IconButton
                    onClick={toggleComment}
                    sx={{ m: '10px 0', color: 'text.primary', p: '0', flexDirection: 'column', justifyContent: "center",
                        [theme.breakpoints.down('md')]:{m: '5px 0'}
                     }}>
                    <CommentIcon sx={{
                        color: `${openComment ? 'primary.main' : 'text.primary'}`,
                        [theme.breakpoints.down('md')]: { width: '20px', height: "20px" }
                    }} ></CommentIcon>
                    <Typography sx={{
                        [theme.breakpoints.down('md')]: {
                            fontSize: "14px",}
                    }}>{formatCount(Number(comments))}</Typography>
                </IconButton>

                <IconButton
                    onClick={() => handleSave()}
                    sx={{ m: '5px 0', color: 'text.primary', p: '0', flexDirection: 'column', justifyContent: "center",
                        [theme.breakpoints.down('md')]:{m: '2px 0'}
                     }}>
                    <BookmarkIcon sx={{
                        color: `${saved ? 'primary.main' : 'text.primary'}`,
                        [theme.breakpoints.down('md')]: { width: '20px', height: "20px" }
                    }}></BookmarkIcon>
                    <Typography sx={{
                        [theme.breakpoints.down('md')]: {
                            fontSize: "14px",}
                    }}>{formatCount(Number(saves))}</Typography>
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

