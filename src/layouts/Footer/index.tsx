import React from 'react';
import './style.css';

export default function Footer() {

    const onInstaIconButtonClickHandler = () => {
        window.open("https://instagram.com");
    }

    const onNaverBlogIconButtonClickHandler = () => {
        window.open("https://blog.naver.com");
    }
    return (
        <div id="footer">
            <div className="footer-container">
                <div className="footer-top">
                    <div className="footer-logo-box">
                        <div className="icon-box">
                            <div className="icon logo-light-icon"></div>
                        </div>
                        <div className="footer-logo-text">Blog</div>
                    </div>
                    <div className="footer-link-box">
                        <div className="footer-email-link">123@email.com</div>
                        <div className="icon-button" onClick={onInstaIconButtonClickHandler}>
                            <div className="icon insta-icon"></div>
                        </div>
                        <div className="icon-button" onClick={onNaverBlogIconButtonClickHandler}>
                            <div className="icon naver-blog-icon"></div>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <div className="footer-copyright">Copyright AAAAAAAA</div>
                </div>
            </div>
        </div>
    )
}
