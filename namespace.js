/**
 * Karis Antikvariat - Global Namespace Initialization
 * Ensures the global namespace is created before other scripts run
 */
(function(window) {
    // Only create the namespace if it doesn't already exist
    if (typeof window.KarisAntikvariat === 'undefined') {
        window.KarisAntikvariat = {
            // Placeholder for various modules
            Core: {},
            Public: {},
            Admin: {},
            Auth: {},
            Utils: {
                // Utility methods
                formatPrice: function(price) {
                    return '€' + parseFloat(price).toFixed(2);
                },
                formatDate: function(dateString) {
                    try {
                        const date = new Date(dateString);
                        return date.toLocaleDateString('sv-SE');
                    } catch (error) {
                        console.error('Error formatting date:', error);
                        return '';
                    }
                }
            }
        };
    }
})(window);