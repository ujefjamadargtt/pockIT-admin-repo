export class Ticketdetails {
    ID: number;
    TICKET_MASTER_ID: number;
    CLIENT_ID: number;
    SENDER: any;
    SENDER_ID: number;
    DESCRIPTION: any;
    URL: any;
}

export class Ticket {
    ID: number;
    CLIENT_ID: number;
    TICKET_GROUP_ID: number;
    TICKET_NO: any;
    ACTION: any;
    USER_ID: number;
    MOBILE_NO: any;
    EMAIL_ID: any;
    CLOUD_ID: any;
    QUESTION: any;
    STATUS: any;
    PRIORITY: any;
    IS_TAKEN: any = 0;
    TAKEN_BY_USER_ID: number;
    LAST_RESPONDED: any;
    DATE: any = null;
    SUBJECT = '';
    TRANSFER_USER_ID: any;
    TICKET_TAKEN_DEPARTMENT_ID: any;
    USER_TYPE: any;
    TICKET_MASTER_ID: any
    DEPARTMENT_ID: any
}

export class Ticketgroup {
    ID: any;
    CLIENT_ID: number;
    PARENT_ID: number;
    TYPE: any;
    VALUE: any;
    URL: any;
    SEQ_NO: number = 0;
    IS_LAST: any = false;
    ALERT_MSG: any;
    STATUS: boolean;
    PRIORITY: any = 'M';
    DEPARTMENT_ID: any;
    TICKET_TYPE: any = 'C'
}

// export class Faq {
//     ID: number;
//     CLIENT_ID: number;
//     FAQ_HEAD_ID: any;
//     QUESTION: any;
//     ANSWER: any;
//     SEQ_NO: number;
//     POSITIVE_HELPFUL_COUNT: number;
//     NEGATIVE_HELPFUL_COUNT: number;
//     URL: any;
//     TAGS: any;
//     IS_STATUS: boolean;
//     STATUS: boolean = true;
//     NIGATIVE_FLAG: boolean
//     TAGS_STRING: any = [];

// }

export class Department {
    ID: number;
    ORG_ID: number;
    CLIENT_ID: number;
    NAME: any = '';
    SHORT_CODE: any = '';
    STATUS: boolean = true;
    SEQUENCE_NO: any;
    TICKET_TIME_PERIOD: number;
}

export class Faqhead {
    ID: number;
    CLIENT_ID: number;
    NAME: any;
    STATUS: any = true;
    FAQ_HEAD_TYPE: any = 'C'
    PARENT_ID: any = 0;
    IS_PARENT: any = true;
    PARENT_NAME: any = '';
    ORG_ID: any = 0;
    SEQUENCE_NO: any = 0;
    DESCRIPTION: any = '';
}

export class DepartmentworkingDetails {
    ID: number;
    DAY: number;
    CLIENT_ID: number;
    DEPARTMENT_ID: number;
    DATE: any;
    OPEN_TIME: any;
    CLOSE_TIME: any;
    IS_HOLIDAY: boolean;
}

export class Ticketfaqmapping {
    ID: number;
    CLIENT_ID: number;
    TICKET_GROUP_ID: number;
    FAQ_MASTER_ID: number;
    STATUS: boolean;
    SEQ_NO: number;
}

// export class Faqresponse {
//     ID: number;
//     CLIENT_ID: number;
//     FAQ_MASTER_ID: number;
//     USER_MOBILE: any;
//     USER_EMAIL_ID: any;
//     SUGGESTION: any;
//     STATUS: any;
// }

export class Faqresponse {
    ID: number;
    CLIENT_ID: number;
    FAQ_MASTER_ID: number;
    USER_MOBILE: any;
    USER_EMAIL_ID: any;
    SUGGESTION: any;
    STATUS: any;
    USER_TYPE: any;
}

export class Faq {
    ID: number;
    CLIENT_ID: number;
    FAQ_HEAD_ID: any;
    QUESTION: any;
    ANSWER: any;
    SEQ_NO: number = 0;
    POSITIVE_HELPFUL_COUNT: number;
    NEGATIVE_HELPFUL_COUNT: number;
    URL: any;
    TAGS: any;
    IS_STATUS: boolean;
    STATUS: boolean = true;
    NIGATIVE_FLAG: boolean;
    TAGS_STRING: any = [];
    POSITIVE_COUNT: number;
    NEGATIVE_COUNT: number;
    USER_TYPE: any;
    FAQ_TYPE: any = 'C';
}