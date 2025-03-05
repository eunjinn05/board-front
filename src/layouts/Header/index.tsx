import React, {ChangeEvent, KeyboardEvent, useEffect, useRef, useState} from 'react';
import './style.css';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {
    AUTH_PATH,
    BOARD_DEATIL_PATH, BOARD_PATH, BOARD_UPDATE_PATH,
    BOARD_WRITE_PATH,
    MAIN_PATH,
    SEARCH_PATH,
    USER_PATH
} from "../../constant/index.ts";
import {useCookies} from "react-cookie";
import LoginUserStore from "../../stores/login-user.store.ts";
import useBoardStore from "../../stores/board.store.ts";
import {fileUploadRequest, patchBoardRequest, postBoardRequest} from "../../apis/index.ts";
import {PatchBoardRequestDto, PostBoardRequestDto} from "../../apis/request/board";
import {PostBoardResponseDto} from "../../apis/response/board";
import {ResponseDto} from "../../apis/response";

export default function Header() {

    const {loginUser, setLoginUser, resetLoginUser } = LoginUserStore()
    const { pathname } = useLocation();
    const [cookies, setCookie] = useCookies();

    const [isLogin, setLogin] = useState<boolean>(false);
    const [isAuthPage, setAuthPage] = useState<boolean>(false);
    const [isMainPage, setMainPage] = useState<boolean>(false);
    const [isSearchPage, setSearchPage] = useState<boolean>(false);
    const [isBoardDetailPage, setBoardDetailPage] = useState<boolean>(false);
    const [isBoardWritePage, setBoardWritePage] = useState<boolean>(false);
    const [isBoardUpdatePage, setBoardUpdatePage] = useState<boolean>(false);
    const [isUserPage, setUserPage] = useState<boolean>(false);

    const navigator = useNavigate();

    const onLogoClickHandler = () => {
        navigator(MAIN_PATH());
    }

    const SearchButton = () => {
        const [status, setStatus] = useState<boolean>(false);
        const [Word, setWord] = useState<String>('');
        const searchButtonRef = useRef<HTMLDivElement | null>(null);
        const {word} = useParams();

        const onSearchWordKeyDownHandler = (e:KeyboardEvent<HTMLInputElement>) => {
            if (e.key !== 'Enter') return;
            if (!searchButtonRef.current) return;
            searchButtonRef.current.click();
        }

        const onSearchWordChangeHandler = (e:ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setWord(value);
        }

        const onSearchButtonClickHandler = () => {
            if(!status) {
                setStatus(!status);
                return;
            }
            navigator(SEARCH_PATH(Word));
        }

        useEffect(() => {
            if(word) {
                setWord(word);
                setStatus(true);
            }
        }, [word]);

        if (!status) {
            return (
                <div className="icon-button" onClick={onSearchButtonClickHandler}>
                    <div className="icon search-light-icon"></div>
                </div>
            )
        } else {
            return (
                <div className="header-search-input-box">
                    <input className="header-search-input" type="text" placeholder="검색어를 입력하세요" value={word} onChange={onSearchWordChangeHandler} onKeyDown={onSearchWordKeyDownHandler}/>
                    <div ref={searchButtonRef} className="icon-button" onClick={onSearchButtonClickHandler}>
                        <div className="icon search-light-icon"></div>
                    </div>
                </div>
            )
        }
    }

    const MyPageButton = () => {

        const { userEmail } = useParams();

        // 마이페이지 이동
        const onMyPageButtonClickHandler = () => {
            if (!loginUser) return;
            const {email} = loginUser;
            navigator(USER_PATH(email));
        }

        const onSignOutButtonClickHandler = () => {
            resetLoginUser();
            setCookie('accessToken', '', { path: MAIN_PATH(), expires: new Date() })
            navigator(MAIN_PATH());
        }

        // 로그인 페이지 이동
        const onSignInButtonClickHandler = () => {
            navigator(AUTH_PATH())
        }
        if(isLogin) {
            if(userEmail === loginUser?.email)  return <div className="black-button" onClick={onSignOutButtonClickHandler}>로그아웃</div>
            return (
                    <div className="white-button" onClick={onMyPageButtonClickHandler}>마이페이지</div>
            )
        } else {
            return (
                <div className="black-button" onClick={onSignInButtonClickHandler}>로그인</div>
            )
        }
    }

    const UploadButton = () => {
        const { title, content, boardImageFileList, resetBoard } = useBoardStore();
        const {boardIdx} = useParams();

        const postBoardResponse = (responseBody: PostBoardResponseDto | ResponseDto | null) => {
            if(!responseBody) return false;
            const {code} = responseBody.code;
            if(code === "DBE") alert("데이터베이스 오류입니다.");
            if(code === 'AF' || code === 'NU') navigator(AUTH_PATH());
            if(code === 'VF') alert('제목과 내용은 필수입니다.');
            if(code === 'SU') return;

            resetBoard();
            if(!loginUser) return false;
            const { email } = loginUser;
            navigator(USER_PATH(email));
        }

        const onUploadButtonClickHandler = async () => {
            const accessToken = cookies.accessToken;
            if(!accessToken) return false;

            const boardImageList: string[] = [];
            for (const file of boardImageFileList) {
                const data = new FormData();
                data.append('file', file);

                const url = await fileUploadRequest(data);
                if(url) boardImageList.push(url);
            }

            const isPath = pathname === BOARD_PATH() + '/' + BOARD_WRITE_PATH();
            if(isPath) {
                const requestBody: PostBoardRequestDto = {title, content, boardImageList};
                postBoardRequest(requestBody,accessToken).then(postBoardResponse);
            } else {
                if(!boardIdx) return false;
                const requestBody: PatchBoardRequestDto = {title, content, boardImageList};
                patchBoardRequest(boardIdx, requestBody, accessToken).then(patchBoardResponse);
            }
        }
        const patchBoardResponse = (resonseBody: PatchBoardRequestDto | ResponseDto | null) => {
            if(!resonseBody) return false;
            const {code} = resonseBody;
            if(code === "DBE") alert("데이터베이스 오류입니다.");
            if(code === "AF" || code === "NU" || code === "NB" || code === "NP") navigator(AUTH_PATH());
            if(code === "VF") alert("제목과 내용은 필수입니다.");
            if(code !== "SU") return false;

            if (!boardIdx) return false;
            navigator(BOARD_PATH() + '/' + BOARD_DEATIL_PATH(boardIdx));
        }

        if (title && content)
            return <div className="black-button" onClick={onUploadButtonClickHandler}>업로드</div>
        return <div className="disable-button">업로드</div>
    };
    useEffect(() => {
        const isAuthPage = pathname.startsWith(AUTH_PATH());
        setAuthPage(isAuthPage)
        const isMainPage = pathname === MAIN_PATH();
        setMainPage(isMainPage);
        const isSearchPage = pathname.startsWith(SEARCH_PATH(''));
        setSearchPage(isSearchPage);
        const isBoardDetailPage = pathname.startsWith(BOARD_PATH() + '/' +BOARD_DEATIL_PATH(''));
        setBoardDetailPage(isBoardDetailPage);
        const isBoardWritePage = pathname.startsWith(BOARD_PATH() + '/' + BOARD_WRITE_PATH());
        setBoardWritePage(isBoardWritePage);
        const isBoardUpdatePage = pathname.startsWith(BOARD_PATH() + '/' + BOARD_UPDATE_PATH(''));
        setBoardUpdatePage(isBoardUpdatePage);
        const isUserPage = pathname.startsWith(USER_PATH(''));
        setUserPage(isUserPage);
    }, [pathname]);

    useEffect(() => {
        setLogin(loginUser !== null);
    }, [loginUser]);

    return (
        <div id="header">
            <div className="header-container">
                <div className="header-left-box" onClick={onLogoClickHandler}>
                    <div className="icon-box">
                        <div className="icon logo-dark-icon"></div>
                    </div>
                    <div className="header-logo">Blog</div>
                </div>
                <div className="header-right-box">
                    {(isAuthPage || isMainPage || isSearchPage || isBoardDetailPage) && <SearchButton /> }
                    {(isMainPage || isBoardDetailPage || isSearchPage || isUserPage) && <MyPageButton />}
                    {(isBoardWritePage || isBoardUpdatePage) && <UploadButton /> }
                </div>
            </div>
        </div>
    )
}