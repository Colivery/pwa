import { injectable, inject } from "springtype/core/di";
import { st } from "springtype/core";
import { translation } from "springtype/core/i18n";
import * as de from "../i18n/de.json";
import * as en from "../i18n/en.json";
import * as no from "../i18n/no.json";
import * as il from "../i18n/il.json";
import { PreferenceService } from "./preference";

@translation("de", de)
@translation("en", en)
@translation("no", no)
@translation("il", il)
@injectable
export class I18nService {

    @inject(PreferenceService)
    preferenceService: PreferenceService;

    aSupportedLanguages = [
        {
            key: "de",
            name: "Deutsch",
            icon: "https://www.countryflags.io/de/flat/32.png"
        },
        {
            key: "en",
            name: "Engish",
            icon: "https://www.countryflags.io/gb/flat/32.png"
        },
        {
            key: "no",
            name: "Norsk",
            icon: "https://www.countryflags.io/no/flat/32.png"
        },
        {
            key: "il",
            name: "עברית",
            icon: "https://www.countryflags.io/il/flat/32.png"
        }
    ];

    setLanguage(languageKey: string) {
        st.i18n.setLanguage(languageKey);
        this.preferenceService.setLanguage(languageKey);
        document.location.reload();
    }

    getSupportedLanguages() : object[] {
        return this.aSupportedLanguages;
    }

    getLanguageByTag(languageKey : String) : object {
        return this.aSupportedLanguages.find(function (languageItem: object) {
            return languageKey === languageItem.key;
        });
    }

    getLanguage() : string {
        return this.preferenceService.getLanguage();
    }

    init() {
        // navigator.language usually "de-DE", "en_US" etc.
        const autoDetectedLanguage = navigator.language.split(/[-_]/)[0];
        const languagePreference = this.preferenceService.getLanguage();

        if (autoDetectedLanguage === "il" || languagePreference === "il") {
            document.body.setAttribute("dir", "rtl");
        }

        console.log('languagePreference', languagePreference);
        if (languagePreference) {
            st.i18n.setLanguage(languagePreference);
            return;
        }

        var sLanguagKey = "en";
        for (var i = 0; i < this.aSupportedLanguages.length; i++) {
            if (this.aSupportedLanguages[i].key === autoDetectedLanguage) {
                sLanguagKey = autoDetectedLanguage;
            }
        }
        st.i18n.setLanguage(sLanguagKey);
    }
}