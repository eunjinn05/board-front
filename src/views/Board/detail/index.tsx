import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import './style.css';
import FavoriteItem from "../../../components/FavoriteItem/index.tsx";
import {Board, CommentListItem, FavoriteListItem} from "../../../types/interface";
import {commentListMock, favoriteListMock, boardMock} from "../../../mocks/index.ts";
import CommentItem from "../../../components/CommentItem/index.tsx";
import Pagination from "../../../components/Pagination/index.tsx";
import defaultProfileImage from "../../../assets/image/default-profile-image.png";
import {useLoginUserStore} from "../../../stores/index.ts";
import {useNavigate, useParams} from "react-router-dom";
import {AUTH_PATH, BOARD_PATH, BOARD_UPDATE_PATH, MAIN_PATH, USER_PATH} from "../../../constant/index.ts";
import GetBoardResponseDto from "../../../apis/response/board/get-board.response.dto";
import {ResponseDto} from "../../../apis/response";
import {
    deleteBoardRequest,
    getBoardRequest,
    getCommentListRequest,
    getFavoriteListRequest,
    increaseViewCountRequest, postCommentRequest, putFavoriteRequest
} from "../../../apis/index.ts";
import {
    DeleteBoardResponseDto,
    GetCommentListResponseDto,
    GetFavoriteListResponseDto,
    IncreaseBoardViewCountResponseDto, PostCommentResponseDto, PutFavoriteResponseDto
} from "../../../apis/response/board";
import dayjs from 'dayjs';
import {useCookies} from "react-cookie";
import {usePagination} from "../../../hooks/index.ts";


