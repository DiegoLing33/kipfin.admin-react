import Cookies from "universal-cookie";

/**
 * Представление пользователя
 */
import Group, {IGroup} from "./Group";
import KFApi from "../API/KFApi";
import {IKFApiResponse} from "../API/KFWebApi";

const cookies = new Cookies();

/**
 * Интерфейс пользователя
 */
export interface IUser {
    user_id: number | string;
    login: string;
    name: string;
    group: IGroup;
}

/**
 * Пользователь
 */
export default class User {

    /**
     * Возвращает true, если пользователь локально авторизирован
     */
    public static isLocalAuthorized() {
        return User.getToken() !== false;
    }

    /**
     * Возвращает локальный токен или false
     */
    public static getToken(): string | boolean {
        return cookies.get("token") || false;
    }

    /**
     * Текущий пользователь
     */
    public static me?: User;

    /**
     * Обновляет состояние me пользователя
     */
    public static updateMe(callback?: ()=>void): void {
        KFApi.request("users.me")
            .argsGet({token: User.getToken()})
            .send()
            .then(response => {
                User.me = new User(response as any);
                if(callback) callback();
            });
    }

    /**
     * Сохраняет токен
     */
    public static setToken(token: string): void {
        let d = new Date();
        d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
        cookies.set("token", token, {path: "/", expires: d});
    }

    public static login(login: string, password: string): Promise<IKFApiResponse>{
        return new Promise<IKFApiResponse>((resolve, reject) => {
            KFApi.request("users.login")
                .argsGet({login, password})
                .send()
                .then(resp => {
                    if (resp.ok) {
                        User.setToken(resp.token);
                        resolve(resp);
                    }else{
                        reject("Пользователь не найден!");
                    }
                });
        });
    }

    /**
     * Идентификатор пользователя
     */
    public readonly userId: number;

    /**
     * Логин
     */
    public readonly login: string;

    /**
     * Имя
     */
    public readonly name: string;

    /**
     * Группа
     */
    public readonly group: Group;

    /**
     * Конструктор
     * @param user
     */
    constructor(user: IUser) {
        this.userId = parseInt(String(user.user_id));
        this.login = user.login;
        this.name = user.name;
        this.group = new Group(user.group);
    }

    /**
     * Возвращает имя пользователя
     */
    public getName(): string {
        const parts = this.name.split(" ");
        return parts.length > 1 ? parts[1] : parts[0];
    }
}