// Karis Antikvariat - Admin Interface
const KarisAntikvariat = window.KarisAntikvariat || {};

KarisAntikvariat.Admin = {
    // Authentication state
    authenticated: false,
    currentUser: null,
    
    // Cache for database reference items
    categories: [],
    shelves: [],
    genres: [],
    conditions: [],
    statusTypes: [],

    // Initialize admin interface
    init: function() {
        // Initialize tabs
        this.initializeTabs();
        
        // Set up event handlers
        this.setupEventHandlers();
        
        // Load database references
        this.loadDatabaseReferences();
        
        // Initial load of inventory items
        this.loadInventoryItems(KarisAntikvariat.mockItems);
        
        // Load lists items
        this.loadListsItems(KarisAntikvariat.mockItems);
    },

    // Initialize Bootstrap tabs
    initializeTabs: function() {
        const triggerTabList = [].slice.call(document.querySelectorAll('#inventory-tabs a'));
        triggerTabList.forEach(function (triggerEl) {
            const tabTrigger = new bootstrap.Tab(triggerEl);
            triggerEl.addEventListener('click', function (event) {
                event.preventDefault();
                tabTrigger.show();
            });
        });
    },

    // Set up all event handlers
    setupEventHandlers: function() {
        const self = this;
        
        // Inventory Search
        $('#search-btn').click(this.searchItems.bind(this));
        
        // Search on Enter key
        $('#search-term').keypress(function(e) {
            if (e.which === 13) {
                self.searchItems();
            }
        });
        
        // Clear Form Button
        $('#clear-form-btn').click(this.clearAddItemForm.bind(this));
        
        // Add Item Form Submission
        $('#add-item-form').submit(this.addNewItem.bind(this));
        
        // Select All Checkbox
        $('#select-all').change(this.toggleSelectAll);
        
        // Print List Button
        $('#print-list-btn').click(this.handlePrintList.bind(this));
        
        // Load Reference Data
        $('#categories-list, #shelves-list, #genres-list, #conditions-list').on('click', '.edit-btn', function() {
            const id = $(this).data('id');
            const type = $(this).data('type');
            self.editDatabaseItem(type, id);
        }).on('click', '.delete-btn', function() {
            const id = $(this).data('id');  
            const type = $(this).data('type');
            self.deleteDatabaseItem(type, id);
        });
        
        $('#add-category-btn').click(function() {
            self.addDatabaseItem('category');  
        });
        
        $('#add-shelf-btn').click(function() {
            self.addDatabaseItem('shelf');
        });
        
        $('#add-genre-btn').click(function() {
            self.addDatabaseItem('genre');
        });
        
        $('#add-condition-btn').click(function() {
           self.addDatabaseItem('condition'); 
        });
    },

    // Load inventory items into table
    loadInventoryItems: function(items) {
        const $tbody = $('#inventory-body');
        $tbody.empty();
        
        if (!items || items.length === 0) {
            $tbody.html('<tr><td colspan="8" class="text-center text-muted py-3">Inga objekt hittades.</td></tr>');
            return;
        }
        
        items.forEach(item => {
            const statusClass = item.status === 'Tillgänglig' ? 'status-available' : 'status-sold';
            const sellBtnDisabled = item.status !== 'Tillgänglig' ? 'disabled' : '';
            
            // Changed the buttons to use data-id attributes instead of inline onclick
            const row = `
                <tr class="clickable-row">
                    <td>${item.id}</td>
                    <td>${item.title}</td>
                    <td>${item.author || '-'}</td>
                    <td>${item.category}${item.shelf ? ' - ' + item.shelf : ''}</td>
                    <td>${item.shelf || '-'}</td>
                    <td>${KarisAntikvariat.Core.formatCurrency(item.price)}</td>
                    <td><span class="status-badge ${statusClass}">${item.status}</span></td>
                    <td>
                        <div class="btn-group btn-group-sm">
                            <button class="btn sell-btn action-btn ${sellBtnDisabled}" data-id="${item.id}" ${sellBtnDisabled}>Sälj</button>
                            <button class="btn btn-outline-danger action-btn delete-btn" data-id="${item.id}">Ta bort</button>
                        </div>
                    </td>
                </tr>
            `;
            $tbody.append(row);
        });
        
        // Add event handling for buttons
        $('.edit-btn').click(function(e) {
            e.stopPropagation(); // Prevent row click
            const itemId = $(this).data('id');
            KarisAntikvariat.Admin.editItem(itemId);
        });
        
        $('.sell-btn:not(.disabled)').click(function(e) {
            e.stopPropagation(); // Prevent row click
            const itemId = $(this).data('id');
            KarisAntikvariat.Admin.sellItem(itemId);
        });
        
        $('.delete-btn').click(function(e) {
            e.stopPropagation(); // Prevent row click
            const itemId = $(this).data('id');
            KarisAntikvariat.Admin.deleteItem(itemId);
        });
        
        // Add row click event
        $('.clickable-row').click(function() {
            const itemId = $(this).find('td:first').text(); // Get ID from first column
            window.location.href = `item-admin.html?id=${itemId}`;
        });
    },

    // Load items into lists table
    loadListsItems: function(items) {
        const $tbody = $('#lists-body');  
        $tbody.empty();
        
        if (!items || items.length === 0) {
            $tbody.html('<tr><td colspan="8" class="text-center text-muted py-3">Inga objekt hittades.</td></tr>');
            return;
        }
        
        items.forEach(item => {
            const row = `
                <tr>
                    <td><input type="checkbox" name="list-item" value="${item.id}"></td>
                    <td>${item.id}</td>
                    <td>${item.title}</td>
                    <td>${item.author || '-'}</td>
                    <td>${item.category}${item.shelf ? ' - ' + item.shelf : ''}</td>
                    <td>${KarisAntikvariat.Core.formatCurrency(item.price)}</td>  
                    <td>${KarisAntikvariat.Core.parseDate(item.date)}</td>
                    <td>
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-secondary action-btn" onclick="KarisAntikvariat.Admin.viewItem(${item.id})">Visa</button>
                            <button class="btn btn-outline-danger action-btn" onclick="KarisAntikvariat.Admin.deleteItem(${item.id})">Ta bort</button>  
                        </div>
                    </td>
                </tr>
            `;
            $tbody.append(row);
        });
    },
    
    // Load database references
    loadDatabaseReferences: function() {
        this.categories = KarisAntikvariat.Categories || [];
        this.shelves = KarisAntikvariat.Shelves || [];  
        this.genres = KarisAntikvariat.Genres || [];
        this.conditions = KarisAntikvariat.Conditions || [];
        this.statusTypes = KarisAntikvariat.StatusTypes || [];
        
        this.loadCategories();
        this.loadShelves();
        this.loadGenres(); 
        this.loadConditions();
    },
       
    // Load categories into reference table 
    loadCategories: function() {
        const $tbody = $('#categories-list');
        $tbody.empty();
        
        this.categories.forEach(category => {
            const row = `
                <tr>
                    <td>${category.id}</td>
                    <td>${category.name}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary me-1 edit-btn" data-id="${category.id}" data-type="category">Redigera</button>
                        <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${category.id}" data-type="category">Ta bort</button>
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
        
        this.shelves.forEach(shelf => {
            const row = `
                <tr>  
                    <td>${shelf.id}</td>
                    <td>${shelf.name}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary me-1 edit-btn" data-id="${shelf.id}" data-type="shelf">Redigera</button>
                        <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${shelf.id}" data-type="shelf">Ta bort</button>  
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
        
        this.genres.forEach(genre => {
            const row = ` 
                <tr>
                    <td>${genre.id}</td>
                    <td>${genre.name}</td>  
                    <td>
                        <button class="btn btn-sm btn-outline-primary me-1 edit-btn" data-id="${genre.id}" data-type="genre">Redigera</button>
                        <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${genre.id}" data-type="genre">Ta bort</button>
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

        this.conditions.forEach(condition => {
            const row = `
                <tr>  
                    <td>${condition.id}</td>
                    <td>${condition.name} (${condition.code})</td>
                    <td>  
                        <button class="btn btn-sm btn-outline-primary me-1 edit-btn" data-id="${condition.id}" data-type="condition">Redigera</button>
                        <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${condition.id}" data-type="condition">Ta bort</button>
                    </td>
                </tr>  
            `;
            $tbody.append(row);
        }); 
    },

    // ...rest of admin functions remain...
};


// Function to update the image preview based on selected category
function updateNewItemImagePreview() {
    const category = $("#item-category").val();
    if (category) {
        let imageSrc = "img/src-book.webp"; // Default image
        
        // Determine image based on category
        if (category.toLowerCase().includes("bok")) {
            imageSrc = "img/src-book.webp";
        } else if (category.toLowerCase().includes("cd")) {
            imageSrc = "img/src-cd.webp";
        } else if (category.toLowerCase().includes("vinyl")) {
            imageSrc = "img/src-music.webp";
        } else if (category.toLowerCase().includes("serier")) {
            imageSrc = "img/src-magazine.webp";
        } else if (category.toLowerCase().includes("dvd")) {
            imageSrc = "img/src-cd.webp";
        }
        
        $("#new-item-image").attr("src", imageSrc);
    }
}

// Enhanced submit handler for the add item form
function enhanceAddItemForm() {
    // Update image preview when category changes
    $("#item-category").change(updateNewItemImagePreview);
    
    // Handle form submission
    $("#add-item-form").submit(function(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = {
            title: $("#item-title").val(),
            status: $("#item-status").val(),
            authorFirstName: $("#author-first").val(),
            authorLastName: $("#author-last").val(),
            author: combineAuthorName($("#author-first").val(), $("#author-last").val()),
            category: $("#item-category").val(),
            genre: $("#item-genre").val() || "",
            price: parseFloat($("#item-price").val()) || 0,
            condition: $("#item-condition").val() || "",
            shelf: $("#item-shelf").val() || "",
            language: $("#item-language").val() || "",
            year: parseInt($("#item-year").val()) || null,
            publisher: $("#item-publisher").val() || "",
            notes: $("#item-notes").val() || "",
            internalNotes: $("#item-internal-notes").val() || "",
            specialPrice: $("#item-special-price").is(":checked"),
            rare: $("#item-rare").is(":checked"),
            date: new Date().toISOString().split('T')[0] // Today's date
        };
        
        // Validate form data
        const validation = KarisAntikvariat.Core.validateItemForm(formData);
        
        if (!validation.isValid) {
            // Show validation errors
            alert("Formuläret innehåller fel:\n" + validation.errors.join("\n"));
            return;
        }
        
        // Generate a unique ID for the new item
        const newId = KarisAntikvariat.Core.generateUniqueId(KarisAntikvariat.mockItems);
        
        // Create the new item
        const newItem = {
            id: newId,
            title: formData.title,
            author: formData.author,
            category: formData.category.split(' - ')[0], // Take only main category
            shelf: formData.shelf || (formData.category.includes(' - ') ? formData.category.split(' - ')[1] : ""),
            genre: formData.genre,
            condition: formData.condition,
            price: formData.price,
            status: formData.status,
            notes: formData.notes,
            internalNotes: formData.internalNotes,
            date: formData.date,
            specialPrice: formData.specialPrice,
            rare: formData.rare,
            language: formData.language,
            year: formData.year,
            publisher: formData.publisher
        };
        
        // Add the new item to the mockItems array
        KarisAntikvariat.mockItems.push(newItem);
        
        // Show success message
        alert(`Objekt '${newItem.title}' har lagts till i lagret med ID ${newId}`);
        
        // Clear the form
        clearAddItemForm();
        
        // Switch to search tab and show the newly added item
        const searchTab = document.querySelector('#search-tab');
        bootstrap.Tab.getInstance(searchTab).show();
        
        // Update search term to show the new item
        $("#search-term").val(newItem.title);
        KarisAntikvariat.Admin.searchItems();
    });
    
    // Handle clear form button
    $("#clear-form-btn").click(function() {
        clearAddItemForm();
    });
    
    // Initialize with default image
    updateNewItemImagePreview();
}

// Helper function to combine author first and last name
function combineAuthorName(firstName, lastName) {
    firstName = (firstName || "").trim();
    lastName = (lastName || "").trim();
    
    if (firstName && lastName) {
        return firstName + " " + lastName;
    } else if (firstName) {
        return firstName;
    } else if (lastName) {
        return lastName;
    }
    return "";
}

// Function to clear the add item form
function clearAddItemForm() {
    $("#add-item-form")[0].reset();
    $("#new-item-image").attr("src", "img/src-book.webp");
}



// Initialize when DOM is ready  
$(document).ready(function() {
    KarisAntikvariat.Admin.init();  
    enhanceAddItemForm();
});