export default function BoardDetail() {

    const { loginUser } = useLoginUserStore();
    const { boardIdx } = useParams();
    const navigator = useNavigate();
    const [cookies, setCookies] = useCookies();

    const increseViewCountResponse = (responseBody: IncreaseBoardViewCountResponseDto | ResponseDto | null) => {
        if(!responseBody) return false;
        const code = responseBody.code;
        if(code === "NB") alert('존재하지 않는 게시물입니다.');
        if(code === "DBE") alert("데이터베이스 오류입니다.");
    }

    let effectFlag = true;
    useEffect(() => {
        if(!boardIdx) return;
        if(effectFlag) {
            effectFlag = false;
            return;
        }
        increaseViewCountRequest(boardIdx).then(increseViewCountResponse);
    }, [boardIdx]);


    const BoardDetailTop = () => {

        const [board, setBoard] = useState<Board | null>(null);
        const [showMore, setShowMore] = useState<boolean>(false);
        const [isWriter, setWriter] = useState<boolean>(false);

        const onMoreButtonClickHandler = () => {
            setShowMore(!showMore);
        }
        const onNickNameClickHandler = () => {
            if(!board) return false;
            navigator(USER_PATH(board.writerEmail));
        }
        const onUpdateButtonClickHandler = () => {
            if(!board || !loginUser) return false;
            if(loginUser.email !== board.writerEmail) return false;
            navigator(BOARD_PATH() + '/' + BOARD_UPDATE_PATH(board.boardIdx));
        }
        const deleteBoardResponse = (responseBody: DeleteBoardResponseDto | ResponseDto | null) => {
            if (!responseBody) return false;
            const { code } = responseBody;
            if(code === "VF") alert('잘못된 접근입니다.');
            if(code === "NU") alert('존재하지 않는 유저입니다.');
            if(code === "NB") alert('존재하지 않는 게시물입니다.');
            if(code === "AF") alert('인증에 실패했습니다.');
            if(code === "NP") alert('권한이 없습니다.');
            if(code === "DBE") alert("데이터베이스 오류입니다.");
            if(code !== "SU") return false;
            navigator(MAIN_PATH());
        }
        const onDeleteButtonClickHandler = () => {
            if(!board || !loginUser || !boardIdx || !cookies.accessToken) return false;
            if(loginUser.email !== board.writerEmail) return false;

            deleteBoardRequest(boardIdx, cookies.accessToken).then(deleteBoardResponse);
        }
        const getWriteDatetimeFormat = () => {
            if(!board) return '';
            const date = dayjs(board.regDatetime);
            return date.format('YYYY.MM.DD');
        }
        const getBoardResponse = (responseBody: GetBoardResponseDto | ResponseDto) => {
            if(!responseBody) return false;
            const {code} =responseBody;
            if(code === 'NB') alert('존재하지 않는 게시물입니다.');
            if(code === 'DBE') alert('데이터베이스 오류입니다.');
            if(code !== 'SU') {
                navigator(MAIN_PATH());
                return false;
            }
            const board: Board = {...responseBody as GetBoardResponseDto};
            setBoard(board);

            if(!loginUser) {
                setWriter(false);
                return false;
            }
            const isWriter = (loginUser.email === board.writerEmail);
            setWriter(isWriter);

        }

        useEffect(() => {
            if(!boardIdx) {
                navigator(MAIN_PATH());
                return;
            } else {
                getBoardRequest(boardIdx).then(getBoardResponse);
            }
        }, [boardIdx]);

        if(!board) return <></>;

        return (
            <div id="board-detail-top">
                <div className="board-detail-top-header">
                    <div className="board-detail-title">{board.title}</div>
                    <div className="board-detail-top-sub-box">
                        <div className="board-detail-write-info-box">
                            <div className="board-detail-writer-profile-image" style={{backgroundImage: `url(${(board.writerProfileImage) ? board.writerProfileImage : defaultProfileImage}`}}></div>
                            <div className="board-detail-writer-nickname"onClick={onNickNameClickHandler}>{board.writerNickname}</div>
                            <div className="board-detail-writer-info-divider">{'|'}</div>
                            <div className="board-detail-write-date">{getWriteDatetimeFormat()}</div>
                        </div>
                        {isWriter && (
                            <div className="icon-button" onClick={onMoreButtonClickHandler}>
                                <div className="icon more-icon"></div>
                            </div>
                        )}
                        {showMore && (
                            <div className="board-detail-more-box">
                                <div className="board-detail-update-button" onClick={onUpdateButtonClickHandler}>수정</div>
                                <div className="divider"></div>
                                <div className="board-detail-delete-button" onClick={onDeleteButtonClickHandler}>삭제</div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="divider"></div>
                <div className="board-detail-top-main">
                    <div className="board-detail-main-text">{board.content}</div>
                    {board.boardImageList.map(image => <img className="board-detail-main-image" src ={image}/>)}
                </div>
            </div>
        )
    }

    const BoardDetailBottom = () => {

        const [favoriteList, setFavoriteList] = useState<FavoriteListItem[]>([]);
        const [isFavorite, setFavorite] = useState<boolean>(false);
        const [showFavorite, setShowFavorite] = useState<boolean>(false);
        const [showComment, setShowComment] = useState<boolean>(false);
        const [comment, setComment] = useState<string>('');
        const [totalCommentCount, setTotalCommentCount] = useState<number>(0);

        const commentRef = useRef<HTMLTextAreaElement | null>(null);

        const { currentPage, setCurrentPage, currentSection, setCurrentSection, viewPageList, totalSection, setTotalList, viewList } = usePagination<CommentListItem>(3);

        const putFavoriteResponse = (responseBody: PutFavoriteResponseDto | ResponseDto | null) => {
            if(!responseBody) return false;
            const {code} = responseBody;
            if(code === 'VF') alert('잘못된 접근입니다.');
            if(code === 'NU') alert('존재하지 않는 유저입니다.');
            if(code === 'NB') alert('존재하지 않는 게시물입니다.');
            if(code === 'AF') alert('인증에 실패하였습니다.');
            if(code === 'DBE') alert('데이터베이스 오류입니다.');
            if(code !== 'SU') return false;

            if(!boardIdx) return false;
            getFavoriteListRequest(boardIdx).then(getFavoriteListResponse);
        }

        const onFavoriteClickHandler = () => {
            if(!loginUser || !cookies.accessToken){
                alert('로그인 후 이용해주세요');
                navigator(AUTH_PATH());
                return false;
            }
            if(!boardIdx) return false;
            putFavoriteRequest(boardIdx, cookies.accessToken).then(putFavoriteResponse);
        }
        const onShowFavoriteClickHandler = () => {
            setShowFavorite(!showFavorite);
        }
        const onShowCommentClickHandler = () => {
            setShowComment(!showComment);
        }
        const onCommentChangeHancler = (e:ChangeEvent<HTMLTextAreaElement>) => {
            const {value} = e.target;
            setComment(value);
            if(!commentRef) return false;
            commentRef.current.style.height = 'auto';
            commentRef.current.style.height = `${commentRef.current.scrollHeight}px`;
        }

        const onCommentSubmitButtonClickHandler = () => {
            if(!comment || !boardIdx || !loginUser || !cookies.accessToken) return false;
            const requestBody: PostCommentResponseDto = { content: comment};
            postCommentRequest(boardIdx, requestBody, cookies.accessToken).then(postcommentResonse);
        }

        const postcommentResonse = (responseBody: PostCommentResponseDto | ResponseDto | null) => {
            if(!responseBody) return false;

            const {code} = responseBody;
            if(code === 'VF') alert('잘못된 접근입니다.');
            if(code === 'NU') alert('존재하지 않는 유저입니다.');
            if(code === 'NB') alert('존재하지 않는 게시물입니다.');
            if(code === 'AF') alert('인증에 실패하였습니다.');
            if(code === 'DBE') alert('데이터베이스 오류입니다.');
            if(code !== 'SU') return false;

            if(!boardIdx) return false;
            getCommentListRequest(boardIdx).then(getCommentListResponse);
            setComment('');

        }

        const getFavoriteListResponse = (responseBody: GetFavoriteListResponseDto | ResponseDto | null) => {
            if(!responseBody) return false;
            const {code} = responseBody;
            if(code === "NB") return false;
            if(code === "DBE") return false;
            if(code !== "SU") return false;

            const {favoriteList} = responseBody as GetFavoriteListResponseDto;
            setFavoriteList(favoriteList);
            if(!loginUser) {
                setFavorite(false);
                return false;
            }
            const isFavorite = favoriteList.findIndex(f => f.email === loginUser.email) !== -1;
            setFavorite(isFavorite);
        }

        const getCommentListResponse = (responseBody: GetCommentListResponseDto | ResponseDto | null) => {
            if(!responseBody) return false;
            const {code} = responseBody;
            if(code === "NB") return false;
            if(code === "DBE") return false;
            if(code !== "SU") return false;
            const {commentList} = responseBody as GetCommentListResponseDto;
            setTotalList(commentList);
            setTotalCommentCount(commentList.length);
        }

        useEffect(() => {
            if(!boardIdx) return;
            getFavoriteListRequest(boardIdx).then(getFavoriteListResponse);
            getCommentListRequest(boardIdx).then(getCommentListResponse);
        }, [boardIdx]);

        return (
            <div id="board-detail-bottom">
                <div className="board-detail-bottom-button-box">
                    <div className="board-detail-bottom-button-group">
                        <div className="icon-button" onClick={onFavoriteClickHandler}>
                            {(isFavorite) ? <div className="icon favorite-fill-icon"></div> : <div className="icon favorite-light-icon"></div>}
                        </div>
                        <div className="board-detail-bottom-button-text">좋아요 {favoriteList.length}</div>
                        <div className="icon-button" onClick={onShowFavoriteClickHandler}>
                            {(showFavorite) ? <div className="icon up-light-icon"></div> : <div className="icon down-light-icon"></div>}
                        </div>
                    </div>

                    <div className="board-detail-bottom-button-group">
                        <div className="icon-button">
                            <div className="icon comment-icon"></div>
                        </div>
                        <div className="board-detail-bottom-button-text">댓글 {totalCommentCount}</div>
                        <div className="icon-button" onClick={onShowCommentClickHandler}>
                            {(showComment) ? <div className="icon up-light-icon"></div> : <div className="icon down-light-icon"></div>}
                        </div>
                    </div>
                </div>
                {showFavorite && (
                    <div className="board-detail-bottom-favorite-box">
                        <div className="board-detail-bottom-favorite-container">
                            <div className="board-detail-bottom-favorite-title">좋아요 <span className="emphasis">{favoriteList.length}</span></div>
                            <div className="board-detail-bottom-favorite-contents">
                                {favoriteList.map(item => <FavoriteItem favoriteListItem={item}/>)}
                            </div>
                        </div>
                    </div>
                )}
                {showComment && (
                    <div className="board-detail-bottom-comment-box">
                        <div className="board-detail-bottom-comment-container">
                            <div className="board-detail-bottom-comment-title">댓글 <span className="emphasis">{totalCommentCount}</span> </div>
                            <div className="board-detail-bottom-comment-list-container">
                                {viewList.map(item => <CommentItem commentListItem={item}/>)}
                            </div>
                        </div>
                        <div className="divider"></div>
                        <div className="board-detail-bottom-comment-pagination-box">
                            <Pagination  currentPage={currentPage} currentSection={currentSection} totalSection={totalSection} setCurrentPage={setCurrentPage} setCurrentSection={setCurrentSection} viewPageList={viewPageList}/>
                        </div>
                        {loginUser !== null && (
                            <div className="board-detail-bottom-comment-input-box">
                                <div className="board-detail-bottom-comment-input-container">
                                    <textarea className="board-detail-bottom-comment-textarea" ref={commentRef} placeholder="댓글을 작성해주세요" value={comment} onChange={onCommentChangeHancler}/>
                                    <div className="board-detail-bottom-comment-button-box">
                                        <div className={comment === '' ? 'disable-button' : 'black-button'} onClick={onCommentSubmitButtonClickHandler} >댓글 달기</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div id="board-detail-wrapper">
            <div className="board-detail-container">
                <BoardDetailTop/>
                <BoardDetailBottom/>
            </div>
        </div>
    )
}