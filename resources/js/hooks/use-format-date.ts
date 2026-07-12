import { usePage } from '@inertiajs/react';
import { format as dateFnsFormat } from 'date-fns';
import { useCallback } from 'react';

/**
 * Hook that returns a date formatting function.
 * Automatically handles the user's local timezone and uses the app's default format.
 *
 * @returns A function to format dates
 */
export function useFormatDate() {
    const page = usePage();

    /**
     * Formats a date string/Date to the user's local timezone.
     *
     * @param date - ISO date string or Date object
     * @param format - date-fns format string (default: read from services.admin_date)
     * @returns Formatted date string or empty string if invalid
     *
     * @see https://date-fns.org/docs/format
     */
    return useCallback(
        function formatDate(
            date: string | Date | null | undefined,
            format?: string,
        ): string {
            if (!date) {
                return '';
            }

            const d = typeof date === 'string' ? new Date(date) : date;

            if (isNaN(d.getTime())) {
                return '';
            }

            let finalFormat = format;

            // If no format is provided, try to read the default from Inertia shared props
            if (!finalFormat) {
                try {
                    const { dateFormats } = page.props;
                    finalFormat = dateFormats?.date || 'dd MMM, yyyy';
                } catch {
                    finalFormat = 'dd MMM, yyyy';
                }
            }

            return dateFnsFormat(d, finalFormat);
        },
        [page.props],
    );
}
