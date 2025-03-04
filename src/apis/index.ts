import {SignInRequestDto, SignUpRequestDto} from "./request/auth";
import axios, {request} from "axios";
import {SignUpResponseDto} from "./response/auth";
import {ResponseDto} from "./response";
import {GetSignInUserResponseDto} from "./response/user";
import {PostBoardRequestDto} from "./request/board";
import {
    PostBoardResponseDto,
    GetBoardResponseDto,
    IncreaseBoardViewCountResponseDto,
    GetCommentListResponseDto, PutFavoriteResponseDto, PostCommentResponseDto, DeleteBoardResponseDto
} from "./response/board";

const DOMAIN = 'http://localhost:4000';
const API_DOMAIN = `${DOMAIN}/api/v1`;
const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in`;
const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`;
const GET_SIGN_IN_URL = () => `${API_DOMAIN}/user`;
const FILE_DOMAIN = () => `${DOMAIN}/file`;
const FILE_UPLOAD_URL = () => `${FILE_DOMAIN()}/upload`;
const POST_BOARD_URL = () => `${API_DOMAIN}/board`;
const GET_BOARD_URL = (boardIdx: number | string) => `${API_DOMAIN}/board/${boardIdx}`;
const INCREASE_VIEW_COUNT_URL = (boardIdx : number | string) => `${API_DOMAIN}/board/${boardIdx}/increase-view-count`;
const GET_FAVORITE_LIST_URL = (boardIdx) => `${API_DOMAIN}/board/${boardIdx}/favorite-list`;
const GET_COMMENT_LIST_URL = (boardIdx) => `${API_DOMAIN}/board/${boardIdx}/comment-list`;
const PUT_FAVORITE_URL = (boardIdx) => `${API_DOMAIN}/board/${boardIdx}/favorite`;
const POST_COMMENT_URL = (boardIdx: number | string) =>`${API_DOMAIN}/board/${boardIdx}/comment`;
const DELETE_BOARD_URL = (boardIdx: number | string) => `${API_DOMAIN}/board/${boardIdx}`

const authorization = (accessToken: string) => {return { headers: {Authorization: `Bearer ${accessToken}`}} };

export const signInRequest = async (requestBody : SignInRequestDto) => {
    const result = await axios.post(SIGN_IN_URL(), requestBody)
        .then(response => {
            const responseBody: SignUpResponseDto = response.data;
            return responseBody;
        }).catch(error => {
            if (!error.response.data) return null;
           const responseBody: ResponseDto = error.response.data;
           return responseBody;
        });
    return result;
}

export const signUpRequest = async (requestBody: SignUpRequestDto) => {
    const result = await axios.post(SIGN_UP_URL(), requestBody)
        .then(response => {
            const responseBody: SignUpResponseDto = response.data;
            return responseBody;
        }).catch(error => {
            if (!error.response.data) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const getSignInUserRequest = async (accessToken: string) => {
    const result = await axios.get(GET_SIGN_IN_URL(), authorization(accessToken))
        .then(response => {
            const responseBody:GetSignInUserResponseDto = response.data;
            return responseBody;
        }).catch(e => {
            if (!e.response.data) return null;
            const responesBody:ResponseDto = e.response.data;
            return responesBody;
        });
    return result;
}

export const fileUploadRequest = async (data: FormData) => {
    const result = await axios.post(FILE_UPLOAD_URL(), data, { headers: {'Content-Type': 'multipart/form-data'}})
        .then(response => {
            const responseBody: string = response.data;
            return responseBody;
        }).catch(e => {
            return null;
        })
    return result;
}

export const postBoardRequest = async (requestBody: PostBoardRequestDto, accessToken: string)=> {
    const result = await axios.post(POST_BOARD_URL(), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: PostBoardResponseDto = response.data;
            return responseBody;
        }).catch(e => {
            if(!e.response) return false;
            const responseBody:ResponseDto = e.response.data;
            return responseBody;
        })
    return result;
}

export const getBoardRequest = async (boardIdx: number | string) => {
    const result = await axios.get(GET_BOARD_URL(boardIdx))
        .then(response => {
            const requestBody: GetBoardResponseDto = response.data;
            return requestBody;
        }). catch(e => {
            if(!e.response) return null;
            const responseBody: ResponseDto = e.response.data;
            return responseBody;
        })
    return result;
}

export const increaseViewCountRequest = async (boardIdx: number | string) => {
    const result = await axios.get(INCREASE_VIEW_COUNT_URL(boardIdx))
        .then(response => {
            const responseBody: IncreaseBoardViewCountResponseDto = response.data;
            return responseBody;
        }).catch(e => {
            if(!e.response) return null;
            const responseBody: ResponseDto = e.response.data;
            return responseBody;
        })
    return result;
}

export const getFavoriteListRequest = async (boardIdx: number | string) => {
    const result = await axios.get(GET_FAVORITE_LIST_URL(boardIdx))
        .then(response => {
            const responseBody: GetBoardResponseDto = response.data;
            return responseBody;
        }).catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
}

export const getCommentListRequest = async (boardIdx: number | string) => {
    const result = await axios.get(GET_COMMENT_LIST_URL(boardIdx))
        .then(response => {
            const responseBody: GetCommentListResponseDto = response.data;
            return responseBody;
        }).catch(e => {
            const responseBody: ResponseDto = e.response.data;
            return responseBody;
        })
    return result;
}

export const putFavoriteRequest = async(boardIdx: number | string, accessToken: string) => {
    const result = await axios.put(PUT_FAVORITE_URL(boardIdx), {}, authorization(accessToken))
        .then(response => {
            const responseBody: PutFavoriteResponseDto = response.data;
            return responseBody;
        }).catch(e => {
            const responseBody: ResponseDto = e.response.data;
            return responseBody;
        })
    return result;
}

export const postCommentRequest = async(boardIdx: number | string, requestBody: PostCommentResponseDto, accessToken: string) => {
    const result = await axios.post(POST_COMMENT_URL(boardIdx), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: PostCommentResponseDto = response.data;
            return responseBody;
        }).catch(e => {
            const responseBody: ResponseDto = e.response.data;
            return responseBody;
        })
    return result;
}

export const deleteBoardRequest = async (boardIdx: number | string, accessToken: string) =>{
    const result = await axios.delete(DELETE_BOARD_URL(boardIdx), authorization(accessToken))
        .then(response => {
            const responseBody: DeleteBoardResponseDto = response.data;
            return responseBody;
        }).catch(e => {
            const responseBody: ResponseDto = e.response.data;
            return responseBody;
        })
    return result;
}
