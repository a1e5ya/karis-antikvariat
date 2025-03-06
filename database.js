/**
 * Karis Antikvariat - Database References
 * This file contains centralized reference data and management functions for the inventory system
 */

// Use the pre-existing global namespace
window.KarisAntikvariat = window.KarisAntikvariat || {};

// Reference Data
KarisAntikvariat.Categories = [
    { id: 1, name: "Bok"},
    { id: 5, name: "CD"},
    { id: 6, name: "Vinyl"},
    { id: 7, name: "DVD"},
    { id: 8, name: "Serier" },
    { id: 9, name: "Samlarobjekt"}
];

KarisAntikvariat.Shelves = [
    { id: 1, name: "Finlandssvenska" },
    { id: 3, name: "Lokalhistoria" },
    { id: 4, name: "Sjöfart" },
    { id: 5, name: "Barn/Ungdom" },
    { id: 6, name: "Musik" },
    { id: 7, name: "Film" }
];

KarisAntikvariat.Genres = [
    { id: 1, name: "Romaner"},
    { id: 3, name: "Historia"},
    { id: 4, name: "Dikter" },
    { id: 5, name: "Biografi" },
    { id: 6, name: "Barnböcker" },
    { id: 7, name: "Rock" },
    { id: 8, name: "Jazz" },
    { id: 9, name: "Klassisk" },
    { id: 10, name: "Äventyr" }
];

KarisAntikvariat.Conditions = [
    { id: 1, name: "Nyskick", code: "K-1", description: "Like new, no visible wear" },
    { id: 2, name: "Mycket bra", code: "K-2", description: "Very good, minimal signs of use" },
    { id: 3, name: "Bra", code: "K-3", description: "Good condition, some signs of wear" },
    { id: 4, name: "Acceptabelt", code: "K-4", description: "Acceptable, significant wear but functional" }
];

KarisAntikvariat.Languages = [
    { id: 1, code: "sv", name: "Svenska" },
    { id: 2, code: "fi", name: "Suomi" },
    { id: 3, code: "en", name: "English" }
];

KarisAntikvariat.StatusTypes = [
    { id: 1, name: "Tillgänglig" },
    { id: 2, name: "Såld" },
    { id: 3, name: "Reserverad" }
];

