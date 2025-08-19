import { useAppDispatch, useAppSelector } from "@/state/hook";
import { Avatar, Box, CardActions, IconButton, Typography } from "@mui/material";
import { memo } from "react";
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CommentIcon from '@mui/icons-material/Comment';
import { likePopContent, savePopContent } from "@/state/slices/popular-slice";
import numbro from 'numbro';
import { authorAvatar, authorName, containerBtnsStats, statsBtn, statsRecipe } from "@/app/(main)/popular/styles";
import { usePingGate } from "@/app/hooks/ping";
import { PopularAuthorInfo } from "@/app/(main)/popular/types";
import { columnCenter, columnSpaceBetween, textMaxWidth } from "@/app/styles";


interface Props {
    author: PopularAuthorInfo,
    likes: number,
    liked: boolean,
    saved: boolean,
    saves: number,
    comments: number,
    config_id: string,
    openComment: boolean;
    toggleComment: () => void;
}


export const InfoAboutContent = memo(({ props }: { props: Props }) => {
    const { author, likes, liked, saved, saves, comments, config_id, openComment, toggleComment } = props

    const pingGate = usePingGate()
    // const popularStatus = useAppSelector(state => state.popular)
    const saveStatus = useAppSelector(state => state.popular.operations.savePopContent.loading)
    const likeStatus = useAppSelector(state => state.popular.operations.likePopContent.loading)
    const connection_id = useAppSelector(state => state.user.user.connection_id)
    const dispatch = useAppDispatch()


    function handleLike() {
        if(likeStatus) return

        pingGate(() => {
            if (connection_id !== '') {
                dispatch(likePopContent({
                    config_id: config_id,
                    liked: liked,
                    user_id: connection_id
                }))

            }
        });

    }


    async function handleSave() {
        if(saveStatus) return

        pingGate(() => {
            if (connection_id !== '') {
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

        <Box sx={[statsRecipe, columnSpaceBetween]}>
            <Avatar alt="name" src={author.author_img } sx={authorAvatar} />
            <Typography sx={[authorName, textMaxWidth]}>{author.author_name}</Typography>

            <CardActions sx={[containerBtnsStats]}>
                <IconButton
                    onClick={() => handleLike()}
                    sx={[statsBtn, columnCenter]}
                >
                    <FavoriteIcon sx={{ color: `${liked ? 'primary.main' : 'text.primary'}` }}></FavoriteIcon>
                    <Typography>{likes > 0 ? formatCount(Number(likes)) : 0}</Typography>
                </IconButton>


                <IconButton
                    onClick={toggleComment}
                    sx={[statsBtn, columnCenter]}>
                    <CommentIcon sx={{ color: `${openComment ? 'primary.main' : 'text.primary'}`}} ></CommentIcon>
                    <Typography >{comments > 0 ? formatCount(Number(comments)) : 0}</Typography>
                </IconButton>

                <IconButton
                    onClick={() => handleSave()}
                    sx={[statsBtn, columnCenter]}>
                    <BookmarkIcon sx={{ color: `${saved ? 'primary.main' : 'text.primary'}`}}></BookmarkIcon>
                    <Typography >{saves > 0 ? formatCount(Number(saves)) : 0}</Typography>
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