import React from 'react';
import './style.css';
import {BoardListItem} from "../../types/interface/index.ts";
import {useNavigate} from "react-router-dom";
import DefaultProfileImage from "../../assets/image/default-profile-image.png";

interface Props {
    boardListItem: BoardListItem
}

export default function BoardItem({boardListItem} : Props) {

    const { board_int, title, content, boardTitleImage } = boardListItem;
    const { favoriteCount, commentCount, viewCount } = boardListItem;
    const { reg_date, writerNickname, writerProfileImage} = boardListItem;


    // const navigator = useNavigate();

    const onClickHandler = () => {
        // navigator(board_int)
    }
    return (
        <div className='board-list-item' onClick={onClickHandler}>
            <div className='board-list-item-main-box'>
                <div className='board-list-item-top'></div>
                    <div className='board-list-item-profile-box'>
                        <div className='board-list-item-profile-image' style={{backgroundImage: `url(${writerProfileImage} ? ${writerProfileImage} : ${DefaultProfileImage}`}}></div>
                    </div>
                    <div className='board-list-item-write-box'>
                        <div className='board-list-item-nickname'>{writerNickname}</div>
                        <div className='board-list-item-reg_date'>{reg_date}</div>
                    </div>
                <div className='board-list-item-middle'>
                    <div className='board-list-item-title'>{title}</div>
                    <div className='board-list-item-content'>{content}</div>
                </div>
                <div className='board-list-item-bottom'>
                    <div className='board-list-item-counts'>{`댓글 ${commentCount} 좋아요 ${favoriteCount} 조회수 ${viewCount}`}</div>
                </div>
            </div>
            {boardTitleImage !== null && (
                <div className='board-list-item-image-box'>
                    <div className='board-list-item-image' style={{backgroundImage: `url(${boardTitleImage}`}}></div>
                </div>
            )}
        </div>
    )
}