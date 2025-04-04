export interface EventEntity {
    eventType: string,
    channel: string | null,
    callerIdNum: string | null,
    connectedLineNum: string | null,
    callerId: string | null,
    recipientId: string | null,
    uniqueId: string | null,
    linkedId: string | null,
    cause: string | null,
    causeTxt: string | null,
    context: string | null,
    exten: string | null,
    channelState: string | null,
    channelStateDesc: string | null,
    timestamp: string | null,
    rawData: object | null
}