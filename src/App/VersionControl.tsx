import React, {CSSProperties} from "react";

/**
 * Информация о версии
 */
export interface IVersionInfo {
    version: string;
    updates: string[];
    fixes: string[];
    bugs: string[];
}

const instyles: { [name: string]: CSSProperties } = {
    updateTitle: {
        fontSize: 22,
        display: "block",
        marginBottom: 20
    },
    updateText: {
        display: "block"
    }
};

/**
 * Компонент контроля версии
 * @param props
 * @constructor
 */
export function VersionControlComponent(props: IVersionInfo) {
    const __section = (name: string, data: string[]) => (
        <div>
            <i>{name}:</i>
            <ul>
                {data.map(value => {
                    value = value.replace(/\*([^*]+)\*/g, "<b>$1</b>");
                    return <li><span dangerouslySetInnerHTML={{__html: value}}/></li>;
                })}
            </ul>
        </div>
    );
    return <div>
        <div style={instyles.updateTitle}>Версия: {props.version}</div>
        <div style={instyles.updateText}>
            {props.updates.length > 0 ? __section("Нововведения", props.updates) : null}
            {props.fixes.length > 0 ? __section("Исправления", props.fixes) : null}
            {props.bugs.length > 0 ? __section("Ошибки", props.bugs) : null}
        </div>
    </div>;
}

/**
 * Контроль версий
 */
export default class VersionControl {

    public static default: VersionControl = new VersionControl();

    /**
     * История версий
     */
    protected __versions: IVersionInfo[];

    /**
     * Конструктор
     */
    public constructor() {
        this.__versions = [];
    }

    /**
     * Добавляет новую версию
     * @param version
     * @param updates
     * @param fixes
     * @param bugs
     */
    public add(version: string, updates?: string[], fixes?: string[], bugs?: string[]) {
        this.__versions.push({
            version,
            updates: updates || [],
            fixes: fixes || [],
            bugs: bugs || []
        })
    }

    /**
     * Список обновлений
     */
    public log(): IVersionInfo[] {
        return this.__versions;
    }
}