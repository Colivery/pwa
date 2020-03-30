import { formatRelative } from 'date-fns'
import { de } from 'date-fns/locale'

export const formatDate = (date: Date) => {
    return formatRelative(date, new Date(), { locale: de });
}