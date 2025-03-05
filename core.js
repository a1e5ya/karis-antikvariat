/**
 * Karis Antikvariat - Core Utility Module
 * This file contains core utility functions for the inventory system
 */

// Immediately assign to the pre-existing or newly created namespace
(function(KarisAntikvariat) {
    // Ensure KarisAntikvariat exists
    if (typeof KarisAntikvariat === 'undefined') {
        throw new Error('KarisAntikvariat namespace is not initialized');
    }

    // Core Utility Functions
    KarisAntikvariat.Core = {
        /**
         * Validates the item form fields
         * @param {Object} formData - The form data to validate
         * @returns {Object} - Object with isValid boolean and array of error messages
         */
        validateItemForm: function(formData) {
            const errors = [];
            
            // Required fields
            if (!formData.title || formData.title.trim() === '') {
                errors.push('Titel är obligatorisk');
            }
            
            if (!formData.category || formData.category.trim() === '') {
                errors.push('Kategori är obligatorisk');
            }
            
            if (!formData.price || isNaN(parseFloat(formData.price))) {
                errors.push('Pris måste vara ett giltigt nummer');
            } else if (parseFloat(formData.price) <= 0) {
                errors.push('Pris måste vara större än 0');
            }
            
            // Author validation (either first name or last name should be present)
            if (formData.authorFirstName === '' && formData.authorLastName === '') {
                errors.push('Antingen för- eller efternamn på författaren måste anges');
            }
            
            return {
                isValid: errors.length === 0,
                errors: errors
            };
        },
        
        /**
         * Sanitizes user input to prevent XSS
         * @param {string} input - The input to sanitize
         * @returns {string} - The sanitized input
         */
        sanitizeInput: function(input) {
            if (typeof input !== 'string') {
                return input;
            }
            
            // Replace HTML special characters
            return input
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        },
    
    // Search and Filtering Functions
    /**
     * Performs advanced search across multiple fields
     * @param {Array} items - Array of items to search
     * @param {Object} searchParams - Search parameters
     * @returns {Array} - Filtered items
     */
    performAdvancedSearch: function(items, searchParams) {
        if (!items || !items.length) {
            return [];
        }
        
        return items.filter(item => {
            // Search term matching (title, author, ID)
            const matchesSearchTerm = !searchParams.searchTerm || 
                item.title.toLowerCase().includes(searchParams.searchTerm.toLowerCase()) ||
                (item.author && item.author.toLowerCase().includes(searchParams.searchTerm.toLowerCase())) ||
                item.id.toString().includes(searchParams.searchTerm);
            
            // Category filter matching
            const matchesCategory = !searchParams.category || 
                searchParams.category === 'any' || 
                (item.category + (item.shelf ? " - " + item.shelf : "")).toLowerCase().includes(searchParams.category.toLowerCase());
            
            // Genre filter matching
            const matchesGenre = !searchParams.genre || 
                item.genre && item.genre.toLowerCase().includes(searchParams.genre.toLowerCase());
            
            // Condition filter matching
            const matchesCondition = !searchParams.condition || 
                item.condition && 
                (typeof item.condition === 'string' ? 
                    item.condition.toLowerCase() === searchParams.condition.toLowerCase() : 
                    item.condition.name.toLowerCase() === searchParams.condition.toLowerCase());
            
            // Status filter matching
            const matchesStatus = !searchParams.status || 
                searchParams.status === 'all' || 
                item.status.toLowerCase() === searchParams.status.toLowerCase();
            
            // Price range matching
            const matchesPriceRange = 
                (!searchParams.minPrice || item.price >= parseFloat(searchParams.minPrice)) && 
                (!searchParams.maxPrice || item.price <= parseFloat(searchParams.maxPrice));
            
            // Date range matching
            const itemDate = new Date(item.date);
            const matchesDateRange = 
                (!searchParams.startDate || itemDate >= new Date(searchParams.startDate)) && 
                (!searchParams.endDate || itemDate <= new Date(searchParams.endDate));
            
            // Combine all filter conditions
            return matchesSearchTerm && 
                   matchesCategory && 
                   matchesGenre && 
                   matchesCondition && 
                   matchesStatus && 
                   matchesPriceRange && 
                   matchesDateRange;
        });
    },
    
    /**
     * Filters items by category
     * @param {Array} items - Array of items to filter
     * @param {string} category - Category to filter by
     * @returns {Array} - Filtered items
     */
    filterItemsByCategory: function(items, category) {
        if (!category || category === 'all' || category === 'any') {
            return items;
        }
        
        return items.filter(item => 
            (item.category + (item.shelf ? " - " + item.shelf : "")).toLowerCase().includes(category.toLowerCase())
        );
    },
    
    /**
     * Filters items by price range
     * @param {Array} items - Array of items to filter
     * @param {number} minPrice - Minimum price
     * @param {number} maxPrice - Maximum price
     * @returns {Array} - Filtered items
     */
    filterItemsByPrice: function(items, minPrice, maxPrice) {
        return items.filter(item => {
            const price = parseFloat(item.price);
            
            if (minPrice && maxPrice) {
                return price >= minPrice && price <= maxPrice;
            } else if (minPrice) {
                return price >= minPrice;
            } else if (maxPrice) {
                return price <= maxPrice;
            }
            
            return true;
        });
    },
    
    /**
     * Sorts items based on various criteria
     * @param {Array} items - Array of items to sort
     * @param {string} sortBy - Field to sort by
     * @param {boolean} ascending - Sort direction (true for ascending, false for descending)
     * @returns {Array} - Sorted items
     */
    sortItems: function(items, sortBy, ascending = true) {
        const sortedItems = [...items]; // Create a copy to avoid modifying the original array
        
        sortedItems.sort((a, b) => {
            let valueA, valueB;
            
            switch (sortBy) {
                case 'title':
                    valueA = a.title.toLowerCase();
                    valueB = b.title.toLowerCase();
                    break;
                case 'author':
                    valueA = (a.author || '').toLowerCase();
                    valueB = (b.author || '').toLowerCase();
                    break;
                case 'price':
                    valueA = parseFloat(a.price);
                    valueB = parseFloat(b.price);
                    break;
                case 'date':
                    valueA = new Date(a.date);
                    valueB = new Date(b.date);
                    break;
                case 'id':
                default:
                    valueA = a.id;
                    valueB = b.id;
            }
            
            if (valueA < valueB) {
                return ascending ? -1 : 1;
            }
            if (valueA > valueB) {
                return ascending ? 1 : -1;
            }
            return 0;
        });
        
        return sortedItems;
    },
    
    // Export and Reporting Functions
    /**
     * Exports inventory to CSV format
     * @param {Array} items - Array of items to export
     * @param {Array} fields - Array of field names to include
     * @returns {string} - CSV string
     */
    exportToCSV: function(items, fields) {
        if (!items || !items.length) {
            return '';
        }
        
        // Default fields if none provided
        const exportFields = fields || [
            'id', 'title', 'author', 'category', 'genre', 'condition', 
            'shelf', 'price', 'status', 'date', 'notes'
        ];
        
        // Create header row
        let csv = exportFields.join(',') + '\n';
        
        // Add item rows
        items.forEach(item => {
            const row = exportFields.map(field => {
                let value = item[field];
                
                // Handle special cases
                if (field === 'condition' && typeof value === 'object') {
                    value = value.name;
                }
                
                // Quote and escape strings
                if (typeof value === 'string') {
                    // Escape quotes by doubling them and wrap in quotes
                    return '"' + value.replace(/"/g, '""') + '"';
                }
                
                return value !== undefined && value !== null ? value : '';
            });
            
            csv += row.join(',') + '\n';
        });
        
        return csv;
    },
    
    /**
     * Generates a comprehensive inventory report
     * @param {Array} items - Array of items to include in report
     * @returns {Object} - Report data
     */
    generateInventoryReport: function(items) {
        if (!items || !items.length) {
            return {
                totalItems: 0,
                totalValue: 0,
                categoryCounts: {},
                statusCounts: {},
                conditionCounts: {}
            };
        }
        
        // Initialize report object
        const report = {
            totalItems: items.length,
            totalValue: 0,
            categoryCounts: {},
            statusCounts: {},
            conditionCounts: {},
            shelfCounts: {},
            genreCounts: {},
            availableItemsValue: 0,
            soldItemsValue: 0,
            averagePrice: 0,
            oldestItem: null,
            newestItem: null
        };
        
        // Process each item
        items.forEach(item => {
            // Total value calculation
            const price = parseFloat(item.price) || 0;
            report.totalValue += price;
            
            // Status-based value calculations
            if (item.status === 'Tillgänglig') {
                report.availableItemsValue += price;
            } else if (item.status === 'Såld') {
                report.soldItemsValue += price;
            }
            
            // Category counts
            const category = item.category || 'Uncategorized';
            report.categoryCounts[category] = (report.categoryCounts[category] || 0) + 1;
            
            // Status counts
            const status = item.status || 'Unknown';
            report.statusCounts[status] = (report.statusCounts[status] || 0) + 1;
            
            // Condition counts
            let condition;
            if (typeof item.condition === 'object') {
                condition = item.condition.name || 'Unknown';
            } else {
                condition = item.condition || 'Unknown';
            }
            report.conditionCounts[condition] = (report.conditionCounts[condition] || 0) + 1;
            
            // Shelf counts
            const shelf = item.shelf || 'Unassigned';
            report.shelfCounts[shelf] = (report.shelfCounts[shelf] || 0) + 1;
            
            // Genre counts
            const genre = item.genre || 'Unspecified';
            report.genreCounts[genre] = (report.genreCounts[genre] || 0) + 1;
            
            // Track oldest and newest items
            const itemDate = new Date(item.date);
            if (!report.oldestItem || itemDate < new Date(report.oldestItem.date)) {
                report.oldestItem = item;
            }
            if (!report.newestItem || itemDate > new Date(report.newestItem.date)) {
                report.newestItem = item;
            }
        });
        
        // Calculate average price
        report.averagePrice = report.totalValue / report.totalItems;
        
        return report;
    },
    
    // Miscellaneous Utility Functions
    /**
     * Standardizes currency formatting
     * @param {number} amount - The amount to format
     * @param {string} currencySymbol - The currency symbol to use
     * @returns {string} - Formatted currency string
     */
    formatCurrency: function(amount, currencySymbol = '€') {
        if (isNaN(amount)) {
            return currencySymbol + '0.00';
        }
        
        return currencySymbol + parseFloat(amount).toFixed(2);
    },
    
    /**
     * Provides consistent date parsing
     * @param {string} dateString - The date string to parse
     * @param {string} format - Output format (short, medium, long)
     * @returns {string} - Formatted date string
     */
    parseDate: function(dateString, format = 'medium') {
        if (!dateString) {
            return '';
        }
        
        try {
            const date = new Date(dateString);
            
            // Check if date is valid
            if (isNaN(date.getTime())) {
                return '';
            }
            
            // Format options based on requested format
            let options;
            
            switch (format) {
                case 'short':
                    options = { year: 'numeric', month: 'numeric', day: 'numeric' };
                    break;
                case 'long':
                    options = { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    };
                    break;
                case 'medium':
                default:
                    options = { year: 'numeric', month: 'short', day: 'numeric' };
            }
            
            // Use Swedish locale by default
            return date.toLocaleDateString('sv-SE', options);
            
        } catch (error) {
            console.error('Error parsing date:', error);
            return '';
        }
    },
    
    /**
     * Generates a unique ID for new items
     * @param {Array} existingItems - Array of existing items
     * @returns {number} - New unique ID
     */
    generateUniqueId: function(existingItems) {
        if (!existingItems || !existingItems.length) {
            return 1;
        }
        
        // Find the highest existing ID and add 1
        const highestId = Math.max(...existingItems.map(item => parseInt(item.id)));
        return highestId + 1;
    },
    
    /**
     * Fetches items from the mock data or a future API
     * @param {Object} params - Parameters for fetching data
     * @returns {Promise} - Promise resolving to items array
     */
    fetchItems: function(params = {}) {
        // In a real application, this would call an API
        // For now, use the mock data
        return new Promise((resolve) => {
            setTimeout(() => {
                let filteredItems = [...KarisAntikvariat.mockItems];
                
                // Apply any filtering
                if (params.searchTerm || 
                    params.category || 
                    params.status || 
                    params.minPrice || 
                    params.maxPrice) {
                    filteredItems = this.performAdvancedSearch(filteredItems, params);
                }
                
                // Apply sorting
                if (params.sortBy) {
                    filteredItems = this.sortItems(
                        filteredItems, 
                        params.sortBy, 
                        params.sortDirection !== 'desc'
                    );
                }
                
                // Apply pagination
                if (params.page && params.pageSize) {
                    const startIndex = (params.page - 1) * params.pageSize;
                    filteredItems = filteredItems.slice(startIndex, startIndex + params.pageSize);
                }
                
                resolve(filteredItems);
            }, 100); // Simulate network delay
        });
    },
    
    /**
     * Debounces a function to limit how often it can be called
     * @param {Function} func - The function to debounce
     * @param {number} wait - The delay in milliseconds
     * @returns {Function} - Debounced function
     */
    debounce: function(func, wait) {
        let timeout;
        
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

 // Export for module systems if needed
 if (typeof module !== 'undefined' && module.exports) {
    module.exports = KarisAntikvariat.Core;
}
})(window.KarisAntikvariat);