import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import './style.css';
import {useBoardStore} from "../../../stores/index.ts";
import {useNavigate, useParams} from "react-router-dom";
import {MAIN_PATH} from "../../../constant/index.ts";
import {useCookies} from "react-cookie";
import {useLoginUserStore} from "../../../stores/index.ts";
import {getBoardRequest} from "../../../apis/index.ts";
import {GetBoardResponseDto} from "../../../apis/response/board";
import {ResponseDto} from "../../../apis/response";
import {convertUrlsToFile} from "../../../utils/index.ts";

export default function BoardUpdate() {

    const titleRef = useRef<HTMLTextAreaElement | null>(null);
    const contentRef = useRef<HTMLTextAreaElement | null>(null);
    const imageInputRef = useRef<HTMLInputElement | null>(null);
    const { boardIdx } = useParams();
    const { loginUser } = useLoginUserStore();

    const {title, setTitle, content, setContent, boardImageFileList, setboardImageFileList, resetBoard} = useBoardStore();
    const [cookies, setCookies] = useCookies();

    const [imageUrls, setImageUrls] = useState<string[]>([]);

    const navigator = useNavigate();

    const onTitleChangeHandler = (e:ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.target;
        setTitle(value);

        if (!titleRef.current) return false;
        titleRef.current.style.height = "auto";
        titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    }

    const onContentChangeHandler = (e:ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.target;
        setContent(value);

        if (!contentRef.current) return false;
        contentRef.current.style.height = "auto";
        contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
    }

    const onImageUploadButtonClickHandler = () => {
        if (!imageInputRef.current) return false;
        imageInputRef.current.click();
    }

    const onImageChangeHandler = (e:ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return false;
        const file = e.target.files[0];
        const imageUrl = URL.createObjectURL(file);
        const newImageUrls = imageUrls.map(item => item);
        newImageUrls.push(imageUrl);
        setImageUrls(newImageUrls);

        const newBoardImageFileList = boardImageFileList.map(item => item);
        newBoardImageFileList.push(file);
        setboardImageFileList(newBoardImageFileList);
    }

    const onImageCloseButtonClickHandler = (deleteIndex: number) => {
        if(!imageInputRef.current) return false;
        imageInputRef.current.value = '';

        const newImageUrls = imageUrls.filter((url, index) => index !== deleteIndex);
        setImageUrls(newImageUrls);

        const newBoardImageFileList = boardImageFileList.filter((filter, index) => index !== deleteIndex);
        setboardImageFileList(newBoardImageFileList);

        if(!imageInputRef.current) return false;
        imageInputRef.current.value = '';
    }

    const getBoardResponse = (responseBody: GetBoardResponseDto | ResponseDto | null) => {
        if(!responseBody) return false;
        const {code} = responseBody;
        if(code === "NB") alert("존재하지 않는 게시물입니다.");
        if(code === "DBE") alert("데이터베이스 오류입니다.");
        if(code !== "SU") {
            navigator(MAIN_PATH());
            return false;
        }
        const {title, content, boardImageList, writerEmail} = responseBody as GetBoardResponseDto;
        setTitle(title);
        setContent(content);
        setImageUrls(boardImageList);
        convertUrlsToFile(boardImageList).then(files => setboardImageFileList(files));

        if(!loginUser || loginUser.email !== writerEmail){
            navigator(MAIN_PATH());
            return false;
        }

        if (!contentRef.current) return false;
        contentRef.current.style.height = "auto";
        contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
    }

    useEffect(() => {
        const access_token = cookies.accessToken;
        if (!access_token) {
            navigator(MAIN_PATH());
            return;
        }
        if(!boardIdx) return;
        getBoardRequest(boardIdx).then(getBoardResponse);
    }, [boardIdx]);

    return (
        <div id="board-update-wrapper">
            <div className="board-update-container">
                <div className="board-update-box">
                    <div className="board-update-title-box">
                        <textarea className="board-update-title-textarea" value={title} type="text" ref={titleRef} rows={1} placeholder="제목을 작성해주세요." onChange={onTitleChangeHandler}/>
                    </div>
                    <div className="divider"></div>
                    <div className="board-update-content-box">
                        <textarea className="board-update-content-textarea" value={content} placeholder="본문을 작성해주세요." ref={contentRef} onChange={onContentChangeHandler}/>
                        <div className="icon-button" onClick={onImageUploadButtonClickHandler}>
                            <div className="icon image-box-light-icon"></div>
                        </div>
                        <input type="file" accept="image/*" style={{display:'none'}} ref={imageInputRef} onChange={onImageChangeHandler}/>
                    </div>
                    { imageUrls.map((image, index) => (
                        <div className="board-update-images-box">
                            <div className="board-update-image-box">
                                <img className="board-update-image" src={image} />
                                <div className="icon-button image-close" onClick={() => onImageCloseButtonClickHandler(index)}>
                                    <div className="icon close-icon"> </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}