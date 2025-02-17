export default interface BoardListItem {
    board_int: number;
    title: string;
    content: string;
    boardTitleImage: string | null;
    favoriteCount: number;
    commentCount: number;
    viewCount: number;
    reg_date: string;
    writerNickname: string;
    writerProfileImage: String | null;
}