import { injectable, inject } from "springtype/core/di";
import { st } from "springtype/core";
import { translation } from "springtype/core/i18n";
import * as de from "../i18n/de.json";
import * as en from "../i18n/en.json";
import * as nn from "../i18n/nn.json";
import * as he from "../i18n/he.json";
import * as hi from "../i18n/hi.json";
import * as ko from "../i18n/ko.json";
import { PreferenceService } from "./preference";

export interface SupportedLanguage {
    key: string;
    name: string;
    icon: string;
}

export enum SupportedLocales {
    DE = "de",
    EN = "en",
    NN = "nn",
    HE = "he",
    HI = "hi",
    KO = "ko"
}

@translation(SupportedLocales.DE, de)
@translation(SupportedLocales.EN, en)
@translation(SupportedLocales.NN, nn)
@translation(SupportedLocales.HE, he)
@translation(SupportedLocales.HI, hi)
@translation(SupportedLocales.KO, ko)
@injectable
export class I18nService {

    @inject(PreferenceService)
    preferenceService: PreferenceService;

    supportedLanguages: Array<SupportedLanguage> = [
        {
            key: SupportedLocales.DE,
            name: "Deutsch",
            icon: "https://www.countryflags.io/de/flat/32.png"
        },
        {
            key: SupportedLocales.EN,
            name: "English",
            icon: "https://www.countryflags.io/gb/flat/32.png"
        },
        {
            key: SupportedLocales.NN,
            name: "Norsk (beta)",
            icon: "https://www.countryflags.io/no/flat/32.png"
        },
        {
            key: SupportedLocales.HE,
            name: "עברית (beta)",
            icon: "https://www.countryflags.io/il/flat/32.png"
        },
        {
            key: SupportedLocales.HI,
            name: "हिन्दी (beta)",
            icon: "https://www.countryflags.io/il/flat/32.png"
        },
        {
            key: SupportedLocales.KO,
            name: "한국어를 (beta)",
            icon: "https://www.countryflags.io/kr/flat/32.png"
        }
    ];

    constructor() {
        st.i18n.setFallbackLanguage(SupportedLocales.EN);
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
        return this.preferenceService.getLanguage() || this.autoDetectLanguage();;
    }

    autoDetectLanguage(): string {
        return navigator.language.split(/[-_]/)[0];
    }

    init() {
        // navigator.language usually "de-DE", "en_US" etc.
        const languagePreference = this.getLanguage();

        if (languagePreference === SupportedLocales.HE) {
            document.body.setAttribute("dir", "rtl");
        }

        if (languagePreference) {
            st.i18n.setLanguage(languagePreference);
            return;
        }

        let languagKey: string = SupportedLocales.EN;
        for (var i = 0; i < this.supportedLanguages.length; i++) {
            if (this.supportedLanguages[i].key === languagePreference) {
                languagKey = languagePreference;
            }
        }
        st.i18n.setLanguage(languagKey);
    }
}