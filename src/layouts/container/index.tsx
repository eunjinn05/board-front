import React from 'react';
import {Outlet, useLocation} from "react-router-dom";
import Header from "../Header/index.tsx";
import Footer from "../Footer/index.tsx";
import {AUTH_PATH} from "../../constant/index.ts";

export default function Container() {
    const { pathname } = useLocation(); // 현재 url 표기

    return (
        <>
            <Header />
            <Outlet />
            {pathname !== AUTH_PATH() && <Footer /> }
        </>
    )
}