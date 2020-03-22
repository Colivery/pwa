import { injectable, inject } from "springtype/core/di";
import { FirebaseService } from "./firebase";
import { FIREBASE_CONFIG } from "../config/firebase";
import { StorageService } from "./storage";
import { Profile } from "../types/profile";

const PROFILE = 'profile';

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

    getProfile() {
        return this.storageService.get(PROFILE);
    }

    setProfile(profile: Profile) {
        this.storageService.set(PROFILE, profile);
    }
}