// Database Management Module
KarisAntikvariat.DatabaseManager = {
    // Load database reference data into UI
    loadDatabaseReferences: function() {
        this.loadCategories();
        this.loadShelves();
        this.loadGenres();
        this.loadConditions();
        
        this.setupDatabaseEvents();
    },
    // Get all categories as simple array
getAllCategories: function() {
    return KarisAntikvariat.Categories.map(cat => cat.name);
},

// Get all shelves as simple array
getAllShelves: function() {
    return KarisAntikvariat.Shelves.map(shelf => shelf.name);
},

// Get all genres as simple array
getAllGenres: function() {
    return KarisAntikvariat.Genres.map(genre => genre.name);
},

// Get all conditions as simple array
getAllConditions: function() {
    return KarisAntikvariat.Conditions.map(condition => condition.name);
},

// Get all status types as simple array
getAllStatusTypes: function() {
    return KarisAntikvariat.StatusTypes.map(status => status.name);
},

// Format item condition for display
formatCondition: function(condition) {
    if (!condition) return '-';
    
    if (typeof condition === 'object') {
        return condition.name + (condition.code ? ` (${condition.code})` : '');
    }
    
    return condition;
},

// Get condition by name or code
getConditionByNameOrCode: function(nameOrCode) {
    if (!nameOrCode) return null;
    
    return KarisAntikvariat.Conditions.find(condition => 
        condition.name === nameOrCode || condition.code === nameOrCode
    );
},
    

// Set up event handlers for database management
setupDatabaseEvents: function() {
    const self = this;
    
    // Database item edit and delete buttons (using event delegation)
    $('#categories-list, #shelves-list, #genres-list').on('click', '.edit-btn', function(e) {
        e.preventDefault(); // Prevent any default action
        e.stopPropagation(); // Stop event bubbling
        const id = $(this).data('id');
        const type = $(this).data('type');
        self.editDatabaseItem(type, id);
    }).on('click', '.delete-btn', function(e) {
        e.preventDefault(); // Prevent any default action
        e.stopPropagation(); // Stop event bubbling
        const id = $(this).data('id');  
        const type = $(this).data('type');
        self.deleteDatabaseItem(type, id);
    });
    
    // Add item buttons
    $('#add-category-btn').click(function() {
        self.addDatabaseItem('category');  
    });
    
    $('#add-shelf-btn').click(function() {
        self.addDatabaseItem('shelf');
    });
    
    $('#add-genre-btn').click(function() {
        self.addDatabaseItem('genre');
    });
},
    
    // Load categories into reference table 
    loadCategories: function() {
        const $tbody = $('#categories-list');
        $tbody.empty();
        
        KarisAntikvariat.Categories.forEach(category => {
            const row = `
                <tr>
                    <td>${category.id}</td>
                    <td>${category.name}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary me-1"  data-type="category">Redigera</button>
                        <button class="btn btn-sm btn-outline-danger" data-id="${category.id}" data-type="category">Ta bort</button>
                    </td>
                </tr>
            `;
            $tbody.append(row);
        });
    },
    
    // Load shelves into reference table
    loadShelves: function() {  
        const $tbody = $('#shelves-list');
        $tbody.empty();
        
        KarisAntikvariat.Shelves.forEach(shelf => {
            const row = `
                <tr>  
                    <td>${shelf.id}</td>
                    <td>${shelf.name}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary me-1" data-id="${shelf.id}" data-type="shelf">Redigera</button>
                        <button class="btn btn-sm btn-outline-danger" data-id="${shelf.id}" data-type="shelf">Ta bort</button>  
                    </td>
                </tr>
            `;
            $tbody.append(row);
        });
    },
    
    // Load genres into reference table
    loadGenres: function() {
        const $tbody = $('#genres-list');  
        $tbody.empty();
        
        KarisAntikvariat.Genres.forEach(genre => {
            const row = ` 
                <tr>
                    <td>${genre.id}</td>
                    <td>${genre.name}</td>  
                    <td>
                        <button class="btn btn-sm btn-outline-primary me-1" data-id="${genre.id}" data-type="genre">Redigera</button>
                        <button class="btn btn-sm btn-outline-danger" data-id="${genre.id}" data-type="genre">Ta bort</button>
                    </td>
                </tr>
            `;
            $tbody.append(row);  
        });
    },
    
    // Load conditions into reference table
    loadConditions: function() {
        const $tbody = $('#conditions-list');
        $tbody.empty();  

        KarisAntikvariat.Conditions.forEach(condition => {
            const row = `
                <tr>  
                    <td>${condition.id}</td>
                    <td>${condition.name} (${condition.code})</td>
                    <td>  
                        <button class="btn btn-sm btn-outline-primary me-1" data-id="${condition.id}" data-type="condition">Redigera</button>
                        <button class="btn btn-sm btn-outline-danger" data-id="${condition.id}" data-type="condition">Ta bort</button>
                    </td>
                </tr>  
            `;
            $tbody.append(row);
        }); 
    },
    
    // Add a new database item
    addDatabaseItem: function(type) {
        let inputId, collection, loadFunction;
        
        // Set up variables based on item type
        switch(type) {
            case 'category':
                inputId = '#new-category';
                collection = KarisAntikvariat.Categories;
                loadFunction = this.loadCategories;
                break;
            case 'shelf':
                inputId = '#new-shelf';
                collection = KarisAntikvariat.Shelves;
                loadFunction = this.loadShelves;
                break;
            case 'genre':
                inputId = '#new-genre';
                collection = KarisAntikvariat.Genres;
                loadFunction = this.loadGenres;
                break;
            default:
                return;
        }
        
        // Get input value
        const $input = $(inputId);
        const name = $input.val().trim();
        
        // Validate
        if (!name) {
            alert('Fältet får inte vara tomt!');
            return;
        }
        
        // Check for duplicates
        if (collection.some(item => item.name.toLowerCase() === name.toLowerCase())) {
            alert('Detta namn finns redan!');
            return;
        }
        
        // Generate new ID
        const newId = collection.length > 0 ? Math.max(...collection.map(item => item.id)) + 1 : 1;
        
        // Create new item
        const newItem = { id: newId, name: name };
        
        // Add code if it's a condition
        if (type === 'condition') {
            newItem.code = 'K-' + newId;
            newItem.description = ''; // Empty description for new condition
        }
        
        // Add to collection
        collection.push(newItem);
        
        // Reload the list
        loadFunction.call(this);
        
        // Clear input
        $input.val('');
        
        // Update any UI dropdowns that reference this collection
        this.updateDropdowns(type);
    },
    
// Edit a database item in-place
editDatabaseItem: function(type, id) {
    let collection, $row;
    
    // Set up variables based on item type
    switch(type) {
        case 'category':
            collection = KarisAntikvariat.Categories;
            $row = $('#categories-list tr').filter(function() {
                return $(this).find('.edit-btn').data('id') == id;
            });
            break;
        case 'shelf':
            collection = KarisAntikvariat.Shelves;
            $row = $('#shelves-list tr').filter(function() {
                return $(this).find('.edit-btn').data('id') == id;
            });
            break;
        case 'genre':
            collection = KarisAntikvariat.Genres;
            $row = $('#genres-list tr').filter(function() {
                return $(this).find('.edit-btn').data('id') == id;
            });
            break;
        default:
            return;
    }
    
    // Find the item to edit
    const item = collection.find(item => item.id === parseInt(id));
    if (!item || $row.length === 0) {
        alert('Objektet hittades inte!');
        return;
    }
    
    // Check if we're already editing
    if ($row.hasClass('editing')) {
        // We're saving - get the new value
        const newName = $row.find('input.edit-field').val().trim();
        
        // Validate
        if (!newName) {
            alert('Fältet får inte vara tomt!');
            return;
        }
        
        // Check for duplicates
        if (collection.some(i => i.id !== item.id && i.name.toLowerCase() === newName.toLowerCase())) {
            alert('Detta namn finns redan!');
            return;
        }
        
        // Update name
        item.name = newName;
        
        // Reset the row
        const nameCell = $row.find('td:nth-child(2)');
        nameCell.html(item.name);
        
        // Change button back to "Redigera"
        const $button = $row.find('.edit-btn');
        $button.removeClass('btn-success').addClass('btn-outline-primary');
        $button.text('Redigera');
        
        // Remove editing class
        $row.removeClass('editing');
        
        // Update any UI dropdowns that reference this collection
        this.updateDropdowns(type);
    } else {
        // We're starting to edit - convert to input field
        const nameCell = $row.find('td:nth-child(2)');
        const currentName = item.name;
        nameCell.html(`<input type="text" class="form-control edit-field" value="${currentName}">`);
        
        // Focus the input field
        nameCell.find('input').focus();
        
        // Change button to "Spara"
        const $button = $row.find('.edit-btn');
        $button.removeClass('btn-outline-primary').addClass('btn-success');
        $button.text('Spara');
        
        // Add editing class
        $row.addClass('editing');
    }
},
    
    // Delete a database item
    deleteDatabaseItem: function(type, id) {
        let collection, loadFunction, mockItems = KarisAntikvariat.mockItems;
        
        // Set up variables based on item type
        switch(type) {
            case 'category':
                collection = KarisAntikvariat.Categories;
                loadFunction = this.loadCategories;
                
                // Check if category is in use
                if (mockItems.some(item => item.category && item.category.includes(collection.find(c => c.id === parseInt(id))?.name))) {
                    alert('Denna kategori används av objekt i lagret och kan inte tas bort!');
                    return;
                }
                break;
            case 'shelf':
                collection = KarisAntikvariat.Shelves;
                loadFunction = this.loadShelves;
                
                // Check if shelf is in use
                if (mockItems.some(item => item.shelf === collection.find(s => s.id === parseInt(id))?.name)) {
                    alert('Denna hyllplats används av objekt i lagret och kan inte tas bort!');
                    return;
                }
                break;
            case 'genre':
                collection = KarisAntikvariat.Genres;
                loadFunction = this.loadGenres;
                
                // Check if genre is in use
                if (mockItems.some(item => item.genre === collection.find(g => g.id === parseInt(id))?.name)) {
                    alert('Denna genre används av objekt i lagret och kan inte tas bort!');
                    return;
                }
                break;
            case 'condition':
                collection = KarisAntikvariat.Conditions;
                loadFunction = this.loadConditions;
                
                // Check if condition is in use
                if (mockItems.some(item => 
                    (typeof item.condition === 'string' && item.condition === collection.find(c => c.id === parseInt(id))?.name) ||
                    (typeof item.condition === 'object' && item.condition.name === collection.find(c => c.id === parseInt(id))?.name)
                )) {
                    alert('Detta skick används av objekt i lagret och kan inte tas bort!');
                    return;
                }
                break;
            default:
                return;
        }
        
        // Confirm before deletion
        if (!confirm('Är du säker på att du vill ta bort detta ' + this.getTypeName(type) + '?')) {
            return;
        }
        
        // Find item index
        const index = collection.findIndex(item => item.id === parseInt(id));
        if (index === -1) {
            alert('Objektet hittades inte!');
            return;
        }
        
        // Remove from collection
        collection.splice(index, 1);
        
        // Reload the list
        loadFunction.call(this);
        
        // Update any UI dropdowns that reference this collection
        this.updateDropdowns(type);
    },
    
    // Update dropdown menus that reference the collection
    updateDropdowns: function(type) {
        switch(type) {
            case 'category':
                this.updateCategoryDropdowns();
                break;
            case 'shelf':
                this.updateShelfDropdowns();
                break;
            case 'genre':
                this.updateGenreDropdowns();
                break;
            case 'condition':
                this.updateConditionDropdowns();
                break;
        }
    },
    
    // Update category dropdowns throughout the application
    updateCategoryDropdowns: function() {
        const categories = KarisAntikvariat.Categories;
        const $dropdowns = $('#item-category, #edit-category');
        
        // Save current selected value
        const currentValues = {};
        $dropdowns.each(function() {
            currentValues[this.id] = $(this).val();
        });
        
        // Clear dropdowns
        $dropdowns.empty();
        
        // Add default option
        $dropdowns.append('<option value="">Välj kategori</option>');
        
        // Add options for each category
        categories.forEach(category => {
            $dropdowns.append(`<option value="${category.name}">${category.name}</option>`);
        });
        
        // Restore selected values
        $dropdowns.each(function() {
            if (currentValues[this.id]) {
                $(this).val(currentValues[this.id]);
            }
        });
    },
    
    // Update shelf dropdowns throughout the application
    updateShelfDropdowns: function() {
        const shelves = KarisAntikvariat.Shelves;
        const $dropdowns = $('#item-shelf, #edit-shelf');
        
        // Save current selected value
        const currentValues = {};
        $dropdowns.each(function() {
            currentValues[this.id] = $(this).val();
        });
        
        // Clear dropdowns
        $dropdowns.empty();
        
        // Add default option
        $dropdowns.append('<option value="">Välj hylla</option>');
        
        // Add options for each shelf
        shelves.forEach(shelf => {
            $dropdowns.append(`<option value="${shelf.name}">${shelf.name}</option>`);
        });
        
        // Restore selected values
        $dropdowns.each(function() {
            if (currentValues[this.id]) {
                $(this).val(currentValues[this.id]);
            }
        });
    },
    
    // Update genre dropdowns throughout the application
    updateGenreDropdowns: function() {
        const genres = KarisAntikvariat.Genres;
        const $dropdowns = $('#item-genre, #edit-genre');
        
        // Save current selected value
        const currentValues = {};
        $dropdowns.each(function() {
            currentValues[this.id] = $(this).val();
        });
        
        // Clear dropdowns
        $dropdowns.empty();
        
        // Add default option
        $dropdowns.append('<option value="">Välj genre</option>');
        
        // Add options for each genre
        genres.forEach(genre => {
            $dropdowns.append(`<option value="${genre.name}">${genre.name}</option>`);
        });
        
        // Restore selected values
        $dropdowns.each(function() {
            if (currentValues[this.id]) {
                $(this).val(currentValues[this.id]);
            }
        });
    },
    
    // Update condition dropdowns throughout the application
    updateConditionDropdowns: function() {
        const conditions = KarisAntikvariat.Conditions;
        const $dropdowns = $('#item-condition, #edit-condition');
        
        // Save current selected value
        const currentValues = {};
        $dropdowns.each(function() {
            currentValues[this.id] = $(this).val();
        });
        
        // Clear dropdowns
        $dropdowns.empty();
        
        // Add default option
        $dropdowns.append('<option value="">Välj skick</option>');
        
        // Add options for each condition
        conditions.forEach(condition => {
            $dropdowns.append(`<option value="${condition.name}">${condition.name} (${condition.code})</option>`);
        });
        
        // Restore selected values
        $dropdowns.each(function() {
            if (currentValues[this.id]) {
                $(this).val(currentValues[this.id]);
            }
        });
    },
    
    // Helper function to get type name in Swedish
    getTypeName: function(type) {
        switch(type) {
            case 'category':
                return 'kategori';
            case 'shelf':
                return 'hyllplats';
            case 'genre':
                return 'genre';
            case 'condition':
                return 'skick';
            default:
                return 'objekt';
        }
    }
};

