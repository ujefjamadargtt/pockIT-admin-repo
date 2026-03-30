export class StaticInventoryData {
    ID: number = 0;
    ITEM_NAME: string = '';
    DESCRIPTION: string = '';
    QUANTITY: number = 0;
    UNIT: string = '';
    IS_ACTIVE: boolean = true;
    isNew?: boolean = false;
    isEditing?: boolean = false;
    WARRANTY_ALLOWED: boolean = false;
    HSN_NAME: any = '';
    HSN_ID: any = 0;
    SELLING_PRICE: string = '';
    CREATED_MODIFIED_DATE: string = '';
    READ_ONLY: string = 'N';
    ARCHIVE_FLAG: string = 'F';
    CLIENT_ID: number = 0;
    INVENTORY_CATEGORY_NAME: any = '';
    SHORT_CODE: string = '';
    TAX_PREFERENCE: string = '';
    TAX_ID: any = 0;
    TAX_NAME: any = '';
    SKU_CODE: string | null = null;
    GUARANTEE_ALLOWED: boolean = false;
    BRAND_NAME: any = '';
    WARRANTY_PERIOD: number = 0;
    GUARANTEE_PERIOD: number = 0;
    INVENTORY_DETAILS_IMAGE: string | null = null;
    BASE_PRICE: any = 0;
    MARGIN: any = 0;
    COST_PRICE: any = 0;
    BRAND_ID: any = 0;
    INVENTORY_CATEGORY_ID: any = 0;
   
    
}