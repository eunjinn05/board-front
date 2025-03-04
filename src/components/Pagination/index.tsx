import React, {Dispatch, SetStateAction} from 'react';
import './style.css';

interface Props {
    currentPage: number;
    setCurrentPage: Dispatch<SetStateAction<number>>;
    currentSection: number;
    setCurrentSection: Dispatch<SetStateAction<number>>;
    viewPageList: number[];
    totalSection: number;
}

export default function pagination(props: Props) {

    const {currentPage, currentSection, viewPageList, totalSection, setCurrentPage, setCurrentSection} = props;

    const onPageClickHandler = (page: number) => {
        setCurrentPage(page);
    }

    const onPrevClickHandler = () => {
        if (currentSection === 1) return false;
        setCurrentPage((currentSection -1) * 10);
        setCurrentSection(currentSection -1);
    }

    const onNextClickHandler = () => {
        if(currentSection === currentPage) return false;
        setCurrentPage(currentSection * 10 + 1);
        setCurrentSection(currentSection + 1);
    }

    return (
        <div id='pagination-wrapper'>
            <div className="pagination-change-link-box">
                <div className="icon-box-small">
                    <div className="icon expand-left-icon"></div>
                </div>
                <div className="pagination-change-link-text" onClick={onPrevClickHandler}>이전</div>
            </div>
            <div className="pagination-divider">{'|'}</div>

            {viewPageList.map(page => page === currentPage ? <div className="pagination-text-active">{page}</div> : <div className="pagination-text" onClick={() => onPageClickHandler(page)}>{page}</div> )}

            <div className="pagination-divider">{'|'}</div>
            <div className="pagination-change-link-box">
                <div className="pagination-change-link-text" onClick={onNextClickHandler}>다음</div>
                <div className="icon-box-small">
                    <div className="icon expand-right-icon"></div>
                </div>
            </div>
        </div>
    )
}