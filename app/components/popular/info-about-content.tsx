import { useAppDispatch, useAppSelector } from "@/state/hook";
import { Avatar, Box, CardActions, IconButton, Typography } from "@mui/material";
import { memo } from "react";
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CommentIcon from '@mui/icons-material/Comment';
import { likePopContent, savePopContent } from "@/state/slices/popular-slice";
import { PopularAuthorInfoT } from "@/app/types/types";
import numbro from 'numbro';
import { theme } from "@/config/ThemeMUI/theme";
import { authorName, containerBtnsStats, statsBtn, statsBtnMobileIcon, statsRecipe } from "@/app/(main)/popular/style";
import { usePingGate } from "@/app/hooks/ping";


interface DataPropsT {
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


export const InfoAboutContent = memo(({ props }: { props: DataPropsT }) => {
    const { author, likes, liked, saved, saves, comments, config_id, openComment, toggleComment } = props

    const pingGate = usePingGate()
    const popularStatus = useAppSelector(state => state.popular.status)
    const userData = useAppSelector(state => state.user)
    const connection_id = userData?.user?.connection_id
    const dispatch = useAppDispatch()


    function handleLike() {
        pingGate(() => {
            if (connection_id !== '' && !popularStatus) {
                dispatch(likePopContent({
                    config_id: config_id,
                    liked: liked,
                    user_id: connection_id
                }))

            }
        });

    }


    async function handleSave() {
        pingGate(() => {
            if (connection_id !== '' && !popularStatus) {
                dispatch(savePopContent({
                    config_id: config_id,
                    saved: saved,
                    user_id: connection_id
                }))
            }
        });
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


    return (

        <Box sx={statsRecipe}>
            <Avatar alt="name" src={author.author_img } sx={{ [theme.breakpoints.down('md')]: { width: '35px', height: "35px" } }} />
            <Typography sx={authorName}>{author.author_name}</Typography>

            <CardActions sx={containerBtnsStats}>
                <IconButton
                    onClick={() => handleLike()}
                    sx={statsBtn}
                >
                    <FavoriteIcon sx={
                        [statsBtnMobileIcon, { color: `${liked ? 'primary.main' : 'text.primary'}` }]
                    }></FavoriteIcon>
                    <Typography>{likes > 0 ? formatCount(Number(likes)) : 0}</Typography>
                </IconButton>


                <IconButton
                    onClick={toggleComment}
                    sx={[statsBtn, { m: '10px 0' }]}>
                    <CommentIcon sx={
                        [statsBtnMobileIcon, { color: `${openComment ? 'primary.main' : 'text.primary'}` }]
                    } ></CommentIcon>
                    <Typography sx={{
                        [theme.breakpoints.down('md')]: {
                            fontSize: "14px",
                        }
                    }}>{comments > 0 ? formatCount(Number(comments)) : 0}</Typography>
                </IconButton>

                <IconButton
                    onClick={() => handleSave()}
                    sx={statsBtn}>
                    <BookmarkIcon sx={[statsBtnMobileIcon, { color: `${saved ? 'primary.main' : 'text.primary'}`, }]
                    }></BookmarkIcon>
                    <Typography sx={{
                        [theme.breakpoints.down('md')]: {
                            fontSize: "14px",
                        }
                    }}>{saves > 0 ? formatCount(Number(saves)) : 0}</Typography>
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


InfoAboutContent.displayName = 'InfoAboutContent';