import {SignInRequestDto, SignUpRequestDto} from "./request/auth";
import axios from "axios";
import {SignUpResponseDto} from "./response/auth";
import {ResponseDto} from "./response";
import {GetSignInUserResponseDto, GetUserResponseDto} from "./response/user";
import {PatchBoardRequestDto, PostBoardRequestDto} from "./request/board";
import {
    PostBoardResponseDto,
    GetBoardResponseDto,
    IncreaseBoardViewCountResponseDto,
    GetCommentListResponseDto,
    PutFavoriteResponseDto,
    PostCommentResponseDto,
    DeleteBoardResponseDto,
    PatchBoardResponseDto,
    GetLatestBoardListResponseDto,
    GetTop3BoardListResponseDto,
    GetSearchBoardListResponseDto,
    GetUserBoardListResponseDto
} from "./response/board";

import {GetPopularListResponseDto, GetRelationListResponseDto} from "./response/search";
import {PatchNicknameRequestDto, PatchProfileImageRequestDto} from "./request/user";

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
const DELETE_BOARD_URL = (boardIdx: number | string) => `${API_DOMAIN}/board/${boardIdx}`;
const PATCH_BOARD_URL = (boardIdx: number | string) => `${API_DOMAIN}/board/${boardIdx}`;
const GET_LATEST_BOARD_LIST_URL = () => `${API_DOMAIN}/board/latest-list`;
const GET_TOP_3_BOARD_LIST_URL = () => `${API_DOMAIN}/board/top-3`;
const GET_POPULAR_BOARD_LIST_URL = () => `${API_DOMAIN}/search/popular-list`;
const GET_SEARCH_BOARD_LIST_URL = (searchWord: string, preSearchWord: string | null) => `${API_DOMAIN}/board/search-list/${searchWord}${preSearchWord ? '/' + preSearchWord : ''}`
const GET_RELATION_LIST_URL = (searchWord: string) => `${API_DOMAIN}/search/${searchWord}/relation-list`
const GET_USER_BOARD_LIST_URL = (email: string) => `${API_DOMAIN}/board/user-board-list/${email}`;
const GET_USER_URL = (email: string) => `${API_DOMAIN}/user/${email}`;
const PATCH_NICKNAME_URL = () => `${API_DOMAIN}/user/nickname`;
const PATCH_PROFILE_IMAGE_URL = () => `${API_DOMAIN}/user/profile-image`;

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

export const patchBoardRequest = async (boardIdx: number | string, requestBody: PatchBoardRequestDto, accessToken: string)=> {
    const result = await axios.patch(PATCH_BOARD_URL(boardIdx), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: PatchBoardResponseDto = response.data;
            return responseBody;
        }).catch(e => {
            if(!e.response) return null;
            const responseBody: ResponseDto = e.response.data;
            return responseBody;
        });
    return result;
}

export const getLatestBoardListRequest = async () => {
    const result = await axios.get(GET_LATEST_BOARD_LIST_URL())
        .then(response => {
            const responseBody: GetLatestBoardListResponseDto = response.data;
            return responseBody
        }).catch(e => {
            if(!e.response) return null;
            const responseBody: ResponseDto = e.response.data;
            return responseBody;
        });
    return result;
}

export const getTop3BoardListRequest = async () => {
    const result = await axios(GET_TOP_3_BOARD_LIST_URL())
        .then(response => {
            const responseBody: GetTop3BoardListResponseDto = response.data;
            return responseBody;
        }).catch(e => {
            const responseBody: ResponseDto = e.response.data;
            return responseBody;
        });
    return result;
}

export const getPopularListRequest = async () => {
    const result = await axios(GET_POPULAR_BOARD_LIST_URL())
        .then(response => {
            const responseBody: GetPopularListResponseDto = response.data;
            return responseBody;
        }).catch(e => {
            const responseBody: ResponseDto = e.response.data;
            return responseBody;
        });
    return result;
}

export const getSearchBoardListRequest = async (searchWord: string, preSearchWord: string | null) => {
    const result = await axios.get(GET_SEARCH_BOARD_LIST_URL(searchWord, preSearchWord))
        .then(response => {
            const responseBody: GetSearchBoardListResponseDto =  response.data;
            return responseBody;
        }).catch(e => {
            const responseBody: ResponseDto | null = e.response.data;
            return responseBody;
        });
    return result;
}

export const getRelationListRequest = async (searchWord) => {
    const result = axios.get(GET_RELATION_LIST_URL(searchWord))
        .then(response => {
            const responseBody: GetRelationListResponseDto = response.data;
            return responseBody;
        }).catch(e => {
            const responseBody: ResponseDto | null = e.response.data;
            return responseBody;
        });
    return result;
}

export const getUserBoardListRequest = async (email: string) => {
    const result = await axios.get(GET_USER_BOARD_LIST_URL(email))
        .then(response => {
            const responseBody: GetUserBoardListResponseDto = response.data;
            return responseBody;
        }).catch(e => {
            const responseBody: ResponseDto | null = e.response.data;
            return responseBody;
        })
    return result;
}

export const getUserRequest = async (email: string) => {
    const result = await axios.get(GET_USER_URL(email))
        .then(response => {
            const responseBody: GetUserResponseDto = response.data;
            return responseBody
        }).catch(e => {
            const responseBody: ResponseDto | null = e.response.data;
            return responseBody;
        });
    return result;
}

export const patchNicknameRequest = async (requestBody: PatchNicknameRequestDto, accessToken:string) => {
    const result = await axios.patch(PATCH_NICKNAME_URL(), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: PatchNicknameRequestDto = response.data;
            return responseBody;
        }).catch(e => {
            const responseBody: ResponseDto | null = e.response.data;
            return responseBody;
        });
    return result;
}

export const patchProfileImageRequest = async (requestBody: PatchProfileImageRequestDto, accessToken: string) => {
    const result = await axios.patch(PATCH_PROFILE_IMAGE_URL(), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: PatchProfileImageRequestDto = response.data;
            return responseBody;
        }).catch(e => {
            const responseBody: ResponseDto | null = e.response.data;
            return responseBody;
        })
    return result;
}

