import React, {useEffect, useState} from 'react';
import './style.css';
import Top3Item from "../../components/Top3Item/index.tsx";
import {BoardListItem} from "../../types/interface";
import BoardItem from "../../components/BoardItem/index.tsx";
import Pagination from "../../components/Pagination/index.tsx";
import {useNavigate} from "react-router-dom";
import {SEARCH_PATH} from "../../constant/index.ts";
import {
    getLatestBoardListRequest, getPopularListRequest,
    getTop3BoardListRequest
} from "../../apis/index.ts";
import {GetLatestBoardListResponseDto, GetTop3BoardListResponseDto} from "../../apis/response/board";
import {ResponseDto} from "../../apis/response";
import {usePagination} from "../../hooks/index.ts";
import {GetPopularListResponseDto} from "../../apis/response/search";

export default function Main() {

    const navigator = useNavigate();

    const MainTop = () => {

        const [top3List, setTop3List] = useState<BoardListItem[]>([]);

        const getTop3BoardListResponse = (responseBody: GetTop3BoardListResponseDto | ResponseDto | null) => {
            if(!responseBody) return false;
            const {code} = responseBody;
            if(code === "DBE") alert("데이터베이스 오류입니다.");
            if(code !== "SU") return false;

            const {top3List} = responseBody as GetTop3BoardListResponseDto;
            setTop3List(top3List);
        }

        useEffect(() => {
            getTop3BoardListRequest().then(getTop3BoardListResponse);
        }, []);

        return (
            <div id="main-top-wrapper">
                <div className="main-top-container">
                    <div className="main-top-title">Blog에서 다양한 이야기를 나눠보세요.</div>
                    <div className="main-top-contents-box">
                        <div className="main-top-contents-title">주간 TOP 3 게시물</div>
                        <div className="main-top-contents">
                            {top3List.map(list => <Top3Item top3ListItem={list} />)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const MainBottom = () => {

        const { currentPage, setCurrentPage, currentSection, setCurrentSection, viewList, viewPageList, totalSection, setTotalList} = usePagination<BoardListItem>(5);
        const [popularWordList, setPopularWordList] = useState<String[]>([]);

        const getLatestBoardListResponse = (responseBody: GetLatestBoardListResponseDto | ResponseDto | null) => {
            if(!responseBody) return false;
            const {code} = responseBody;
            if(code === "DBE") alert("데이터베이스 오류입니다.");
            if(code !== "SU") return false;

            const { latestList } = responseBody as GetLatestBoardListResponseDto;
            setTotalList(latestList);
        }

        const getPopularListResponse = (responseBody: GetPopularListResponseDto | ResponseDto | null) => {
            if(!responseBody) return false;
            const { code } = responseBody;
            if(code === "DBE") alert("데이터베이스 오류입니다.");
            if(code !== "SU") return false;

            const { popularWordList } = responseBody as GetPopularListResponseDto;
            setPopularWordList(popularWordList)
        }

        useEffect(() => {
            getLatestBoardListRequest().then(getLatestBoardListResponse);
            getPopularListRequest().then(getPopularListResponse);
        }, []);

        const onPopularWordClickHandler = (word: string) => {
            navigator(SEARCH_PATH(word));
        }

        return (
            <div id="main-bottom-wrapper">
                <div className="main-bottom-container">
                    <div className="main-bottom-title">최신 게시물</div>
                    <div className="main-bottom-contents-box">
                        <div className="main-bottom-latest-contents">
                            {viewList.map(b => <BoardItem boardListItem={b} />)}
                        </div>
                        <div className="main-bottom-popular-box">
                            <div className="main-bottom-popular-card">
                                <div className="main-bottom-popular-card-container">
                                    <div className="main-bottom-popular-card-title">인기 검색어</div>
                                    <div className="main-bottom-popular-card-contents">
                                        {popularWordList.map(p => <div className="word-badge" onClick={() => onPopularWordClickHandler(p)}>{p}</div>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="main-bottom-pagination-box">
                            <Pagination currentPage={currentPage} currentSection={currentSection} setCurrentPage={setCurrentPage} setCurrentSection={setCurrentSection}
                                        viewPageList={viewPageList} totalSection={totalSection}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <MainTop />
            <MainBottom />
        </>
    )

}