import { st } from "springtype/core";
import { MatSelect, MatSelectItem, MatSelectItemDetail } from "st-materialize";
import { SupportedLanguage, I18nService } from "../../service/i18n";
import { tsx } from "springtype/web/vdom";
import { IEvent } from "springtype/web/component/interface";
import { inject } from "springtype/core/di";
import { SplashscreenService } from "../../service/splashscreen";
import { component } from "springtype/web/component";

@component
export class LanguageSelector extends st.component {

    @inject(I18nService)
    i18nService: I18nService;

    @inject(SplashscreenService)
    splashscreenService: SplashscreenService;

    render() {
        return <MatSelect onSelectItem={this.onSelectLanguageItem}>
            {this.i18nService.getSupportedLanguages().map((supportedLanguage: SupportedLanguage) =>
                <MatSelectItem selected={supportedLanguage.key === this.i18nService.getLanguage()}
                    label={supportedLanguage.name} value={supportedLanguage.key}
                    item={supportedLanguage}></MatSelectItem>)}
        </MatSelect>
    }

    onSelectLanguageItem = (evt: IEvent<MatSelectItemDetail>) => {

        const language = evt.detail.value;

        this.splashscreenService.show();

        window.setTimeout(() => {
            this.i18nService.setLanguage(language);
        }, 100);
    }
}