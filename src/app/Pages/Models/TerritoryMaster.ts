export class TerritoryMaster {
    NAME: string = '';
    STATUS: boolean;
    IS_ACTIVE: boolean = true;
    SEQ_NO: number;
    // BRANCH_ID: number;
    // CITY_ID: number;
    // STATE_ID: number;
    COUNTRY_ID: number;
    IS_EXPRESS_SERVICE_AVAILABLE: boolean = true;
    END_TIME: any;
    START_TIME: any;
    SUPPORT_COUNTRY_CODE: any = "+91";
    SUPPORT_CONTACT_NUMBER: any;
    WEEKLY_OFFS: any;
}


export class SlotsMappingToTerritory {
    ID: number;
    ORG_ID: number = 0;
    MAPPING_FOR: any = "T";
    MAPPING_ID: number = 0;
    SLOT1_START_TIME: any;
    SLOT1_END_TIME: any;
    SLOT2_START_TIME: any;
    SLOT2_END_TIME: any;
    SLOT3_START_TIME: any;
    SLOT3_END_TIME: any;
}

