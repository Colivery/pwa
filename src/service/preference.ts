import { injectable, inject } from "springtype/core/di";
import { FirebaseService } from "./firebase";
import { FIREBASE_CONFIG } from "../config/firebase";
import { StorageService } from "./storage";
import { Profile } from "../datamodel/profile";

@injectable
export class PreferenceService {

    @inject(StorageService)
    storageService: StorageService;

    @inject(FirebaseService, FIREBASE_CONFIG)
    firebaseService: FirebaseService;

    static readonly PREFERENCE_PROFILE = 'PREFERENCE_PROFILE';
    static readonly PREFERENCE_LANGUAGE = 'PREFERENCE_LANGUAGE';

    constructor() {
        this.syncPreferences();
    }

    syncPreferences() {

        // TODO: Maybe in future: cross-device preference sync

        // fetch firebase storage (if online and logged in)

        // fetch localStorage
    }

    setLanguage(languageTag: string) {
        this.storageService.set(PreferenceService.PREFERENCE_LANGUAGE, languageTag);
    }

    getLanguage(): string {
        return this.storageService.get(PreferenceService.PREFERENCE_LANGUAGE);
    }

    getProfile() {
        return this.storageService.get(PreferenceService.PREFERENCE_PROFILE) || 'consumer';
    }

    setProfile(profile: Profile) {
        this.storageService.set(PreferenceService.PREFERENCE_PROFILE, profile);
    }
}