import React, {useState} from 'react';
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

function App() {

    const [value, setValue] = useState<string>()
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

        <Footer />

    </>
  );
}

export default App;
