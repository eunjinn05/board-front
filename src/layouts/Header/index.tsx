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
        const {searchWord} = useParams();

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
            if(searchWord) {
                setWord(searchWord);
                setStatus(true);
            }
        }, [searchWord]);

        if (!status) {
            return (
                <div className="icon-button" onClick={onSearchButtonClickHandler}>
                    <div className="icon search-light-icon"></div>
                </div>
            )
        } else {
            return (
                <div className="header-search-input-box">
                    <input className="header-search-input" type="text" placeholder="검색어를 입력하세요" value={searchWord} onChange={onSearchWordChangeHandler} onKeyDown={onSearchWordKeyDownHandler}/>
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
            resetLoginUser()
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
        const onUploadButtonClickHandler = () => {
            return;
        }

        if (title && content)
            return <div className="black-button" onClick={aa}>업로드</div>
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