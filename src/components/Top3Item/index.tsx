import React from 'react'
import './style.css'
import defaultProfileImage from '../../assets/image/default-profile-image.png';
import {BoardListItem} from "../../types/interface/index.ts";

interface Props {
    top3ListItem : BoardListItem
}

export default function Top3Item({top3ListItem}: Props) {
    const {board_int, title, content, boardTitleImage} = top3ListItem;
    const {favoriteCount, commentCount, viewCount} = top3ListItem;
    const {reg_date, writerNickname, writerProfileImage} = top3ListItem;

    // const navigator = useNavigate();

    const onClickHandler = () => {
        // navigator(board_int)
    }

    return (
        <div className='top-3-list-item' style={{backgroundImage: `url(${boardTitleImage})`}}>
            <div className='top-3-list-item-main-box'>
                <div className='top-3-list-item-top'>
                    <div className='top-3-list-item-profile-box'>
                        <div className='top-3-list-profile-image' style={{ backgroundImage :`url(${(writerProfileImage) ? writerProfileImage : defaultProfileImage})`}}></div>
                    </div>
                    <div className='top-3-list-item-write-box'>
                        <div className='top-3-list-item-nickname'>{writerNickname}</div>
                        <div className='top-3-list-item-write-date'>{reg_date}</div>
                    </div>
                </div>
                <div className='top-3-list-item-middle'>
                    <div className='top-3-list-title'>{title}</div>
                    <div className='top-3-list-content'>{content}</div>
                </div>
                <div className='top-3-list-item-bottom'>
                    <div className='top-3-list-item-counts'>`댓글 {commentCount} 좋아요 {favoriteCount} 조회수 {viewCount}`</div>
                </div>
            </div>
        </div>
    )
}