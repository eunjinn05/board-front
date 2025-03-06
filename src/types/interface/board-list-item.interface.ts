export default interface BoardListItem {
    boardIdx: number;
    title: string;
    content: string;
    boardTitleImage: string | null;
    favoriteCount: number;
    commentCount: number;
    viewCount: number;
    regDateTime: string;
    writerNickname: string;
    writerProfileImage: String | null;
}