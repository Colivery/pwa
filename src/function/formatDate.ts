import { formatRelative } from 'date-fns'
import { de, enUS, nn, he } from 'date-fns/locale'
import { I18nService } from '../service/i18n';
import { st } from 'springtype/core';

const locales = {
    'de': de,
    'en': enUS,
    'nn': nn,
    'il': he
}

export const formatDate = (date: Date) => {
    const i18nService: I18nService = st.inject(I18nService);
    return formatRelative(date, new Date(), { locale: locales[i18nService.getLanguage()] });
}