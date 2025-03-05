import React from 'react'
import './style.css'
import defaultProfileImage from '../../assets/image/default-profile-image.png';
import {BoardListItem} from "../../types/interface/index.ts";
import {useNavigate} from "react-router-dom";
import {BOARD_DEATIL_PATH, BOARD_PATH} from "../../constant/index.ts";

interface Props {
    top3ListItem : BoardListItem
}

export default function Top3Item({top3ListItem}: Props) {
    const {boardIdx, title, content, boardTitleImage} = top3ListItem;
    const {favoriteCount, commentCount, viewCount} = top3ListItem;
    const {regDate, writerNickname, writerProfileImage} = top3ListItem;

    const navigator = useNavigate();

    const onClickHandler = () => {
        navigator(BOARD_PATH() + '/' + BOARD_DEATIL_PATH(boardIdx))
    }

    return (
        <div className='top-3-list-item' style={{backgroundImage: `url(${boardTitleImage})`}} onClick={onClickHandler}>
            <div className='top-3-list-item-main-box'>
                <div className='top-3-list-item-top'>
                    <div className='top-3-list-item-profile-box'>
                        <div className='top-3-list-profile-image' style={{ backgroundImage :`url(${(writerProfileImage) ? writerProfileImage : defaultProfileImage})`}}></div>
                    </div>
                    <div className='top-3-list-item-write-box'>
                        <div className='top-3-list-item-nickname'>{writerNickname}</div>
                        <div className='top-3-list-item-write-date'>{regDate}</div>
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