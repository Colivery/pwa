import { injectable, inject } from "springtype/core/di";
import { st } from "springtype/core";
import { translation } from "springtype/core/i18n";
import * as de from "../i18n/de.json";
import * as en from "../i18n/en.json";
import * as nn from "../i18n/nn.json";
import * as he from "../i18n/he.json";
import * as hi from "../i18n/hi.json";
import { PreferenceService } from "./preference";

export interface SupportedLanguage {
    key: string;
    name: string;
    icon: string;
}

@translation("de", de)
@translation("en", en)
@translation("nn", nn)
@translation("he", he)
@translation("hi", hi)
@injectable
export class I18nService {

    @inject(PreferenceService)
    preferenceService: PreferenceService;

    supportedLanguages: Array<SupportedLanguage> = [
        {
            key: "de",
            name: "Deutsch",
            icon: "https://www.countryflags.io/de/flat/32.png"
        },
        {
            key: "en",
            name: "English",
            icon: "https://www.countryflags.io/gb/flat/32.png"
        },
        {
            key: "nn",
            name: "Norsk",
            icon: "https://www.countryflags.io/no/flat/32.png"
        },
        {
            key: "he",
            name: "עברית",
            icon: "https://www.countryflags.io/il/flat/32.png"
        },
        {
            key: "hi",
            name: "भारतीय",
            icon: "https://www.countryflags.io/il/flat/32.png"
        }
    ];

    constructor() {
        st.i18n.setFallbackLanguage('en');
    }

    setLanguage(languageKey: string) {
        st.i18n.setLanguage(languageKey);

        this.preferenceService.setLanguage(languageKey);
        document.location.reload();
    }

    getSupportedLanguages(): Array<SupportedLanguage> {
        return this.supportedLanguages;
    }

    getLanguageByTag(languageKey: String): object {
        return this.supportedLanguages.find((languageItem: SupportedLanguage) => {
            return languageKey === languageItem.key;
        });
    }

    getLanguage(): string {
        return this.preferenceService.getLanguage();
    }

    init() {
        // navigator.language usually "de-DE", "en_US" etc.
        const autoDetectedLanguage = navigator.language.split(/[-_]/)[0];
        const languagePreference = this.preferenceService.getLanguage();

        if (autoDetectedLanguage === "he" || languagePreference === "he") {
            document.body.setAttribute("dir", "rtl");
        }

        console.log('languagePreference', languagePreference);
        if (languagePreference) {
            st.i18n.setLanguage(languagePreference);
            return;
        }

        var sLanguagKey = "en";
        for (var i = 0; i < this.supportedLanguages.length; i++) {
            if (this.supportedLanguages[i].key === autoDetectedLanguage) {
                sLanguagKey = autoDetectedLanguage;
            }
        }
        st.i18n.setLanguage(sLanguagKey);
    }
}