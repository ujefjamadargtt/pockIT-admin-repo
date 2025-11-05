export class Coupan {
    ID: number;
    CLIENT_ID: number;
    NAME: string = '';
    DESCRIPTION: string = '';
    START_DATE: any;
    EXPIRY_DATE: any;
    MAX_USES_COUNT: number;
    COUPON_CODE: string = '';
    COUPON_VALUE: any;
    PERUSER_MAX_COUNT: number;
    STATUS: boolean = true;
    IS_PUBLIC: boolean = true;
    COUPON_VALUE_TYPE: string = 'A';
    COUPON_MAX_VALUE: any;
    MIN_CART_AMOUNT: number = 0;
    MAX_CART_AMOUNT: number = 0;
    COUPON_TYPE_ID: number;
    COUNTRY_ID: any;
    COUPON_FOR: any = 'BO';
}