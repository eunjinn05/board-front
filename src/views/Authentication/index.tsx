import React, {useState, KeyboardEvent, useRef, ChangeEvent, useEffect} from 'react';
import './style.css';
import InputBox from "../../components/InputBox/index.tsx";
import {SignInRequestDto} from "../../apis/request/auth/index.ts";
import {signInRequest, signUpRequest} from "../../apis/index.ts";
import {ResponseDto} from "../../apis/response/index";
import {useCookies} from "react-cookie";
import {MAIN_PATH} from "../../constant/index.ts";
import {useNavigate} from "react-router-dom";
import { SignInResponseDto } from "../../apis/response/auth/index.ts"
import {Address, useDaumPostcodePopup} from "react-daum-postcode";
import {SignUpRequestDto} from "../../apis/request/auth";
import {SignUpResponseDto} from "../../apis/response/auth";

export default function Authentication() {

    const navigator = useNavigate();

    const [view, setView] = useState<'sign-in' | 'sign-up'>('sign-in');

    const [cookies, setCookie] = useCookies();

    const SignInCard = () => {

        const emailRef = useRef<HTMLInputElement | null>(null);
        const passwordRef = useRef<HTMLInputElement | null>(null);

        const [email, setEmail] = useState<string>('');
        const [password, setPassword] = useState<string>('');
        const [passwordType, setPasswordType] = useState<'text' | 'password'>('password');
        const [error, setError] = useState<boolean>(false);
        const [passwordButtonIcon, setPasswordButtonIcon] = useState<'eye-light-off-icon' | 'eye-light-on-icon'>('eye-light-off-icon');

        const signInResponse = (responseBody: SignInRequestDto | ResponseDto | null) => {
            if(!responseBody) {
                alert('네트워크 이상입니다.');
                return false;
            }
            const { code } = responseBody;
            if (code === 'DBE') alert('데이터베이스 오류입니다.')
            if (code === 'SF' || code === 'VF') setError(true);
            if (code !== 'SU') return false;

            const { token, expirationTime } = responseBody as SignInResponseDto;
            const now = new Date().getTime();
            const expires = new Date(now + expirationTime * 1000);
            setCookie('accessToken', token, {expires, path: MAIN_PATH()});
            navigator(MAIN_PATH());
        }

        const onEmailChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
            setError(false);
            const {value} = e.target;
            setEmail(value);
        }

        const onPasswordChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
            setError(false);
            const {value} = e.target;
            setPassword(value);
        }

        const onSignInButtonClickHandler = () => {
            const requestBody: SignInRequestDto = {email, password};
            signInRequest(requestBody).then(signInResponse);
        }

        const onSignUpLinkClickHandler = () => {
            setView('sign-up');
        }

        const onPasswordButtonClickHandler = () => {
            if (passwordType === 'text') {
                setPasswordType('password');
                setPasswordButtonIcon('eye-light-off-icon');
            } else {
                setPasswordType('text');
                setPasswordButtonIcon('eye-light-on-icon');
            }
        }

        const onEmailKeyDownHandler = (e:KeyboardEvent<HTMLInputElement>) => {
            if (e.key !== 'Enter') return;
            if (!passwordRef.current) return;
            passwordRef.current.focus();
        }

        const onPasswordKeyDownHandler = (e:KeyboardEvent<HTMLInputElement>) => {
            if (e.key !== 'Enter') return;
            onSignInButtonClickHandler();
        }

        return (
            <div className="auth-card">
                <div className="auth-card-box">
                    <div className="auth-card-top">
                        <div className="auth-card-title-box">
                            <div className="auth-card-title">로그인</div>
                        </div>
                        <InputBox ref={emailRef} label='이메일 주소' type='text' placeholder='이메일 주소를 입력해주세요' error={error} value={email} onChange={onEmailChangeHandler} onKeyDown={onEmailKeyDownHandler} />
                        <InputBox ref={passwordRef} label='패스워드' type={passwordType} placeholder='비밀번호를 입력해주세요' error={error} value={password} onChange={onPasswordChangeHandler} icon={passwordButtonIcon} onButtonClick={onPasswordButtonClickHandler} />

                    </div>
                    <div className="auth-card-bottom">
                        {error && (
                            <div className="auth-sign-in-error-box">
                                <div className="auth-sign-in-error-message">{'이메일 주소 또는 비밀번호를 잘못 입력했습니다. \n 입력하신 내용을 다시 확인해주세요.'}</div>
                            </div>
                        )}

                        <div className="black-large-full-botton" onClick={onSignInButtonClickHandler}>로그인</div>
                        <div className="auth-descript-box">
                            <div className="auth-description">신규 사용자이신가요? <span className="auth-description-link" onClick={onSignUpLinkClickHandler}>회원가입</span></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const SignUpCard = () => {

        const [page, setPage] = useState<1 | 2>(1);
        const [email, setEmail] = useState<string>('');
        const [password, setPassword] = useState<string>('');
        const [passwordCheck, setPasswordCheck] = useState<string>('');
        const [passwordType, setPasswordType] = useState<'text' | 'password'>('password');
        const [passwordCheckType, setPasswordCheckType] = useState<'text' | 'password'>('password');
        const [isEmailError, setEmailError] = useState<boolean>(false);
        const [ispasswordError, setPasswordError] = useState<boolean>(false);
        const [ispasswordCheckError, setPasswordCheckError] = useState<boolean>(false);
        const [emailErrorMessage, setEmailErrorMessage] = useState<string>('');
        const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>('');
        const [passwordCheckErrorMessage, setPasswordCheckErrorMessage] = useState<string>('');
        const [passwordButtonIcon, setPasswordButtonIcon] = useState<'eye-light-off-icon' | 'eye-light-on-icon'>('eye-light-off-icon');
        const [passwordCheckButtonIcon, setPasswordCheckButtonIcon] = useState<'eye-light-off-icon' | 'eye-light-on-icon'>('eye-light-off-icon');

        const [nickname, setNickname] = useState<string>('');
        const [telNumber, setTelNumber] = useState<string>('');
        const [address, setAddress] = useState<string>('');
        const [addressDetail, setAddressDetail] = useState<string>('');
        const [nicknameError, setNicknameError] = useState<boolean>(false);
        const [telNumberError, setTelNumberError] = useState<boolean>(false);
        const [addressError, setAddressError] = useState<boolean>(false);
        const [addressDetailError, setAddressDetailError] = useState<boolean>(false);
        const [nicknameErrorMessage, setNicknameErrorMessage] = useState<string>('');
        const [telNumberErrorMessage, setTelNumberErrorMessage] = useState<string>('');
        const [addressErrorMessage, setAddressErrorMessage] = useState<string>('');
        const [addressDetailErrorMessage, setAddressDetailErrorMessage] = useState<string>('');
        const [agreedPersonal, setAgreedPersonal] = useState<boolean>(false);
        const [isAgreedPersonalError, setAgreedPersonalError] = useState<boolean>(false);

        const emailRef = useRef<HTMLInputElement | null>(null);
        const passwordRef = useRef<HTMLInputElement | null>(null);
        const passwordCheckRef = useRef<HTMLInputElement | null>(null);
        const nicknameRef = useRef<HTMLInputElement | null>(null);
        const telNumberRef = useRef<HTMLInputElement | null>(null);
        const addressRef = useRef<HTMLInputElement | null>(null);
        const addressDetailRef = useRef<HTMLInputElement | null>(null);

        const onEmailChangeHandler = (e:ChangeEvent<HTMLInputElement>) => {
            const {value} = e.target;
            setEmail(value);
            setEmailError(false);
            setEmailErrorMessage('');
        }
        const onPasswordChangeHandler= (e:ChangeEvent<HTMLInputElement>) => {
            const {value} = e.target;
            setPassword(value);
            setPasswordError(false);
            setPasswordErrorMessage('');
        }
        const onPasswordCheckChangeHandler= (e:ChangeEvent<HTMLInputElement>) => {
            const {value} = e.target;
            setPasswordCheck(value);
            setPasswordCheckError(false);
            setPasswordCheckErrorMessage('');
        }

        const onPasswordButtonClickHandler = () => {
            if (passwordButtonIcon === 'eye-light-off-icon') {
                setPasswordButtonIcon('eye-light-on-icon');
                setPasswordType('text');
            } else {
                setPasswordButtonIcon('eye-light-off-icon');
                setPasswordType('password');
            }
        }
        const onPasswordCheckButtonClickHandler = () => {
            if (passwordCheckButtonIcon === 'eye-light-off-icon') {
                setPasswordCheckButtonIcon('eye-light-on-icon');
                setPasswordCheckType('text');
            } else {
                setPasswordCheckButtonIcon('eye-light-off-icon');
                setPasswordCheckType('password');
            }
        }

        const onEmailKeyDownHandler = (e:KeyboardEvent<HTMLInputElement>) => {
            if(e.key !== 'Enter') return false;
            if(!passwordRef.current) return false;
            passwordRef.current.focus();
        }
        const onPasswordKeyDownHandler = (e:KeyboardEvent<HTMLInputElement>) => {
            if(e.key !== 'Enter') return false;
            if(!passwordCheckRef.current) return false;
            passwordCheckRef.current.focus();
        }
        const onPasswordCheckKeyDownHandler = (e:KeyboardEvent<HTMLInputElement>) => {
            if(e.key !== 'Enter') return false;
            onNextButtonClickHandler();
            if (!nicknameRef.current) return false;
            nicknameRef.current.focus();
        }
        const onNextButtonClickHandler = () => {
            const emailPattern = /^[a-zA-Z0-9]*@([-.]?[a-zA-Z0-9])*\.[a-zA-Z]{2,4}$/;
            const isEmailPattern = emailPattern.test(email);
            if(!isEmailPattern){
                setEmailError(true);
                setEmailErrorMessage('이메일 주소 포맷이 맞지 않습니다.');
            }

            const isCheckedPassword = password.trim().length >= 8;
            if(!isCheckedPassword) {
                setPasswordError(true);
                setPasswordErrorMessage('비밀번호는 8자 이상 입력해주세요.');
            }

            const isEqualPassword = password === passwordCheck;
            if(!isEqualPassword) {
                setPasswordCheckError(true);
                setPasswordCheckErrorMessage('비밀번호가 일치하지 않습니다.');
            }
            if(!isEmailPattern || !isCheckedPassword || !isEqualPassword) return false;
            setPage(2);
        }
        const onSignInLinkClickHandler = () => {
            setView('sign-in');
        }
        const onSignUpButtonClickHandler = () => {
            const emailPattern = /^[a-zA-Z0-9]*@([-.]?[a-zA-Z0-9])*\.[a-zA-Z]{2,4}$/;
            const isEmailPattern = emailPattern.test(email);
            if(!isEmailPattern){
                setEmailError(true);
                setEmailErrorMessage('이메일 주소 포맷이 맞지 않습니다.');
            }

            const isCheckedPassword = password.trim().length >= 8;
            if(!isCheckedPassword) {
                setPasswordError(true);
                setPasswordErrorMessage('비밀번호는 8자 이상 입력해주세요.');
            }

            const isEqualPassword = password === passwordCheck;
            if(!isEqualPassword) {
                setPasswordCheckError(true);
                setPasswordCheckErrorMessage('비밀번호가 일치하지 않습니다.');
            }
            if(!isEmailPattern || !isCheckedPassword || !isEqualPassword) {
                setPage(1);
                return false;
            }

            const hasNickname = nickname.trim().length !== 0;
            if (!hasNickname) {
                setNicknameError(true);
                setNicknameErrorMessage("닉네임을 입력해주세요");
            }

            const telNumberPattern = /^[0-9]{11,13}$/
            const isTelNumberPattern = telNumberPattern.test(telNumber);
            if (!isTelNumberPattern) {
                setTelNumberError(true);
                setTelNumberErrorMessage('숫자만 입력해주세요');
            }

            const hasAddress = address.trim().length !== 0;
            if (!hasAddress) {
                setAddressError(true);
                setAddressErrorMessage('주소를 입력해주세요');
            }

            if (!agreedPersonal) {
                setAgreedPersonalError(true);
            }

            if (!hasNickname || !isTelNumberPattern || !hasAddress) return false;

            const requestBody: SignUpRequestDto = {
                email, password, nickname, telNumber, address, addressDetail, agreedPersonal
            };
            signUpRequest(requestBody).then(signUpResponse);
        }
        const onNicknameChangeHandler = (e:ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;
            setNickname(value);
            setNicknameError(false);
            setNicknameErrorMessage('');
        }
        const onTelNumberChangeHandler = (e:ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;
            setTelNumber(value);
            setTelNumberError(false);
            setTelNumberErrorMessage('');
        }
        const onAddressChangeHandler = (e:ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;
            setAddress(value);
            setAddressError(false);
            setAddressErrorMessage('');
        }
        const onAddressDetailChangeHandler = (e:ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;
            setAddressDetail(value);
        }
        const onAddressButtonClickHandler = () => {
            open({onComplete});
        }
        const onNicknameKeyDownHandler = (e:KeyboardEvent<HTMLInputElement>) => {
            if(e.key !== 'Enter') return false;
            if (!telNumberRef.current) return false;
            telNumberRef.current.focus();
        }
        const onTelNumberKeyDownHandler = (e:KeyboardEvent<HTMLInputElement>) => {
            if(e.key !== 'Enter') return false;
            onAddressButtonClickHandler();
        }
        const onAddressKeyDownHandler = (e:KeyboardEvent<HTMLInputElement>) => {
            if(e.key !== 'Enter') return false;
            if (!addressDetailRef.current) return false;
            addressDetailRef.current.focus();
        }
        const onAddressDetailKeyDownHandler = (e:KeyboardEvent<HTMLInputElement>) => {
            if(e.key !== 'Enter') return false;
            onSignUpButtonClickHandler();
        }
        const onAgreedPersonalClickHandler = () => {
            setAgreedPersonal(!agreedPersonal);
            setAgreedPersonalError(false);
        }

        const open = useDaumPostcodePopup();

        const onComplete = (data:Address) => {
            const { address } = data;
            setAddress(address);
            if(!addressDetailRef.current) return false;
            addressDetailRef.current.focus();
        }

        const signUpResponse = (responseBody:SignUpResponseDto | ResponseDto | null) => {
            if (!responseBody) {
                alert('네트워크 이상입니다.');
                return false;
            }
            const {code} = responseBody;
            if (code === "DE") {
                setEmailError(true);
                setEmailErrorMessage('중복되는 이메일 주소입니다.');
                setPage(1);
            }
            if (code === 'DN') {
                setNicknameError(true);
                setNicknameErrorMessage('중복되는 닉네임입니다.');
                setPage(1);
            }
            if (code === 'DT') {
                setTelNumberError(true);
                setTelNumberErrorMessage('중복되는 휴대폰 번호입니다.');
                setPage(1);
            }
            if (code === 'VF') alert('모든 값을 입력하세요.');
            if (code === "DBE") alert('데이터베이스 오류입니다.');

            if (code !== 'SU') return false;
            setView('sign-in');
        }

        useEffect(() => {
            if(page === 2) {
                if(!nicknameRef.current) return;
                nicknameRef.current.focus();
            }
        }, [page]);

        return (
            <div className="auth-card">
                <div className="auth-card-box">
                    <div className="auth-card-top">
                        <div className="auth-card-title-box">
                            <div className="auth-card-title">회원가입</div>
                            <div className="auth-card-page">{page}/2</div>
                        </div>
                        {page === 1 && (
                            <>
                                <InputBox ref={emailRef} type='text' label="이메일 주소 *" placeholder="이메일 주소를 입력해주세요." value={email} onChange={onEmailChangeHandler} error={isEmailError} message={emailErrorMessage} onKeyDown={onEmailKeyDownHandler}/>
                                <InputBox ref={passwordRef} type={passwordType} label="비밀번호 *" placeholder="비밀번호를 입력해주세요." value={password} onChange={onPasswordChangeHandler} error={ispasswordError} message={passwordErrorMessage} icon={passwordButtonIcon} onButtonClick={onPasswordButtonClickHandler} onKeyDown={onPasswordKeyDownHandler}/>
                                <InputBox ref={passwordCheckRef} type={passwordCheckType} label="비밀번호 확인 *" placeholder="비밀번호를 다시 입력해주세요." value={passwordCheck} onChange={onPasswordCheckChangeHandler} error={ispasswordCheckError} message={passwordCheckErrorMessage} icon={passwordCheckButtonIcon} onButtonClick={onPasswordCheckButtonClickHandler} onKeyDown={onPasswordCheckKeyDownHandler}/>
                            </>
                        )}
                        {page === 2 && (
                            <>
                                <InputBox ref={nicknameRef} label="닉네임 *" type="text" error={nicknameError} message={nicknameErrorMessage} placeholder='닉네임을 입력해주세요' value={nickname} onChange={onNicknameChangeHandler} onKeyDown={onNicknameKeyDownHandler}/>
                                <InputBox ref={telNumberRef} label="휴대폰번호 *" type="text" error={telNumberError} message={telNumberErrorMessage} placeholder="휴대폰 번호를 입력해주세요" value={telNumber} onChange={onTelNumberChangeHandler} onKeyDown={onTelNumberKeyDownHandler}/>
                                <InputBox ref={addressRef} label="주소 *" type="text" error={addressError} message={addressErrorMessage} placeholder="우편번호 찾기" value={address} onChange={onAddressChangeHandler} icon='expand-right-light-icon' onButtonClick={onAddressButtonClickHandler} onKeyDown={onAddressKeyDownHandler}/>
                                <InputBox ref={addressDetailRef} label="상세 주소 *" type="text" error={false} message={addressDetailErrorMessage} placeholder="상세 주소를 입력해주세요" value={addressDetail} onChange={onAddressDetailChangeHandler} onKeyDown={onAddressDetailKeyDownHandler}/>
                            </>
                        )}
                        <div className="auth-card-bottom">
                            {page === 1 && (
                                <>
                                    <div className="black-large-full-botton" onClick={onNextButtonClickHandler}>다음 단계</div>
                                </>
                            )}
                            {page === 2 && (
                                <>
                                    <div className="auth-consent-box">
                                        <div className="auth-check-box" onClick={onAgreedPersonalClickHandler}>
                                           <div className={`icon ${agreedPersonal ? 'check-round-fill-icon' : 'check-ring-light-icon'}` } ></div>
                                            <div className="check-ring-light-icon"></div>
                                        </div>
                                        <div className={isAgreedPersonalError ? 'auth-consent-error' : 'auth-consent-title'}>개인정보동의</div>
                                        <div className="auth-consent-link">{'더보기 > '}</div>
                                    </div>
                                    <div className="black-large-full-botton" onClick={onSignUpButtonClickHandler}>회원가입</div>
                                </>
                            )}
                            <div className="auth-descript-box">
                                <div className="auth-description">이미 계정이 있으신가요? <span className="auth-description-link" onClick={onSignInLinkClickHandler}>로그인</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div id="auth-wrapper">
            <div className="auth-container">
                <div className="auth-jumbotron-box">
                    <div className="auth-jumbotron-contents">
                        <div className="auth-logo-icon"></div>
                        <div className="auth-jumbotron-text-box">
                            <div className="auth-jumbotron-text">환영합니다.</div>
                            <div className="auth-jumbotron-text">Blog입니다.</div>
                        </div>
                    </div>
                </div>
                {view === 'sign-in' && <SignInCard />}
                {view === 'sign-up' && <SignUpCard />}
            </div>
        </div>
    )
}