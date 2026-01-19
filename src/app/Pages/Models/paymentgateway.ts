export class paymentgateway {
    ID: number;
    GATEWAY_NAME: string = '';
    GATEWAY_TYPE: string = '';
    API_KEY: string = '';
    API_SECRET: string = '';
    MERCHANT_ID: string;
    ENDPOINT_URL: string = '';
    WEBHOOK_URL: string = '';
    SUPPORTED_CURRENCIES: string;
    IS_ACTIVE: boolean = true;
    MODE: string = 'Test';
    ENCRYPTION_KEY: string = '';
    SETTLEMENT_TIME: number;
    MIN_AMOUNT: number;
    MAX_AMOUNT: number;
}
