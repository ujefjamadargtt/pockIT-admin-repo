export class ServiceCatMasterData {
    NAME = ''
    DESCRIPTION: any
    CATEGORY_ID: number
    SUBCATEGORY_ID: number
    REGULAR_PRICE_B2B: number
    REGULAR_PRICE_B2C: number
    EXPRESS_PRICE_B2B: number
    EXPRESS_PRICE_B2C: number
    CURRENCY_ID: number
    DURATION: any;
    SERVICE_IMAGE_URL: any
    AVAILABILITY_STATUS: boolean = true
}


export class ServiceCatMasterDataNew {
    HSN_CODE_ID: number;
    HSN_CODE: any
    UNIT_NAME: any;
    TAX_NAME: any;
    NAME: any = ''
    DESCRIPTION: any;
    SUB_CATEGORY_ID: number;
    B2B_PRICE: number
    SUB_CATEGORY_NAME: any
    CATEGORY_NAME: any
    ORG_ID: any;
    B2C_PRICE: number
    SERVICE_SKILLS: any;
    TERRITORY_ID: number = 0;
    FILE_CONTENT: any;
    EXPRESS_COST: number;
    SERVICE_IMAGE: any;
    SERVICE_DETAILS_IMAGE: any
    SERVICE_TYPE: string = 'O';
    STATUS: boolean = true;
    IS_JOB_CREATED_DIRECTLY: boolean = false;
    UNIT_ID: number
    SHORT_CODE: any
    TECHNICIAN_COST: number
    VENDOR_COST: number
    MAX_QTY: number = 1;
    QTY: number = 1;
    TAX_ID: any
    IS_EXPRESS: boolean = false
    IS_NEW: boolean = true
    IS_PARENT: boolean = false;
    DURARTION_HOUR: any
    DURARTION_MIN: any
    PREPARATION_MINUTES: any;
    PREPARATION_HOURS: any;
    START_TIME: any
    END_TIME: any
    PARENT_ID: number = 0;
    IS_FOR_B2B: boolean = false;
    CUSTOMER_ID: number = 0;
    OLD_SERVICE_NAME: any;
    GUARANTEE_PERIOD: any;
    GUARANTEE_ALLOWED: boolean = true;
    WARRANTY_PERIOD: any;
    WARRANTY_ALLOWED: boolean = true;
}
export class ServiceCatMasterDataNewB2b {
    NAME: any = '';
    HSN_CODE_ID: number;
    HSN_CODE: any;
    UNIT_NAME: any;
    TAX_NAME: any;
    DESCRIPTION: any;
    SUB_CATEGORY_ID: number;
    B2B_PRICE: number
    ORG_ID: any;
    B2C_PRICE: number
    IS_JOB_CREATED_DIRECTLY: boolean = false;
    SUB_CATEGORY_NAME: any
    SERVICE_SKILLS: any;
    CATEGORY_NAME: any
    EXPRESS_COST: number;
    SERVICE_IMAGE: any;
    SERVICE_DETAILS_IMAGE: any;
    SERVICE_TYPE: string = 'B';
    STATUS: boolean = true
    UNIT_ID: number
    SHORT_CODE: any
    TECHNICIAN_COST: number
    VENDOR_COST: number
    MAX_QTY: number = 1;
    QTY: number = 1;
    TAX_ID: any
    IS_EXPRESS: boolean = false
    IS_NEW: boolean = true
    IS_PARENT: boolean = true;
    DURARTION_HOUR: any
    DURARTION_MIN: any
    PREPARATION_MINUTES: any;
    PREPARATION_HOURS: any;
    START_TIME: any
    END_TIME: any
    FILE_CONTENT: any;
    PARENT_ID: number = 0;
    IS_FOR_B2B: boolean = true;
    CUSTOMER_ID: number = 0;
    TERRITORY_ID: number = 0;
    OLD_SERVICE_NAME: any;
    IS_AVAILABLE: boolean = true;

}

export class ServiceCatMasterDataNewNon {
    NAME: any = ''
    DESCRIPTION: any;
    SUB_CATEGORY_ID: number;
    B2B_PRICE: number
    ORG_ID: any;
    B2C_PRICE: number
    // B2B_EXPRESS_COST: number
    // B2C_EXPRESS_COST: number
    EXPRESS_COST: number;
    SERVICE_IMAGE: any
    STATUS: boolean = true
    UNIT_ID: number
    SERVICE_TYPE: string = 'O';
    SHORT_CODE: any
    TECHNICIAN_COST: number
    VENDOR_COST: number
    MAX_QTY: number = 1;
    QTY: number = 1;
    TAX_ID: any
    IS_EXPRESS: boolean = false
    IS_NEW: boolean = true
    IS_PARENT: boolean = true;
    DURARTION_HOUR: any
    DURARTION_MIN: any
    START_TIME: any
    PREPARATION_MINUTES: any;
    PREPARATION_HOURS: any;
    END_TIME: any
    FILE_CONTENT: any;
    PARENT_ID: number = 0;
    SERVICE_ID: number;
    TERRITORY_ID: number;
    IS_AVAILABLE: boolean = true;
    OLD_SERVICE_NAME: any;

}

export class ServiceCatMasterDataNewNonB2b {
    NAME: any = ''
    DESCRIPTION: any;
    SUB_CATEGORY_ID: number;
    B2B_PRICE: number
    ORG_ID: any;
    B2C_PRICE: number
    EXPRESS_COST: number;
    SERVICE_IMAGE: any
    STATUS: boolean = true
    UNIT_ID: number
    SERVICE_TYPE: string = 'B';
    SHORT_CODE: any
    TECHNICIAN_COST: number
    VENDOR_COST: number
    MAX_QTY: number = 1;
    QTY: number = 1;
    TAX_ID: any
    IS_EXPRESS: boolean = false
    IS_NEW: boolean = true
    IS_PARENT: boolean = true;
    DURARTION_HOUR: any
    DURARTION_MIN: any
    START_TIME: any
    PREPARATION_MINUTES: any;
    PREPARATION_HOURS: any;
    END_TIME: any
    FILE_CONTENT: any;
    PARENT_ID: number = 0;
    SERVICE_ID: number;
    IS_AVAILABLE: boolean = true;
    IS_FOR_B2B: boolean = true;
    CUSTOMER_ID: number = 0;
    OLD_SERVICE_NAME: any;
    CATEGORY_NAME: any;
    SUB_CATEGORY_NAME: any;
    IS_JOB_CREATED_DIRECTLY: boolean = false;
}


