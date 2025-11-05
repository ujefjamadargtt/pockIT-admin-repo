export class TechnicianRequestMovement {
  ID: number = 0;
  DATE: any = new Date();
  MOVEMENT_NUMBER: string = '';
  USER_ID: number = 0;
  USER_NAME: any;
  STATUS: string = '';
  // DESTINATION_WAREHOUSE_ID: number = 0;
  // SOURCE_WAREHOUSE_ID: number = 0;
  // deletedItemData: any[] = [];
  REASON: any;
  MOVEMENT_TYPE: any;
  TECHNICIAN_ID: any;
  WAREHOUSE_ID;
  WAREHOUSE_NAME;
  TECHNICIAN_NAME;
  TRANSFER_MODE = 'W';
  // SOURCE_WAREHOUSE_NAME: any;
  // DESTINATION_WAREHOUSE_NAME: any;
  INVENTORY_DETAILS: any[] = [];
}

export class InnerTable {
  MOVEMENT_ID: number = 0;
  VARIANT_ID: any = 0;
  INVENTORY_ID: any = 0;
  QUANTITY: number = 1;
  UNIT_ID: any = 0;
  UNIT_NAME: any;
  VARIANT_NAME: any;
  INVENTORY_NAME: any;
  INVENTROY_SUB_CAT_ID: any = 0;
  INVENTORY_CAT_NAME: any;
  INVENTROY_SUB_CAT_NAME: any;
  INVENTORY_CAT_ID: any = 0;
  IS_VARIANT: boolean = false;
  SERIAL_NO;
  BATCH_NO;
  STOCK;
  STOCK_UNIT_ID;
}

export class InnerTableCust {
  MOVEMENT_ID: number = 0;
  INVENTORY_ID: any = 0;
  ID: any;
  QUANTITY: any;
  UNIT_ID: any = 0;
  UNIT_NAME: any;
  INVENTORY_NAME: any;
  SERIAL_NO: any;
  BATCH_NO: any;
  JOB_CARD_ID: any;
  IS_VARIANT: any;
  INVENTORY_TRACKING_TYPE: any;
  RATE: any;
  IS_VERIENT: any = 0;
  PARENT_ID: null;
  VARIANT_NAME: any;
  QUANTITY_PER_UNIT: any;
  INVENTORY_CAT_ID: any;
  INVENTORY_CAT_NAME: any;
  INVENTROY_SUB_CAT_ID: any;
  INVENTROY_SUB_CAT_NAME: any;
  VARIANT_ID: null;
  INVENTORY_DETAILS_ID: any;
}

export class TechnicianRequestMovementCust {
  ID: number = 0;
  DATE: any = new Date();
  MOVEMENT_NUMBER: string = '';
  USER_ID: number = 0;
  USER_NAME: any;
  STATUS: string = '';
  REASON: any;
  MOVEMENT_TYPE: any;
  TECHNICIAN_ID: any;
  TECHNICIAN_NAME: any;
  CUSTOMER_NAME: any;
  TRANSFER_MODE = 'W';
  INVENTORY_DETAILS: any[] = [];
  INVENTORY_DETAILS_ID: any
  ITEM_IDS: any;
}
