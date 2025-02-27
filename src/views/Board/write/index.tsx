import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import './style.css';
import {useBoardStore} from "../../../stores/index.ts";
import {useNavigate} from "react-router-dom";
import {MAIN_PATH} from "../../../constant/index.ts";
import {useCookies} from "react-cookie";

export default function BoardWrite() {

    const titleRef = useRef<HTMLTextAreaElement | null>(null);
    const contentRef = useRef<HTMLTextAreaElement | null>(null);
    const imageInputRef = useRef<HTMLInputElement | null>(null);

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
        if (!e.target.files || e.target.files.length == 0) return false;
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


    useEffect(() => {
        const access_token = cookies.accessToken;
        if (!access_token) {
            navigator(MAIN_PATH());
            return;
        }
        resetBoard();
    }, []);

    return (
        <div id="board-write-wrapper">
            <div className="board-write-container">
                <div className="board-write-box">
                    <div className="board-write-title-box">
                        <textarea className="board-write-title-textarea" value={title} type="text" ref={titleRef} rows={1} placeholder="제목을 작성해주세요." onChange={onTitleChangeHandler}/>
                    </div>
                    <div className="divider"></div>
                    <div className="board-write-content-box">
                        <textarea className="board-write-content-textarea" value={content} placeholder="본문을 작성해주세요." ref={contentRef} onChange={onContentChangeHandler}/>
                        <div className="icon-button" onClick={onImageUploadButtonClickHandler}>
                            <div className="icon image-box-light-icon"></div>
                        </div>
                        <input type="file" accept="image/*" style={{display:'none'}} ref={imageInputRef} onChange={onImageChangeHandler}/>
                    </div>
                    { imageUrls.map((image, index) => (
                        <div className="board-write-images-box">
                            <div className="board-write-image-box">
                                <img className="board-write-image" src={image} />
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