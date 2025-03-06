/**
 * Karis Antikvariat - Lists & Filters System
 * This file contains functionality for the Lists tab and batch operations
 */

// Add Lists functionality to the global namespace
window.KarisAntikvariat = window.KarisAntikvariat || {};

// Lists & Filters Module
KarisAntikvariat.Filters = {
    // Current list state
    currentItems: [],
    filteredItems: [],
    selectedIds: [],
    paginationInfo: {
        currentPage: 1,
        itemsPerPage: 15,
        totalPages: 1
    },
    
    // Initialize Lists & Filters
    init: function() {
        console.log("Initializing Filters module");
        
        // Populate all dropdown menus from database
        this.populateDropdowns();
        
        // Load data
        this.loadItemsFromDatabase();
        
        // Setup event handlers
        this.setupEventHandlers();
        
        // Update UI elements
        this.updatePaginationControls();
        this.updateBatchActionButtons();
    },
    
    // Populate all dropdown menus from database references
    populateDropdowns: function() {
        this.populateCategoryDropdown();
        this.populateGenreDropdown();
        this.populateConditionDropdown();
        this.populateShelfDropdown();
        this.populateStatusDropdown();
    },
    
    // Populate category dropdown
    populateCategoryDropdown: function() {
        const $dropdown = $('#list-categories');
        
        // Clear dropdown
        $dropdown.empty();
        
        // Add options for each category
        if (KarisAntikvariat.Categories && KarisAntikvariat.Categories.length) {
            KarisAntikvariat.Categories.forEach(category => {
                $dropdown.append(`<option value="${category.name.toLowerCase()}">${category.name}</option>`);
            });
        } else {
            console.warn("Categories not found in database");
        }
    },
    
    // Populate genre dropdown
    populateGenreDropdown: function() {
        const $dropdown = $('#list-genre');
        
        // Clear dropdown
        $dropdown.empty();
        
        // Add default option
        $dropdown.append('<option value="">Alla genrer</option>');
        
        // Add options for each genre
        if (KarisAntikvariat.Genres && KarisAntikvariat.Genres.length) {
            KarisAntikvariat.Genres.forEach(genre => {
                $dropdown.append(`<option value="${genre.name}">${genre.name}</option>`);
            });
        } else {
            console.warn("Genres not found in database");
        }
    },
    
    // Populate condition dropdown
    populateConditionDropdown: function() {
        const $dropdown = $('#list-condition');
        
        // Clear dropdown
        $dropdown.empty();
        
        // Add default option
        $dropdown.append('<option value="">Alla skick</option>');
        
        // Add options for each condition
        if (KarisAntikvariat.Conditions && KarisAntikvariat.Conditions.length) {
            KarisAntikvariat.Conditions.forEach(condition => {
                $dropdown.append(`<option value="${condition.name}">${condition.name}</option>`);
            });
        } else {
            console.warn("Conditions not found in database");
        }
    },
    
    // Populate shelf dropdown
    populateShelfDropdown: function() {
        const $dropdowns = $('#shelf-selector, #newShelf');
        
        // Clear dropdowns
        $dropdowns.each(function() {
            $(this).empty();
            
            // Add default option
            $(this).append('<option value="">Välj hylla</option>');
        });
        
        // Add options for each shelf
        if (KarisAntikvariat.Shelves && KarisAntikvariat.Shelves.length) {
            KarisAntikvariat.Shelves.forEach(shelf => {
                $dropdowns.append(`<option value="${shelf.name}">${shelf.name}</option>`);
            });
        } else {
            console.warn("Shelves not found in database");
        }
    },
    
    // Populate status dropdown
    populateStatusDropdown: function() {
        const $dropdown = $('#list-status, #newStatus');
        
        // Clear dropdown
        $dropdown.each(function() {
            $(this).empty();
            
            // Add default option if it's the filter dropdown
            if (this.id === 'list-status') {
                $(this).append('<option value="all">Alla statusar</option>');
            } else {
                $(this).append('<option value="">Välj status</option>');
            }
        });
        
        // Add options for each status
        if (KarisAntikvariat.StatusTypes && KarisAntikvariat.StatusTypes.length) {
            KarisAntikvariat.StatusTypes.forEach(status => {
                $dropdown.append(`<option value="${status.name}">${status.name}</option>`);
            });
        } else {
            console.warn("Status types not found in database");
        }
    },
    
    // Load items from the database (mock implementation)
    loadItemsFromDatabase: function() {
        // In a real app, this would fetch from an API
        this.currentItems = KarisAntikvariat.mockItems || [];
        this.filteredItems = [...this.currentItems];
        
        // Initial render
        this.renderPage();
    },
    
    // Set up all event handlers for Lists tab
    setupEventHandlers: function() {
        const self = this;
        
        // Common list filters
        $('#list-no-price').click(function() {
            self.filterItemsWithoutPrice();
        });
        
        $('#list-poor-condition').click(function() {
            self.filterItemsByPoorCondition();
        });
        
        $('#shelf-selector').change(function() {
            const shelf = $(this).val();
            if (shelf) {
                self.filterItemsByShelf(shelf);
            }
        });
        
        $('#list-older-than').click(function() {
            const year = $('#year-threshold').val();
            if (year && year !== '') {
                self.filterItemsOlderThan(parseInt(year));
            } else {
                alert('Vänligen ange ett årtal');
            }
        });
        
        // Apply custom filter
        $('#apply-filter-btn').click(function() {
            self.applyCustomFilters();
        });
        
        // Batch action buttons
        $('#batch-update-price').click(function() {
            $('#price-unit').text('€');
            new bootstrap.Modal($('#updatePriceModal')).show();
        });
        
        $('#batch-update-status').click(function() {
            new bootstrap.Modal($('#updateStatusModal')).show();
        });
        
        $('#batch-move-shelf').click(function() {
            $('#shelf-item-count').text(self.selectedIds.length);
            new bootstrap.Modal($('#moveShelfModal')).show();
        });
        
        $('#batch-delete').click(function() {
            self.deleteSelectedItems();
        });
        
        // Change price unit based on selected action
        $('input[name="priceAction"]').change(function() {
            const action = $('input[name="priceAction"]:checked').val();
            $('#price-unit').text(action === 'set' ? '€' : '%');
        });
        
        // Form submissions
        $('#update-price-form').submit(function(e) {
            e.preventDefault();
            self.updatePriceForSelectedItems();
        });
        
        $('#update-status-form').submit(function(e) {
            e.preventDefault();
            self.updateStatusForSelectedItems();
        });
        
        $('#move-shelf-form').submit(function(e) {
            e.preventDefault();
            self.moveSelectedItemsToShelf();
        });
        
        // Select all checkbox
        $('#select-all').change(function() {
            const isChecked = $(this).prop('checked');
            $('input[name="list-item"]').prop('checked', isChecked);
            self.updateSelectedItems();
        });
        
        // Individual checkboxes (delegated event)
        $('#lists-body').on('change', 'input[name="list-item"]', function() {
            self.updateSelectedItems();
            
            // Update "select all" checkbox state
            const allChecked = $('input[name="list-item"]').length === 
                               $('input[name="list-item"]:checked').length;
            $('#select-all').prop('checked', allChecked);
        });
        
        // Pagination controls
        $('#prev-page-btn').click(function() {
            if (self.paginationInfo.currentPage > 1) {
                self.paginationInfo.currentPage--;
                self.renderPage();
                self.updatePaginationControls();
            }
        });
        
        $('#next-page-btn').click(function() {
            if (self.paginationInfo.currentPage < self.paginationInfo.totalPages) {
                self.paginationInfo.currentPage++;
                self.renderPage();
                self.updatePaginationControls();
            }
        });
        
        // Print and export buttons
        $('#print-list-btn').click(function() {
            self.printCurrentList();
        });
        
        $('#export-csv-btn').click(function() {
            self.exportListToCSV();
        });
    },
    
    // Update the batch action buttons based on selection
    updateBatchActionButtons: function() {
        const hasSelection = this.selectedIds.length > 0;
        
        $('#batch-update-price').prop('disabled', !hasSelection);
        $('#batch-update-status').prop('disabled', !hasSelection);
        $('#batch-move-shelf').prop('disabled', !hasSelection);
        $('#batch-delete').prop('disabled', !hasSelection);
        
        // Update selected count
        $('#selected-count').text(this.selectedIds.length);
    },
    
    // Update pagination controls
    updatePaginationControls: function() {
        $('#current-page').text(this.paginationInfo.currentPage);
        $('#total-pages').text(this.paginationInfo.totalPages);
        
        // Enable/disable pagination buttons
        $('#prev-page-btn').prop('disabled', this.paginationInfo.currentPage <= 1);
        $('#next-page-btn').prop('disabled', this.paginationInfo.currentPage >= this.paginationInfo.totalPages);
    },
    
    // Reset pagination to first page
    resetPagination: function() {
        this.paginationInfo.currentPage = 1;
    },
    
    // Show filter notification
    showFilterNotification: function(filterName, resultCount) {
        // Create or update toast notification
        const toast = `
            <div class="toast-container position-fixed bottom-0 end-0 p-3">
                <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header">
                        <strong class="me-auto">Filter: ${filterName}</strong>
                        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                        ${resultCount} objekt hittades
                    </div>
                </div>
            </div>
        `;
        
        // Remove any existing toast container
        $('.toast-container').remove();
        
        // Add the new toast to the body
        $('body').append(toast);
        
        // Show the toast
        const toastEl = document.querySelector('.toast');
        const bsToast = new bootstrap.Toast(toastEl, { autohide: true, delay: 3000 });
        bsToast.show();
    },
    
    // Filter items that don't have a price
    filterItemsWithoutPrice: function() {
        this.filteredItems = this.currentItems.filter(item => 
            !item.price || item.price <= 0 || isNaN(parseFloat(item.price))
        );
        
        this.resetPagination();
        this.renderPage();
        this.showFilterNotification('Objekt utan pris', this.filteredItems.length);
    },
    
    // Filter items in poor condition
    filterItemsByPoorCondition: function() {
        this.filteredItems = this.currentItems.filter(item => {
            const condition = typeof item.condition === 'object' 
                ? item.condition.name 
                : item.condition;
            
            return condition === 'Acceptabelt';
        });
        
        this.resetPagination();
        this.renderPage();
        this.showFilterNotification('Objekt i dåligt skick', this.filteredItems.length);
    },
    
    // Filter items by shelf
    filterItemsByShelf: function(shelf) {
        this.filteredItems = this.currentItems.filter(item => 
            item.shelf === shelf
        );
        
        this.resetPagination();
        this.renderPage();
        this.showFilterNotification(`Objekt på hylla ${shelf}`, this.filteredItems.length);
    },
    
    // Filter items older than a specific year
    filterItemsOlderThan: function(year) {
        this.filteredItems = this.currentItems.filter(item => 
            item.year && item.year < year
        );
        
        this.resetPagination();
        this.renderPage();
        this.showFilterNotification(`Objekt äldre än ${year}`, this.filteredItems.length);
    },
    
    // Apply custom filters
    applyCustomFilters: function() {
        const categories = $('#list-categories').val() || [];
        const genre = $('#list-genre').val();
        const condition = $('#list-condition').val();
        const status = $('#list-status').val();
        const priceMin = parseFloat($('#price-min').val()) || 0;
        const priceMax = parseFloat($('#price-max').val()) || Number.MAX_VALUE;
        const dateMin = $('#date-min').val() ? new Date($('#date-min').val()) : null;
        const dateMax = $('#date-max').val() ? new Date($('#date-max').val()) : null;
        const searchTerm = $('#list-search').val().toLowerCase();
        
        this.filteredItems = this.currentItems.filter(item => {
            // Category filter
            const categoryMatch = !categories || categories.length === 0 || 
                categories.some(cat => item.category && item.category.toLowerCase().includes(cat.toLowerCase()));
            
            // Genre filter
            const genreMatch = !genre || 
                (item.genre && item.genre.toLowerCase().includes(genre.toLowerCase()));
            
            // Condition filter
            const conditionName = typeof item.condition === 'object' 
                ? item.condition.name 
                : item.condition;
            const conditionMatch = !condition || conditionName === condition;
            
            // Status filter
            const statusMatch = status === 'all' || !status || item.status === status;
            
            // Price range
            const price = parseFloat(item.price) || 0;
            const priceMatch = price >= priceMin && price <= priceMax;
            
            // Date range
            let dateMatch = true;
            if (item.date) {
                const itemDate = new Date(item.date);
                if (dateMin && dateMax) {
                    dateMatch = itemDate >= dateMin && itemDate <= dateMax;
                } else if (dateMin) {
                    dateMatch = itemDate >= dateMin;
                } else if (dateMax) {
                    dateMatch = itemDate <= dateMax;
                }
            }
            
            // Search term
            const searchMatch = !searchTerm || 
                (item.title && item.title.toLowerCase().includes(searchTerm)) ||
                (item.author && item.author.toLowerCase().includes(searchTerm)) ||
                (item.notes && item.notes.toLowerCase().includes(searchTerm));
            
            return categoryMatch && genreMatch && conditionMatch && statusMatch && 
                   priceMatch && dateMatch && searchMatch;
        });
        
        this.resetPagination();
        this.renderPage();
        this.showFilterNotification('Anpassat filter', this.filteredItems.length);
    },
    
    // Update the selected items array based on checkboxes
    updateSelectedItems: function() {
        this.selectedIds = [];
        $('input[name="list-item"]:checked').each(function() {
            const id = parseInt($(this).val());
            if (!isNaN(id)) {
                KarisAntikvariat.Filters.selectedIds.push(id);
            }
        });
        
        // Update batch action buttons
        this.updateBatchActionButtons();
    },
    
    // Load items into the table with pagination
    renderPage: function() {
        const $tbody = $('#lists-body');
        $tbody.empty();
        
        // Calculate pagination
        const startIdx = (this.paginationInfo.currentPage - 1) * this.paginationInfo.itemsPerPage;
        const endIdx = Math.min(startIdx + this.paginationInfo.itemsPerPage, this.filteredItems.length);
        
        // Update total pages
        this.paginationInfo.totalPages = Math.max(
            1, 
            Math.ceil(this.filteredItems.length / this.paginationInfo.itemsPerPage)
        );
        
        // If current page is now invalid, adjust it
        if (this.paginationInfo.currentPage > this.paginationInfo.totalPages) {
            this.paginationInfo.currentPage = this.paginationInfo.totalPages;
        }
        
        // Update total count
        $('#total-count').text(this.filteredItems.length);
        
        // Handle empty results
        if (this.filteredItems.length === 0) {
            $tbody.html(`
                <tr>
                    <td colspan="10" class="text-center text-muted py-4">
                        <i class="fas fa-search me-2"></i>
                        Inga objekt hittades med de angivna filtren.
                    </td>
                </tr>
            `);
            return;
        }
        
        // Render visible items
        for (let i = startIdx; i < endIdx; i++) {
            const item = this.filteredItems[i];
            
            // Format condition (can be string or object)
            let condition = item.condition;
            if (typeof condition === 'object') {
                condition = condition.name;
            }
            
            // Format date
            const formattedDate = item.date ? KarisAntikvariat.Utils.formatDate(item.date) : '-';
            
            // Create row HTML
            const row = `
                <tr>
                    <td>
                        <input type="checkbox" name="list-item" value="${item.id}" 
                            ${this.selectedIds.includes(item.id) ? 'checked' : ''}>
                    </td>
                    <td>${item.id}</td>
                    <td>${item.title}</td>
                    <td>${item.author || '-'}</td>
                    <td>${item.category || '-'}</td>
                    <td>${item.shelf || '-'}</td>
                    <td>${condition || '-'}</td>
                    <td>${item.price ? KarisAntikvariat.Utils.formatPrice(item.price) : '-'}</td>
                    <td>
                        <span class="badge ${item.status === 'Tillgänglig' ? 'bg-success' : 
                                          (item.status === 'Såld' ? 'bg-secondary' : 'bg-warning')}">
                            ${item.status}
                        </span>
                    </td>
                    <td>${formattedDate}</td>
                </tr>
            `;
            $tbody.append(row);
        }
        
        // Update pagination display
        this.updatePaginationControls();
    },
    
    // Update price for selected items
    updatePriceForSelectedItems: function() {
        const action = $('input[name="priceAction"]:checked').val();
        const value = parseFloat($('#priceValue').val());
        const specialPrice = $('#markSpecialPrice').is(':checked');
        
        if (isNaN(value)) {
            alert('Vänligen ange ett giltigt värde');
            return;
        }
        
        // Confirm action
        const confirmMessage = `Detta kommer att uppdatera priset för ${this.selectedIds.length} objekt. Är du säker?`;
        if (!confirm(confirmMessage)) {
            return;
        }
        
        let updatedCount = 0;
        
        // Update selected items
        this.currentItems.forEach(item => {
            if (this.selectedIds.includes(item.id)) {
                let newPrice = 0;
                
                switch(action) {
                    case 'set':
                        newPrice = value;
                        break;
                    case 'increase':
                        newPrice = item.price * (1 + value / 100);
                        break;
                    case 'decrease':
                        newPrice = item.price * (1 - value / 100);
                        break;
                }
                
                // Ensure price is valid and at least 0
                item.price = Math.max(0, parseFloat(newPrice.toFixed(2)));
                item.specialPrice = specialPrice;
                
                updatedCount++;
            }
        });
        
        // Update filtered items
        this.filteredItems = this.filteredItems.map(item => {
            if (this.selectedIds.includes(item.id)) {
                const originalItem = this.currentItems.find(original => original.id === item.id);
                return originalItem || item;
            }
            return item;
        });
        
        // Close the modal
        bootstrap.Modal.getInstance($('#updatePriceModal')).hide();
        
        // Show success message
        alert(`Pris uppdaterat för ${updatedCount} objekt`);
        
        // Refresh the table
        this.renderPage();
    },
    
    // Update status for selected items
    updateStatusForSelectedItems: function() {
        const newStatus = $('#newStatus').val();
        const notes = $('#statusNotes').val();
        
        if (!newStatus) {
            alert('Vänligen välj en status');
            return;
        }
        
        // Confirm action
        const confirmMessage = `Detta kommer att ändra status för ${this.selectedIds.length} objekt till "${newStatus}". Är du säker?`;
        if (!confirm(confirmMessage)) {
            return;
        }
        
        let updatedCount = 0;
        
        // Update selected items
        this.currentItems.forEach(item => {
            if (this.selectedIds.includes(item.id)) {
                item.status = newStatus;
                
                // Add to internal notes if provided
                if (notes) {
                    const timestamp = new Date().toLocaleString('sv-SE');
                    const noteText = `[${timestamp}] Status ändrad till "${newStatus}": ${notes}`;
                    item.internalNotes = item.internalNotes 
                        ? item.internalNotes + '\n\n' + noteText
                        : noteText;
                }
                
                updatedCount++;
            }
        });
        
        // Update filtered items
        this.filteredItems = this.filteredItems.map(item => {
            if (this.selectedIds.includes(item.id)) {
                const originalItem = this.currentItems.find(original => original.id === item.id);
                return originalItem || item;
            }
            return item;
        });
        
        // Close the modal
        bootstrap.Modal.getInstance($('#updateStatusModal')).hide();
        
        // Show success message
        alert(`Status uppdaterad för ${updatedCount} objekt`);
        
        // Refresh the table
        this.renderPage();
    },
    
    // Move selected items to a shelf
    moveSelectedItemsToShelf: function() {
        const newShelf = $('#newShelf').val();
        
        if (!newShelf) {
            alert('Vänligen välj en hyllplats');
            return;
        }
        
        // Confirm action
        const confirmMessage = `Detta kommer att flytta ${this.selectedIds.length} objekt till hyllan "${newShelf}". Är du säker?`;
        if (!confirm(confirmMessage)) {
            return;
        }
        
        let updatedCount = 0;
        
        // Update selected items
        this.currentItems.forEach(item => {
            if (this.selectedIds.includes(item.id)) {
                item.shelf = newShelf;
                updatedCount++;
            }
        });
        
        // Update filtered items
        this.filteredItems = this.filteredItems.map(item => {
            if (this.selectedIds.includes(item.id)) {
                const originalItem = this.currentItems.find(original => original.id === item.id);
                return originalItem || item;
            }
            return item;
        });
        
        // Close the modal
        bootstrap.Modal.getInstance($('#moveShelfModal')).hide();
        
        // Show success message
        alert(`${updatedCount} objekt flyttade till hyllan "${newShelf}"`);
        
        // Refresh the table
        this.renderPage();
    },
    
    // Delete selected items
    deleteSelectedItems: function() {
        // Confirm action
        const confirmMessage = `Detta kommer att ta bort ${this.selectedIds.length} objekt permanent. Denna åtgärd kan inte ångras. Är du säker?`;
        if (!confirm(confirmMessage)) {
            return;
        }
        
        // Delete from currentItems
        this.currentItems = this.currentItems.filter(item => !this.selectedIds.includes(item.id));
        
        // Delete from filteredItems
        this.filteredItems = this.filteredItems.filter(item => !this.selectedIds.includes(item.id));
        
        // Update global mockItems
        KarisAntikvariat.mockItems = KarisAntikvariat.mockItems.filter(item => !this.selectedIds.includes(item.id));
        
        // Show success message
        alert(`${this.selectedIds.length} objekt har tagits bort`);
        
        // Clear selection
        this.selectedIds = [];
        
        // Refresh the table
        this.renderPage();
        
        // Update batch action buttons
        this.updateBatchActionButtons();
    },
    
    // Print current list
    printCurrentList: function() {
        // Create print window content
        let content = `
            <html>
            <head>
                <title>Lagerlista - Karis Antikvariat</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    h1 { color: #2e8b57; }
                    .print-date { text-align: right; margin-bottom: 20px; }
                    .print-info { margin-bottom: 20px; }
                </style>
            </head>
            <body>
                <h1>Lagerlista - Karis Antikvariat</h1>
                <div class="print-date">Utskriven: ${new Date().toLocaleDateString('sv-SE')}</div>
                <div class="print-info">
                    <strong>Antal objekt:</strong> ${this.filteredItems.length}
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Titel</th>
                            <th>Författare</th>
                            <th>Kategori</th>
                            <th>Hylla</th>
                            <th>Skick</th>
                            <th>Pris</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        // Add items
        this.filteredItems.forEach(item => {
            // Format condition
            let condition = item.condition;
            if (typeof condition === 'object') {
                condition = condition.name;
            }
            
            content += `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.title}</td>
                    <td>${item.author || '-'}</td>
                    <td>${item.category || '-'}</td>
                    <td>${item.shelf || '-'}</td>
                    <td>${condition || '-'}</td>
                    <td>${item.price ? KarisAntikvariat.Utils.formatPrice(item.price) : '-'}</td>
                    <td>${item.status}</td>
                </tr>
            `;
        });
        
        content += `
                    </tbody>
                </table>
                <script>
                    window.onload = function() {
                        window.print();
                    }
                </script>
            </body>
            </html>
        `;
        
        // Open print window
        const printWindow = window.open('', '_blank');
        printWindow.document.write(content);
        printWindow.document.close();
    },
    
    // Export current list to CSV
    exportListToCSV: function() {
        // Define the fields to export
        const fields = [
            'id', 
            'title', 
            'author', 
            'category', 
            'shelf', 
            'condition', 
            'price', 
            'status',
            'date',
            'notes'
        ];
        
        // Create header row
        let csv = fields.join(',') + '\n';
        
        // Add rows for each item
        this.filteredItems.forEach(item => {
            const row = fields.map(field => {
                let value = item[field];
                
                // Handle special fields
                if (field === 'condition' && typeof value === 'object') {
                    value = value.name;
                } else if (field === 'price' && value) {
                    value = parseFloat(value).toFixed(2);
                }
                
                // Properly escape values for CSV
                if (typeof value === 'string') {
                    // Escape quotes by doubling them and wrap in quotes
                    return '"' + value.replace(/"/g, '""') + '"';
                } else if (value === undefined || value === null) {
                    return '';
                } else {
                    return value;
                }
            });
            
            csv += row.join(',') + '\n';
        });
        
        // Create a blob and download link
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.setAttribute('href', url);
        link.setAttribute('download', `karis-antikvariat-lista-${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        
        // Download the file
        link.click();
        
        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
};

// Initialize when DOM is ready
$(document).ready(function() {
    // Initialize the Lists & Filters module when on inventory page and lists tab is active
    $('#lists-tab').on('click', function() {
        // Initialize on demand when tab is activated
        KarisAntikvariat.Filters.init();
    });
    
    // Also initialize if we directly navigate to the Lists tab via URL fragment
    if (window.location.hash === '#lists') {
        KarisAntikvariat.Filters.init();
    }
});