export const MAIN_PATH = () => '/';
export const AUTH_PATH = () =>'/auth';
export const SEARCH_PATH = (searchWord) =>`/search/${searchWord}`;
export const USER_PATH = (userEmail) =>`/user/${userEmail}`;
export const BOARD_PATH = () => '/board';
export const BOARD_DEATIL_PATH = (boardNumber) =>`detail/${boardNumber}`;
export const BOARD_WRITE_PATH = () => 'write';
export const BOARD_UPDATE_PATH = (boardNumber) => `update/${boardNumber}`;
