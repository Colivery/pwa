import { injectable, inject } from "springtype/core/di";
import { FirebaseService } from "./firebase";
import { FIREBASE_CONFIG } from "../config/firebase";
import { StorageService } from "./storage";

const SCALE_FACTOR = 'scale-factor';
const THEME_COLOR = 'theme-color';

@injectable
export class PreferenceService {

    @inject(StorageService)
    storageService: StorageService;

    @inject(FirebaseService, FIREBASE_CONFIG)
    firebaseService: FirebaseService;

    constructor() {

        console.log('PreferenceService created', this.storageService, this.firebaseService)
        this.syncPreferences();
    }

    syncPreferences() {

        // fetch firebase storage (if online and logged in)

        // fetch localStorage
    }

    getFontSizeScaleFactor() {
        return this.storageService.get(SCALE_FACTOR) || 100;
    }

    setFontSizeScaleFactor(scaleFactor: number) {
        this.storageService.set(SCALE_FACTOR, scaleFactor);
    }

    setThemeColor(hexColor: string) {
        this.storageService.set(THEME_COLOR, hexColor);
    }

    getThemeColor() {
        return this.storageService.get(THEME_COLOR);
    }
}