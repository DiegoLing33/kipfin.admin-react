export default class StringNumberUtils {
    static stringByNumber(src: number, sOne: string, sTwo: string, sFive: string, preffix: boolean = false) {
        let s = String(src);
        s = s[s.length - 1];
        switch (s) {
            default:
            case "0":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                return (preffix ? `${src} ` : "") + sFive;
            case "1":
                return (preffix ? `${src} ` : "") + sOne;
            case "2":
            case "3":
            case "4":
                return (preffix ? `${src} ` : "") + sTwo;
        }
    }
}

/*

stringByNumber(0, оригинал, оригинала, оригиналов)

 */