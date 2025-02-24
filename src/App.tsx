import React, {useEffect, useState} from 'react';
import './App.css';

import BoardItem from "./components/BoardItem/index.tsx";
import latestBoardListMock from "./mocks/latest-board-list.mock.ts";
import {BoardListItem} from "./types/interface/index.ts";

import Top3Item from "./components/Top3Item/index.tsx";
import top3BoardListMock from "./mocks/top-3-board-list.mock.ts";

import commentListMock from "./mocks/comment-board-list.mock.ts";
import CommentItem from "./components/CommentItem/index.tsx";

import favoriteListMock from "./mocks/favorite-list-mock.ts";
import FavoriteItem from "./components/FavoriteItem/index.tsx";

import InputBox from "./components/InputBox/index.tsx";

import Footer from "./layouts/Footer/index.tsx";

import {Route, Routes} from "react-router-dom";
import Main from "./views/Main/index.tsx";
import Authentication from "./views/Authentication/index.tsx";
import Search from "./views/Search/index.tsx";
import UserP from "./views/User/index.tsx";
import BoardDetail from "./views/Board/detail/index.tsx";
import BoardWrite from "./views/Board/write/index.tsx";
import BoardUpdate from "./views/Board/update/index.tsx";
import Container from "./layouts/container/index.tsx";
import {
    AUTH_PATH,
    BOARD_DEATIL_PATH,
    BOARD_PATH, BOARD_UPDATE_PATH,
    BOARD_WRITE_PATH,
    MAIN_PATH,
    SEARCH_PATH,
    USER_PATH
} from "./constant/index.ts";
import {useCookies} from "react-cookie";
import {useLoginUserStore} from "./stores/index.ts";
import {GetSignInUserResponseDto} from "./apis/response/user";
import {ResponseDto} from "./apis/response";
import {User} from "./types/interface";
import {getSignInUserRequest} from "./apis/index.ts";


function App() {

    const [value, setValue] = useState<string>()

    const [cookies, setCookies] = useCookies();
    const {setLoginUser, resetLoginUser} = useLoginUserStore();

    useEffect(() => {
        if (!cookies.accessToken) {
            resetLoginUser();
            return;
        }
        getSignInUserRequest(cookies.accessToken).then(getSignInUserResponse);
    }, [cookies.accessToken]);

    const getSignInUserResponse = (responseBody:GetSignInUserResponseDto | ResponseDto | null) => {
        if (!responseBody) return false;
        const code  = responseBody.code;
        if (code === 'AF' || code === 'NU' || code === 'DBE') {
            resetLoginUser();
            return false;
        }
        const loginUser: User = { ...responseBody as GetSignInUserResponseDto };
        setLoginUser(loginUser);
    }

  return (
    <>
        {/*{latestBoardListMock.map(BoardListItem => <BoardItem boardListItem={BoardListItem} />)}*/}

        {/*<div style={{display: 'flex', justifyContent: 'center', gap: '24px'}}>*/}
        {/*    {top3BoardListMock.map(top3ListItem => <Top3Item top3ListItem={top3ListItem} />)}*/}
        {/*</div>*/}

        {/*<div style={{padding: '0 20px', display:"flex", flex_direction:'column', gap:'30px'}}>*/}
        {/*    {commentListMock.map(commentItemList => <CommentItem commentListItem={commentItemList} />) }*/}
        {/*</div>*/}

        {/*<div style={{display: 'flex', columnGap: '30px', rowGap: '20px'}}>*/}
        {/*    {favoriteListMock.map(favoriteListItem => <FavoriteItem favoriteListItem={favoriteListItem} />) }*/}
        {/*</div>*/}

        {/*<InputBox label='이메일' type='text' placeholder='이메일 주소를 입력해주세요.' value={value} error={false} setValue={setValue}/>*/}

        {/*<Footer />*/}

        <Routes>
            <Route element={<Container />}>
                <Route path={MAIN_PATH()} element={<Main />}></Route>
                <Route path={AUTH_PATH()} element={<Authentication />}></Route>
                <Route path={SEARCH_PATH(':searchWord')} element={<Search />}></Route>
                <Route path={USER_PATH(':userEmail')} element={<UserP />}></Route>
                <Route path={BOARD_PATH()}>
                    <Route path={BOARD_DEATIL_PATH(':boardNumber')} element={<BoardDetail />} />
                    <Route path={BOARD_WRITE_PATH()} element={<BoardWrite />} />
                    <Route path={BOARD_UPDATE_PATH(':boardNumber')} element={<BoardUpdate />} />
                </Route>
                <Route path="*" element={<h1>404 Not Found</h1>} />
            </Route>
        </Routes>
    </>
  );
}

export default App;
