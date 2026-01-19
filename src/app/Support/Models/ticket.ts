export class Ticket {
    ID: number
    CLIENT_ID: number
    TICKET_GROUP_ID: number
    TICKET_NO: string
    USER_ID: number
    MOBILE_NO: string
    EMAIL_ID: string
    CLOUD_ID: string
    QUESTION: string
    STATUS: string
    PRIORITY: string
    IS_TAKEN: any = 0
    TAKEN_BY_USER_ID: number
    LAST_RESPONDED: string
    DATE: any = null
    SUBJECT = ''
    TRANSFER_USER_ID:any
}
