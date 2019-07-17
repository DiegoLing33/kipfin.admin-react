/**
 * Представление группы
 */
export interface IGroup{
    title: string;
    group_id: number|string;
    access: number|string;
}


/**
 * Группа пользователя
 */
export default class Group {
    /**
     * Название группы
     */
    public readonly title: string;

    /**
     * Идентификатор группы
     */
    public readonly groupId: number;

    /**
     * Уровень доступа
     */
    public readonly access: number;

    /**
     * Группа пользователя
     * @param group
     */
    public constructor(group: IGroup){
        group = group || {};
        this.title = group.title || "Гость";
        this.groupId = parseInt(String(group.group_id || 0));
        this.access = parseInt(String(group.access || 0));
    }

    /**
     * Проверяет доступ
     * @param access
     */
    public checkAccess(access: number): boolean{
        return (this.access & access) === access;
    }
}