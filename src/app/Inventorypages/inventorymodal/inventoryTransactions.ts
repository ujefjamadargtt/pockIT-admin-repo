export class InventoryTransaction {
  ID: number;
  DATE: any = new Date();
  TRANSACTION_DATE: any;
  TRANSACTION_TYPE: any = '';
  ITEM_ID: any;
  QUANTITY: any;
  UNIT_ID: any;
  UNIT_COST: any;
  TOTAL_COST: any;
  WAREHOUSE_ID: any;
  REMARKS: any;
  STATUS: string;
  TYPE: any
}

// export class InventoryTransaction {
//   ID;
//   DATE:any=new Date();
//   TYPE;
//   ITEM_ID;
//   QUANTITY;
//   UNIT_ID;
//   UNIT_COST;
//   TOTAL_COST;
//   WAREHOUSE_ID;
//   REMARKS;
//   STATUS:boolean=true
// }
