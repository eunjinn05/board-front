import {SignInRequestDto, SignUpRequestDto} from "./request/auth";
import axios from "axios";
import {SignUpResponseDto} from "./response/auth";
import {ResponseDto} from "./response";
import {GetSignInUserResponseDto} from "./response/user";
import {PostBoardRequestDto} from "./request/board";
import {PostBoardResponseDto} from "./response/board";

const DOMAIN = 'http://localhost:4000';
const API_DOMAIN = `${DOMAIN}/api/v1`;
const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in`;
const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`;
const GET_SIGN_IN_URL = () => `${API_DOMAIN}/user`;
const FILE_DOMAIN = () => `${DOMAIN}/file`;
const FILE_UPLOAD_URL = () => `${FILE_DOMAIN()}/upload`;
const POST_BOARD_URL = () => `${API_DOMAIN}/board`;

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


