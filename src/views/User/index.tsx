import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import './style.css';
import {BoardListItem, User} from "../../types/interface";
import DefaultProfileImage from "../../assets/image/default-profile-image.png";
import {useNavigate, useParams} from "react-router-dom";
import BoardItem from "../../components/BoardItem/index.tsx";
import {BOARD_PATH, BOARD_WRITE_PATH, MAIN_PATH, USER_PATH} from "../../constant/index.ts";
import {useLoginUserStore} from "../../stores/index.ts";
import {
    fileUploadRequest,
    getUserBoardListRequest,
    getUserRequest,
    patchNicknameRequest,
    patchProfileImageRequest
} from "../../apis/index.ts";
import {GetUserResponseDto, PatchProfileImageResponseDto} from "../../apis/response/user";
import {ResponseDto} from "../../apis/response";
import {PatchNicknameRequestDto, PatchProfileImageRequestDto} from "../../apis/request/user";
import {useCookies} from "react-cookie";
import {usePagination} from "../../hooks/index.ts";
import {GetUserBoardListResponseDto} from "../../apis/response/board";
import Pagination from "../../components/Pagination/index.tsx";

export default function Userpage() {
    const [isMyPage, setMypage] = useState<boolean>(false);
    const {userEmail} = useParams();
    const { loginUser } = useLoginUserStore();
    const [cookies, setCookies] = useCookies();

    const navigator = useNavigate();

    const UserTop = () => {

        const imageInputRef = useRef<HTMLInputElement | null>(null);

        const [isNicknameChange, setNicknameChange] = useState<boolean>(false);
        const [nickname, setNickname] = useState<string>('');
        const [changeNickname, setChangeNickname] = useState<string>('')
        const [profileImage, setProfileImage] = useState<string | null>(null);

        const patchNicknameResponse = (responseBody: PatchProfileImageResponseDto | ResponseDto | null) => {
            if(!responseBody) return;
            const {code} = responseBody;
            if(code === "VF") alert("닉네임은 필수입니다.");
            if(code === "DN") alert("중복된 닉네임입니다.");
            if(code === "AF") alert("인증에 실패했습니다");
            if(code === "NU") alert("존재하지 않는 유저입니다.");
            if(code === "DBE") alert("데이터베이스 오류입니다.");
            if(code !== 'SU') return;

            if(!userEmail) return;
            getUserRequest(userEmail).then(getUserResponse);
            setNicknameChange(false);
        }

        const onNicknameEditButtonClickHandler = () => {
            if(!isNicknameChange) {
                setChangeNickname(nickname);
                setNicknameChange(!isNicknameChange);
                return false;
            }
            if(!cookies.accessToken) return false;
            const requestBody: PatchNicknameRequestDto = {
                nickname: changeNickname
            }
            patchNicknameRequest(requestBody, cookies.accessToken).then(patchNicknameResponse);
        }

        const onProfileBoxClickHandler= () => {
            if(!isMyPage) return false;
            if(!imageInputRef.current) return false;
            imageInputRef.current.click();
        }

        const patchProfileImageResponse = (responseBody: PatchProfileImageResponseDto | ResponseDto | null) => {
            if(!responseBody) return false;
            const {code} = responseBody;
            if(code === "AF") alert("인증에 실패했습니다.");
            if(code === "NU") alert("존재하지 않는 유저입니다.");
            if(code === "DBE") alert("데이터베이스 오류입니다.");
            if(code !== "SU") return false;

            if(!userEmail) return;
            getUserRequest(userEmail).then(getUserResponse);
        }

        const fileUploadResponse = (profileImage: string | null) => {
            if(!profileImage) return false;
            if(!cookies.accessToken) return false
            const requestBody: PatchProfileImageRequestDto = {profileImage};
            patchProfileImageRequest(requestBody, cookies.accessToken).then(patchProfileImageResponse)

        }

        const  onProfileImageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            if(!event.target.files || !event.target.files.length) return false;
            const file = event.target.files[0];
            const data = new FormData();
            data.append('file', file);

            fileUploadRequest(data).then(fileUploadResponse);
        }

        const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const { value } = event.target;
            setChangeNickname(value);
        }

        const getUserResponse = (responseBody: GetUserResponseDto | ResponseDto | null) => {
            if(!responseBody) return false;
            const {code} = responseBody;
            if(code === "DBE") alert("데이터베이스 오류입니다.");
            if(code === "NU") alert("존재하지 않는 유저입니다.");
            if(code !== "SU") {
                navigator(MAIN_PATH());
                return false;
            }
            const {email, nickname, profileImage} = responseBody as GetUserResponseDto;
            setNickname(nickname);
            setProfileImage(profileImage);
            const isMyPage = (email === loginUser?.email);
            setMypage(isMyPage);
        }

        useEffect(() => {
            if(!userEmail) return;
            getUserRequest(userEmail).then(getUserResponse);
        }, [userEmail]);

        if(!userEmail) return(<></>);
        return (
            <div id="user-top-wrapper">
                <div className="user-top-container">
                    { isMyPage ?
                        <div className='user-top-my-profile-image-box' onClick={onProfileBoxClickHandler}>
                            {profileImage !== null ?
                                <div className="user-top-profile-image" style={{backgroundImage: `url(${profileImage})`}}></div> :
                                <div className="icon-box-large">
                                    <div className="icon image-box-white-icon"></div>
                                </div>
                            }
                            <input ref={imageInputRef} type="file" accept="image/*" style={{display: 'none'}} onChange={onProfileImageChangeHandler}/>
                        </div>
                        :
                        <div className='user-top-profile-image-box' style={{backgroundImage: `url(${profileImage ? profileImage : DefaultProfileImage})`}}></div>
                    }
                    <div className="user-top-info-box">
                        <div className="user-top-info-nickname-box">
                            {isMyPage ?
                                <>
                                    {isNicknameChange ?
                                        <input className="user-top-info-nickname-input" type="text" size={changeNickname.length+1} value={changeNickname} onChange={onNicknameChangeHandler} /> :
                                        <div className="user-top-info-nickname">{nickname}</div>
                                    }

                                    <div className="icon-button" onClick={onNicknameEditButtonClickHandler}>
                                        <div className="icon edit-icon"></div>
                                    </div>
                                </>
                                :<></>
                            }
                            <div className="user-top-info-email">{'email@email.com'}</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const UserBottom = () => {
        const { currentPage, setCurrentPage, currentSection, setCurrentSection, viewList, viewPageList, totalSection, setTotalList} = usePagination<BoardListItem>(5);
        const [count, setCount] = useState<number>(1);

        const onSideCardClickHandler = () => {
            if(isMyPage) navigator(BOARD_PATH() + '/' + BOARD_WRITE_PATH());
            else if(loginUser) {
                navigator(USER_PATH(loginUser.email));
            }
        }

        const getUserBoardListResponse = (responseBody: GetUserBoardListResponseDto | ResponseDto | null) => {
            if(!responseBody) return false;
            const {code} = responseBody;
            if(code === "NU") {
                alert("존재하지 않는 유저입니다.");
                navigator(MAIN_PATH());
                return false;
            }
            if(code === "DBE") alert("데이터베이스 오류입니다.");
            if(code !== "SU") return false;

            const {userBoardList} = responseBody as GetUserBoardListResponseDto;
            setTotalList(userBoardList);
            setCount(userBoardList.length);
        }

        useEffect(() => {
            if(!userEmail) return;
            getUserBoardListRequest(userEmail).then(getUserBoardListResponse);
        }, [userEmail]);
        
        return (
            <div id="user-bottom-wrapper">
                <div className="user-bottom-container">
                    <div className="user-bottom-title">{isMyPage ? '내 게시물' : '게시물'}<span className="emphasis">{count}</span></div>
                    <div className="user-bottom-contents-box">
                        {count === 0 ?
                            <div className="user-bottom-contents-nothing">게시물이 없습니다</div> :
                            <div className="user-bottom-contents">
                                {viewList.map(b => <BoardItem boardListItem={b}/>)}
                            </div>
                        }
                        <div className="user-bottom-side-box">
                            <div className="user-bottom-side-card" onClick={onSideCardClickHandler}>
                                <div className="user-bottom-side-container">
                                    {isMyPage ?
                                        <>
                                            <div className="icon-box">
                                                <div className="icon edit-icon"></div>
                                            </div>
                                            <div className="user-bottom-side-text">글쓰기</div>
                                        </>
                                        :
                                        <>
                                            <div className="user-bottom-side-text">내 게시물으로 가기</div>
                                            <div className="icon-box">
                                                <div className="icon arrow-right-icon"></div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="user-bottom-pagination-box">
                        { count !== 0 && <Pagination currentPage={currentPage} currentSection={currentSection} setCurrentPage={setCurrentPage} setCurrentSection={setCurrentSection}
                                                     viewPageList={viewPageList} totalSection={totalSection}/> }
                    </div>
                </div>

            </div>
        )
    }
    return (
        <>
            <UserTop/>
            <UserBottom/>
        </>
    )
}