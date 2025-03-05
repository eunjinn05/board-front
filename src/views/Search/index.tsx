import React, {useEffect, useState} from 'react';
import './style.css';
import {useNavigate, useParams} from "react-router-dom";
import {BoardListItem} from "../../types/interface";
import BoardItem from "../../components/BoardItem/index.tsx";
import {SEARCH_PATH} from "../../constant/index.ts";
import {getRelationListRequest, getSearchBoardListRequest} from "../../apis/index.ts";
import {GetSearchBoardListResponseDto} from "../../apis/response/board";
import {ResponseDto} from "../../apis/response";
import {usePagination} from "../../hooks/index.ts";
import Pagination from "../../components/Pagination/index.tsx";
import {GetRelationListResponseDto} from "../../apis/response/search";

export default function Search() {

    const { searchWord } = useParams();
    const [count, setCount] = useState<number>(0);
    const [relationWordList, setRelationList] = useState<string[]>([]);
    const [preSearchWord, setPreSearchWord] = useState<string | null>('');
    const { currentPage, setCurrentPage, currentSection, setCurrentSection, viewList, viewPageList, totalSection, setTotalList} = usePagination<BoardListItem>(5);

    const navigator = useNavigate();

    const getSearchBoardListResponse = (responseBody: GetSearchBoardListResponseDto | ResponseDto | null) => {
        if (!responseBody) return false;
        const {code} = responseBody;
        if(code === "DBE") alert("데이터베이스 오류입니다.");
        if(code !== "SU") return false;

        if(!searchWord) return false;
        const { searchList } = responseBody as GetSearchBoardListResponseDto;
        setTotalList(searchList);
        setCount(searchList.length);
        setPreSearchWord(searchWord);
    }

    const getRelationListResponse = (responseBody: GetRelationListResponseDto | ResponseDto | null) => {
        if(!responseBody) return false;
        const {code} = responseBody;
        if(code === "DBE") alert("데이터베이스 오류입니다.");
        if(code !== "SU") return false;

        const {relationWordList} = responseBody as GetRelationListResponseDto;
        setRelationList(relationWordList);

    }

    useEffect(() => {
        if(!searchWord) return;
        getSearchBoardListRequest(searchWord, preSearchWord).then(getSearchBoardListResponse);
        getRelationListRequest(searchWord).then(getRelationListResponse);
    }, [searchWord]);

    const onRelationWordClickHandler = (word: string) => {
        navigator(SEARCH_PATH(word));
    }

    if(!searchWord) return (<></>)

    return (
        <div id="search-wrapper">
            <div className="search-container">
                <div className="search-title-box">
                    <div className="search-title"><span className="search-title-emphasis">{searchWord}</span><span>에 대한 검색 결과입니다.</span> </div>
                    <div className="search-count">{count}</div>
                </div>
                <div className="search-contents-box">
                    <div className="search-contents">
                        {count === 0 ?
                            <div className="search-contents-nothing">검색 결과가 없습니다.</div> :
                            <div className="search-contents">
                                {viewList.map(b => <BoardItem boardListItem={b} />)}
                            </div>
                        }
                    </div>
                    <div className="search-relation-box">
                        <div className="search-relation-card">
                            <div className="search-relation-card-container">
                                <div className="search-relation-card-title">관련 검색어</div>
                                {relationWordList.length === 0 ?
                                    <div className="search-relation-card-contents-nothing">관련 검색어가 없습니다.</div> :
                                    <div className="search-relation-card-contents">
                                        {relationWordList.map(word => <div className="word-badge" onClick={() => onRelationWordClickHandler(word)}>{word}</div>)}
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="search-pagination-box">
                    { count !== 0 && <Pagination currentPage={currentPage} currentSection={currentSection} setCurrentPage={setCurrentPage} setCurrentSection={setCurrentSection}
                                                 viewPageList={viewPageList} totalSection={totalSection}/> }
                </div>
            </div>
        </div>
    )
}