export type TService = {
    id: string,
    categoryServiceId: string,
    shortTitle: string,
    title: string,
    miniPhoto: string,
    Photo: string,
    description: string,
    createdDatetime: string,
    lastUpdateDatetime: string
}

export type TCategoryService = {
    id: string,
    createdDatetime: string,
    lastUpdateDatetime: string,
    title: string,
    icon: string,
    sortedLvl: string
}
