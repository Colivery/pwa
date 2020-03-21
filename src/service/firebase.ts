import * as firebase from "firebase/app";
import "firebase/auth";
import { injectable } from "springtype/core/di";

@injectable
export class FirebaseService {

  isInitialized: boolean = false;
  firebaseConfig: Object;

  // injected via second @inject() arg: @inject(FirebaseService, FIREBASE_CONFIG)
  constructor(firebaseConfig: Object) {
    this.initializeApp(firebaseConfig);
  }

  // @ts-ignore
  get SDK_VERSION(): string {
    return firebase.SDK_VERSION;
  }

  async initializeApp(firebaseConfig: Object, name?: string): Promise<void> {

    if (firebaseConfig) {
      this.firebaseConfig = firebaseConfig;
    }

    if (!this.isInitialized) {
      firebase.initializeApp(firebaseConfig, name);
      this.isInitialized = true;
    }
  }

  async isLoggedIn(): Promise<boolean> {
    if (firebase.auth().currentUser) {
      return true;
    }
    return false;
  }

  getLoggedInUserId(): string {
    return firebase.auth().currentUser.uid;
  }

  analytics(app?: firebase.app.App): firebase.analytics.Analytics {
    return firebase.analytics(app);
  }

  app(name?: string): firebase.app.App {
    return firebase.app(name);
  }

  // @ts-ignore
  get apps(): Array<firebase.app.App> {
    return firebase.apps;
  }

  auth(persistenceMode: firebase.auth.Auth.Persistence = firebase.auth.Auth.Persistence.SESSION, app?: firebase.app.App): firebase.auth.Auth {

    // solves the common pitfall of not setting the persistence mode ideomatically
    firebase.auth().setPersistence(persistenceMode);

    return firebase.auth(app);
  }

  database(app?: firebase.app.App): firebase.database.Database {
    return firebase.database(app);
  }

  firestore(app?: firebase.app.App): firebase.firestore.Firestore {
    return firebase.firestore(app);
  }

  functions(app?: firebase.app.App): firebase.functions.Functions {
    return firebase.functions(app);
  }

  messaging(app?: firebase.app.App): firebase.messaging.Messaging {
    return firebase.messaging(app);
  }

  performance(app?: firebase.app.App): firebase.performance.Performance {
    return firebase.performance(app);
  }

  registerVersion(library: string, version: string, variant?: string): void {
    return firebase.registerVersion(library, version, variant);
  }

  remoteConfig(app?: firebase.app.App): firebase.remoteConfig.RemoteConfig {
    return firebase.remoteConfig(app);
  }

  storage(app?: firebase.app.App): firebase.storage.Storage {
    return firebase.storage(app);
  }
}
