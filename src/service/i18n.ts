import { injectable, inject } from "springtype/core/di";
import { st } from "springtype/core";
import { translation } from "springtype/core/i18n";
import * as de from "../i18n/de.json";
import * as en from "../i18n/en.json";
import { PreferenceService } from "./preference";

export enum SupportedLanguages {
    DE = 'de',
    EN = 'en',
}

@translation(SupportedLanguages.DE, de)
@translation(SupportedLanguages.EN, en)
@injectable
export class I18nService {

    @inject(PreferenceService)
    preferenceService: PreferenceService;

    setLanguage(language: SupportedLanguages) {
        st.i18n.setLanguage(language);
        this.preferenceService.setLanguage(language);
        document.location.reload();
    }

    init() {

        // navigator.language usually "de-DE", "en_US" etc.
        const autoDetectedLanguage = navigator.language.split(/[-_]/)[0];
        const supportedLanguages: Array<string> = [SupportedLanguages.DE, SupportedLanguages.EN];

        const languagePreference = this.preferenceService.getLanguage();

        console.log('languagePreference', languagePreference);
        if (languagePreference) {
            st.i18n.setLanguage(languagePreference);
            return;
        }

        if (supportedLanguages.indexOf(autoDetectedLanguage) > -1) {
            st.i18n.setLanguage(autoDetectedLanguage);
        } else {
            st.i18n.setLanguage(SupportedLanguages.EN);
        }
    }
}