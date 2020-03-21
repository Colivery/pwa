import { injectable, inject } from "springtype/core/di";
import { CryptoService } from "./crypto";
import { StorageService } from "./storage";

/**
 * Cryptographically secure sessionStorage and localStorage 
 * for arbitrary client-side data.
 */
@injectable
export class CryptoStorageService {

    @inject(StorageService)
    storageService: StorageService;

    @inject(CryptoService)
    cryptoService: CryptoService;

    has(ident: string): boolean {
        return this.storageService.has(ident);
    }

    set(ident: string, value: any, hexKey: string): CryptoStorageService {
        this.storageService.set(ident, this.cryptoService.encrypt(value, hexKey));
        return this;
    }

    get(ident: string, hexKey: string): any {
        return this.cryptoService.decrypt(this.storageService.get(ident), hexKey);
    }

    clear(): CryptoStorageService {
        this.storageService.clear();
        return this;
    }

    forSession(): CryptoStorageService {
        const cryptoSessionStorageService = new CryptoStorageService();
        cryptoSessionStorageService.storageService = new StorageService().forSession();
        return cryptoSessionStorageService;
    }
}