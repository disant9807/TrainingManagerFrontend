export type TrainingsFilter = {
    kwds: string | null,
    publishFrom: string | null,
    publishTo: string | null,
    categoryCodes: string[],
    applicant: string | null,
    name: string | null,
    sex: number | null,
    age: number | null,
    сomplexities: number | null,
    start: number | null,
    count: number | null,
    order: Order | null
}

export enum Order {
    Desc = 0,
    Asc
}
