import { injectable, inject } from "springtype/core/di";
import { FirebaseService } from "./firebase";
import { FIREBASE_CONFIG } from "../config/firebase";
import { StorageService } from "./storage";
import { Profile } from "../datamodel/profile";

const PROFILE = 'profile';

@injectable
export class PreferenceService {

    @inject(StorageService)
    storageService: StorageService;

    @inject(FirebaseService, FIREBASE_CONFIG)
    firebaseService: FirebaseService;

    profile;

    constructor() {
        this.syncPreferences();
    }

    syncPreferences() {

        // fetch firebase storage (if online and logged in)

        // fetch localStorage
    }

    getProfile() {
        return this.profile || 'consumer';
    }

    setProfile(profile: Profile) {
        this.profile = profile;
    }
}