import axios from "axios";
const ID_TOKEN_KEY = 'id_token' as string;

/**
 * @description get token form localStorage
 */
export const getToken = (): string | null => {
    return window.localStorage.getItem("id_token");
};
export const getUser = (): string | null => {
    const userString = window.localStorage.getItem('user');

    if (userString !== null) {
        return JSON.parse(userString);
    }

    return null;
};



/**
 * @description save token into localStorage
 * @param token: string
 */
export const saveToken = (token: string): void => {
    window.localStorage.setItem("id_token", token);
};
export const saveUser = (user: object): void => {
    window.localStorage.setItem('user', JSON.stringify(user));
};

/**
 * @description remove token form localStorage
 */
export const destroyToken = (): void => {
    window.localStorage.removeItem(ID_TOKEN_KEY);
};
/**
 * @description remove user form localStorage
 */
export const destroyUser = (): void => {
    window.localStorage.removeItem('user');
};

export default {
    getToken,
    saveToken,
    destroyToken,
    saveUser,
    getUser,
    destroyUser,
};
