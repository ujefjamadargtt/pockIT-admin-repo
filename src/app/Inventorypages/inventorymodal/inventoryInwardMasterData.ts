export class InventoryInwardMasterData {
    ID: any;
    PO_NUMBER: any;
    INWARD_ITEM_ID: any;
    INWARD_NO: any;
    INWARD_DATE: any = new Date();
    WAREHOUSE_ID: any;
    WAREHOUSE_NAME: any;
    IS_VARIANT: boolean = false;

    INWARD_ITEM_NAME: any;
    INVENTORY_CATEGORY_ID: any;
    INVENTRY_SUB_CATEGORY_ID: any;
    INVENTORY_CATEGORY_NAME: any;
    INVENTRY_SUB_CATEGORY_NAME: any;
    QUANTITY: any = 1;
    QUANTITY_PER_UNIT: any;
    UNIT_ID: any;
    UNIT_NAME: any;
    INVENTORY_TRACKING_TYPE: any;
    REMARK: any
    SKU_CODE: any;
    INWARD_VARIANT_ID: any;
    INWARD_VARIANT_NAME: any
    // // Details
    // INWARD_MASTER_ID
    // UNIQUE_NO
    // GUARANTTEE_IN_DAYS
    // WARANTEE_IN_DAYS
    // EXPIRY_DATE
}