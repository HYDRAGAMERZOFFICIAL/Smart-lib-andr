/**
 * Format a number as currency
 * 
 * @param {number} amount - The amount to format
 * @param {string} locale - The locale to use for formatting (default: 'en-IN')
 * @param {string} currency - The currency code (default: 'INR')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, locale = 'en-IN', currency = 'INR') => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(amount);
};