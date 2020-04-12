import { formatRelative } from 'date-fns'
import { de, enUS, nn, he, hi } from 'date-fns/locale'
import { I18nService } from '../service/i18n';
import { st } from 'springtype/core';

const locales = {
    'de': de,
    'en': enUS,
    'nn': nn,
    'il': he,
    'hi': hi
}

export const formatDate = (date: Date) => {
    const i18nService: I18nService = st.inject(I18nService);
    return formatRelative(date, new Date(), { locale: locales[i18nService.getLanguage()] });
}