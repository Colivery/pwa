import { injectable } from "springtype/core/di";
import { st } from "springtype/core";
import { translation } from "springtype/core/i18n";
import * as de from "../i18n/de.json";
import * as en from "../i18n/en.json";

export enum SupportedLanguages {
    DE = 'de',
    EN = 'en',
}

@translation(SupportedLanguages.DE, de)
@translation(SupportedLanguages.EN, en)
@injectable
export class I18nService {

    setLanguage(language: SupportedLanguages) {
        st.i18n.setLanguage(language);
    }

    init() {

        // navigator.language usually "de-DE", "en-US" etc.
        const autoDetectedLanguage = navigator.language.split('-')[0];
        const supportedLanguages: Array<string> = [SupportedLanguages.DE, SupportedLanguages.EN];

        if (supportedLanguages.indexOf(autoDetectedLanguage) > -1) {
            st.i18n.setLanguage(autoDetectedLanguage);
        } else {

            // TODO: From PreferenceService
            st.i18n.setLanguage(SupportedLanguages.DE);
        }
    }
}