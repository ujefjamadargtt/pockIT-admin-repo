export class StockMovementRequest {
  ID: number = 0;
  DATE: any = new Date();
  MOVEMENT_NUMBER: string = '';
  USER_ID: number = 0;
  USER_NAME: any;
  STATUS: string = '';
  DESTINATION_WAREHOUSE_ID: number = 0;
  WAREHOUSE_MANAGER_USER_ID: any;
  SOURCE_WAREHOUSE_ID: number = 0;
  deletedItemData: any[] = [];
  REASON: any;
  MOVEMENT_TYPE: any;

  SOURCE_WAREHOUSE_NAME: any;
  DESTINATION_WAREHOUSE_NAME: any;
  INVENTORY_DETAILS: any[] = [];
}

export class InnerStockMovementRequest {
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

