import "./ling/Extenssions";

describe("Core testing", () => {
    it("LingFilter working", () => {
        const obs = [
            {name: "Oleg", original: "Yes", spec: "PKS", rate: 4.2},
            {name: "Kri", original: true, spec: "PKS", rate: "3,4"},
            {name: "Vano", original: true, spec: "IBAS", rate: 5.0},
        ];


      console.log(obs.lingFilter({name: ["Oleg", "Kri"]}))
    });
});

