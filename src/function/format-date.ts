import { formatRelative } from 'date-fns'
import { de, enUS, nn, he, hi } from 'date-fns/locale'
import { I18nService, SupportedLocales } from '../service/i18n';
import { st } from 'springtype/core';

const locales = {
    [SupportedLocales.DE]: de,
    [SupportedLocales.EN]: enUS,
    [SupportedLocales.NN]: nn,
    [SupportedLocales.HE]: he,
    [SupportedLocales.HI]: hi
}

export const formatDate = (date: Date) => {
    const i18nService: I18nService = st.inject(I18nService);
    return formatRelative(date, new Date(), { locale: locales[i18nService.getLanguage()] });
}