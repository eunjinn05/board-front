export default interface Board {
    boardIdx: number;
    title: string;
    content: string;
    boardImageList: string[];
    regDatetime: string;
    writerEmail: string;
    writerNickname: string;
    writerProfileImage: string | null;
}