// Original utility functions for lookups
KarisAntikvariat.Utils = KarisAntikvariat.Utils || {};

// Generic lookup function
KarisAntikvariat.Utils.findByName = function(collection, name) {
    return collection.find(item => item.name === name);
};

// Specific lookup methods
KarisAntikvariat.Utils.getCategoryByName = function(name) {
    return this.findByName(KarisAntikvariat.Categories, name);
};

KarisAntikvariat.Utils.getShelfByName = function(name) {
    return this.findByName(KarisAntikvariat.Shelves, name);
};

KarisAntikvariat.Utils.getGenreByName = function(name) {
    return this.findByName(KarisAntikvariat.Genres, name);
};

KarisAntikvariat.Utils.getConditionByName = function(name) {
    return this.findByName(KarisAntikvariat.Conditions, name);
};

KarisAntikvariat.Utils.getStatusByName = function(name) {
    return this.findByName(KarisAntikvariat.StatusTypes, name);
};

// Utility for formatting prices
KarisAntikvariat.Utils.formatPrice = function(price) {
    return '€' + parseFloat(price).toFixed(2);
};

// Utility for formatting dates
KarisAntikvariat.Utils.formatDate = function(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('sv-SE');
    } catch (error) {
        console.error('Error formatting date:', error);
        return '';
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KarisAntikvariat;
}