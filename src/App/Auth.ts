import Cookies from "universal-cookie";

const cookies = new Cookies();

export default class Auth {

    /**
     * Сохраняет хэш
     * @param login
     * @param hash
     * @constructor
     */
    static SaveHash(login: string, hash: string): void {
        let d = new Date();
        d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
        cookies.set("hash", hash, {path: "/", expires: d});
        cookies.set("login", login, {path: "/", expires: d});
    }

    /**
     * Сохраняет удовень доступа
     * @param access
     * @constructor
     */
    static SaveAccess(access: string): void {
        let d = new Date();
        d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
        cookies.set("access", access, {path: "/", expires: d});
    }

    /**
     * Возвращает хэш
     */
    static GetHash(): string | null | any {
        return cookies.get("hash");
    }


    /**
     * Возвращает уровень доступа
     */
    static GetAccess(): number | null | any {
        try {
            return parseInt(cookies.get("access"));
        }catch (e) {
            return 0;
        }
    }

    /**
     * Возвращает хэш
     */
    static GetLogin(): string | null | any {
        return cookies.get("login");
    }

}