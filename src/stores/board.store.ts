import { create } from "zustand/react";

interface BoardStore {
    title: string;
    content: string;
    boardImageFileList: File[];
    setTitle: (title) => void;
    setContent: (content) => void;
    setboardImageFileList: (boardImageFileList) => void;
    resetBoard: () => void;
};

const useBoardStore = create<BoardStore>(set => ({
    title: '',
    content: '',
    boardImageFileList: [],
    setTitle: (title:string) => set(state => ({...state, title})),
    setContent: (content:string) => set(state => ({...state, content})),
    setboardImageFileList: (boardImageFileList) => set(state => ({...state, boardImageFileList})),
    resetBoard: () => set(state => ({...state, title:'', content:'', boardImageFileList:[]}))
}));

export default useBoardStore;