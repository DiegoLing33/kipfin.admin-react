/**
 * Счетчик специальности
 */
export default class SpecializationCounter {

    public free: number = 0;
    public paid: number = 0;
    public notMind: number = 0;

    /**
     * The constructor
     */
    constructor() {
        this.free = 0;
        this.paid = 0;
        this.notMind = 0;
    }

    /**
     * Returns all values
     * @return {number}
     */
    getAll(): number {
        return this.free + this.paid + this.notMind;
    }

    /**
     * Clears the counter
     */
    refresh(): void {
        this.free = this.paid = this.notMind = 0;
    }

    /**
     * Adds counter by title
     * @param title
     */
    addCounterByTitle(title: string) {
        if (title === "Договор") this.paid++;
        else if (title === "Бюджет") this.free++;
        else this.notMind++;
    }
}