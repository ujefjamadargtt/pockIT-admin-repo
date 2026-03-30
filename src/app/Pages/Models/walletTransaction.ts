export class WalletTransactionData {
    ID?: number;
    TERRITORY_ID?: number;
    WALLET_AMOUNT: number;
    REMARKS: string;
    CLIENT_ID: number = 1;
    TRANSACTION_TYPE: string;
    EXPIRY_DAYS?: number
    CUSTOMER_ID?: number
}