import { injectable } from "springtype/core/di";

type StorageType = 'session' | 'forever';

/**
 * Service for storage of arbitrary client-side data.
 * Supports both session storage and forever (local) storage.
 */
@injectable
export class StorageService {

    storageType: StorageType = 'forever';

    has(ident: string): boolean {
        return typeof this.get(ident) != 'undefined';
    }

    set(ident: string, value: any): StorageService {
        if (this.storageType === 'session') {
            sessionStorage.setItem(ident, JSON.stringify(value));
        }
        localStorage.setItem(ident, JSON.stringify(value));
        return this;
    }

    get(ident: string): any {
        if (this.storageType === 'session') {
            return JSON.parse(sessionStorage.getItem(ident));
        }
        try {
            return JSON.parse(localStorage.getItem(ident));
        } catch (e) {
            return null;
        }
    }

    clear(): StorageService {
        if (this.storageType === 'session') {
            sessionStorage.clear();
        }
        localStorage.clear();
        return this;
    }

    forSession(): StorageService {
        const sessionStorageService = new StorageService();
        sessionStorageService.storageType = 'session';
        return sessionStorageService;
    }
}