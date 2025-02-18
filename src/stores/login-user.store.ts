import {User} from "../types/interface";
import {create} from "zustand/react";

interface LoginUserStore {
    loginUser: User | null,
    setLoginUser: (loginuser: User) => void;
    resetLoginUser: () => void;
}

const useLoginUserStore = create<LoginUserStore>(set => ({
    loginUser: null,
    setLoginUser: (loginuser) => set(state => ({...state, loginuser})),
    resetLoginUser: () => set(state => ({...state, loginUser: null}))
}));

export default useLoginUserStore;