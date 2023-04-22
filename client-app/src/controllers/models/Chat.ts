export type Chat = {
    id: string,
    createdDatetime: string,
    serviceId: string,
    coachId: string,
    wardId: string
}

export type Message = {
    id: string,
    chatId: string,
    createdDatetime: string,
    editedDatetime: string,
    text: string,
    replyMessageId: string
}
