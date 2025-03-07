/**
 * Karis Antikvariat - Item Management Functions
 * This file contains functions for both item-admin.html and the Add Item tab
 */

// Add items to the namespace without redeclaring it
window.KarisAntikvariat = window.KarisAntikvariat || {};

// Item Admin Module
window.KarisAntikvariat.ItemAdmin = {
    // Current item being edited
    currentItem: null,
    
    // Initialize Item Admin page
    init: function() {
        console.log("Initializing ItemAdmin module");
        
        // Populate all dropdown menus from database
        this.populateDropdowns();
        
        // Get item ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const itemId = parseInt(urlParams.get('id'));
        
        // Load item details for editing
        if (!isNaN(itemId)) {
            this.loadItemDetails(itemId);
        } else {
        
            window.location.href = 'inventory.html';
            return;
        }
        
        // Setup event handlers
        this.setupEventHandlers();
    },
    
    // Populate all dropdown menus from database references
    populateDropdowns: function() {
        this.populateCategoryDropdown();
        this.populateGenreDropdown();
        this.populateConditionDropdown();
        this.populateShelfDropdown();
        this.populateStatusDropdown();
        this.populateLanguageDropdown();
    },
    
    // Populate category dropdown
    populateCategoryDropdown: function() {
        const $dropdown = $('#edit-category');
        
        // Clear dropdown
        $dropdown.empty();
        
        // Add default option
        $dropdown.append('<option value="">Välj kategori</option>');
        
        // Add options for each category with shelves
        if (KarisAntikvariat.Categories && KarisAntikvariat.Categories.length) {
            KarisAntikvariat.Categories.forEach(category => {

                    $dropdown.append(`<option value="${category.name}">${category.name}</option>`);

            });
        } else {
            console.warn("Categories not found in database");
        }
    },
    
    // Populate genre dropdown
    populateGenreDropdown: function() {
        const $dropdown = $('#edit-genre');
        
        // Clear dropdown
        $dropdown.empty();
        
        // Add default option
        $dropdown.append('<option value="">Välj genre</option>');
        
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
        const $dropdown = $('#edit-condition');
        
        // Clear dropdown
        $dropdown.empty();
        
        // Add default option
        $dropdown.append('<option value="">Välj skick</option>');
        
        // Add options for each condition
        if (KarisAntikvariat.Conditions && KarisAntikvariat.Conditions.length) {
            KarisAntikvariat.Conditions.forEach(condition => {
                $dropdown.append(`<option value="${condition.name}">${condition.name} (${condition.code})</option>`);
            });
        } else {
            console.warn("Conditions not found in database");
        }
    },
    
    // Populate shelf dropdown
    populateShelfDropdown: function() {
        const $dropdown = $('#edit-shelf');
        
        // Clear dropdown
        $dropdown.empty();
        
        // Add default option
        $dropdown.append('<option value="">Välj hylla</option>');
        
        // Add options for each shelf
        if (KarisAntikvariat.Shelves && KarisAntikvariat.Shelves.length) {
            KarisAntikvariat.Shelves.forEach(shelf => {
                $dropdown.append(`<option value="${shelf.name}">${shelf.name}</option>`);
            });
        } else {
            console.warn("Shelves not found in database");
        }
    },
    
    // Populate status dropdown
    populateStatusDropdown: function() {
        const $dropdown = $('#edit-status');
        
        // Clear dropdown
        $dropdown.empty();
        
        // Add options for each status
        if (KarisAntikvariat.StatusTypes && KarisAntikvariat.StatusTypes.length) {
            KarisAntikvariat.StatusTypes.forEach(status => {
                $dropdown.append(`<option value="${status.name}">${status.name}</option>`);
            });
        } else {
            console.warn("Status types not found in database");
        }
    },
    
    // Populate language dropdown
    populateLanguageDropdown: function() {
        const $dropdown = $('#edit-language');
        
        // Clear dropdown
        $dropdown.empty();
        
        // Add default option
        $dropdown.append('<option value="">Välj språk</option>');
        
        // Add options for each language
        if (KarisAntikvariat.Languages && KarisAntikvariat.Languages.length) {
            KarisAntikvariat.Languages.forEach(language => {
                $dropdown.append(`<option value="${language.name}">${language.name}</option>`);
            });
        } else {
            // Fallback options if languages not defined
            const languages = [
                { name: "Svenska" },
                { name: "Finska" },
                { name: "Engelska" },
                { name: "Svenska/Engelska" }
            ];
            
            languages.forEach(language => {
                $dropdown.append(`<option value="${language.name}">${language.name}</option>`);
            });
        }
    },
    
    // Load item details for editing
    loadItemDetails: function(itemId) {
        // Find the item in mock data
        const item = KarisAntikvariat.mockItems.find(item => item.id === itemId);
        
        // Store current item
        this.currentItem = item;
        
        // Handle item not found
        if (!item) {
            alert('Objektet hittades inte');
            window.location.href = 'inventory.html';
            return;
        }
        
        // Set document title
        document.title = `Redigera: ${item.title} - Karis Antikvariat`;
        
        // Get and set the appropriate image based on category
        const imageSrc = this.getCategoryImage(item.category);
        $('#item-image').attr('src', imageSrc).attr('alt', item.title);
        
        // Split author name
        let authorFirst = '';
        let authorLast = '';
        if (item.author) {
            const authorParts = item.author.split(' ');
            if (authorParts.length > 1) {
                authorLast = authorParts.pop();
                authorFirst = authorParts.join(' ');
            } else {
                authorLast = item.author;
            }
        }
        
        // Format category and shelf
        let categoryValue = item.category;
        if (item.shelf) {
            categoryValue = `${item.category} - ${item.shelf}`;
        }
        
        // Populate form fields
        $('#item-id').val(item.id);
        $('#edit-title').val(item.title);
        $('#edit-status').val(item.status);
        $('#edit-author-first').val(authorFirst);
        $('#edit-author-last').val(authorLast);
        $('#edit-category').val(categoryValue);
        $('#edit-genre').val(item.genre);
        
        // Handle condition which might be string or object
        let conditionValue = item.condition;
        if (typeof item.condition === 'object') {
            conditionValue = item.condition.name;
        }
        $('#edit-condition').val(conditionValue);
        
        $('#edit-shelf').val(item.shelf);
        $('#edit-price').val(item.price);
        $('#edit-notes').val(item.notes);
        $('#edit-internal-notes').val(item.internalNotes);
        $('#edit-special-price').prop('checked', item.specialPrice);
        $('#edit-rare').prop('checked', item.rare);
        
        // Additional data
        if (item.language) $('#edit-language').val(item.language);
        if (item.year) $('#edit-year').val(item.year);
        if (item.publisher) $('#edit-publisher').val(item.publisher);
        
        // Load transaction history if available
        this.loadTransactionHistory(item);
    },
    
    // Load transaction history
    loadTransactionHistory: function(item) {
        const $tbody = $('#transaction-history-body');
        
        // Clear existing rows
        $tbody.empty();
        
        // Get history from internal notes
        const notes = item.internalNotes || '';
        const notesList = notes.split('\n\n').filter(note => note.trim() !== '');
        
        // Add creation record
        const creationDate = item.date ? new Date(item.date).toLocaleString('sv-SE') : 'Okänt datum';
        $tbody.append(`
            <tr>
                <td>${creationDate}</td>
                <td>Objekt skapat</td>
                <td>admin</td>
                <td>-</td>
            </tr>
        `);
        
        // Add notes as history records
        notesList.forEach(note => {
            let date = 'Okänt datum';
            let action = 'Anteckning';
            let user = 'admin';
            let noteText = note;
            
            // Try to parse timestamp and action
            const timestampMatch = note.match(/\[(.*?)\]/);
            if (timestampMatch) {
                date = timestampMatch[1];
                noteText = note.replace(timestampMatch[0], '').trim();
                
                // Try to parse action
                if (noteText.startsWith('Status ändrad till')) {
                    action = 'Statusändring';
                } else if (noteText.startsWith('Pris ändrat')) {
                    action = 'Prisändring';
                } else if (noteText.includes('Inköpt från') || noteText.includes('Såld till')) {
                    action = 'Transaktion';
                }
            }
            
            $tbody.append(`
                <tr>
                    <td>${date}</td>
                    <td>${action}</td>
                    <td>${user}</td>
                    <td>${noteText}</td>
                </tr>
            `);
        });
    },
    
    // Setup event handlers
    setupEventHandlers: function() {
        const self = this;
        
        // Save button event handler
        $("#save-item-btn").click(function() {
           return
        });
        
        // Delete button event handler
        $("#delete-item-btn").click(function() {
            self.confirmDeleteItem();
        });
        
        // Add category change handler to update image preview
        $("#edit-category").change(function() {
            self.updateImagePreview();
        });
        
        // Handle image upload
        $("#item-image-upload").change(function() {
            self.handleImageUpload(this);
        });
    },
    
    // Update the item image preview based on the selected category
    updateImagePreview: function() {
        const category = $("#edit-category").val().split(' - ')[0];
        if (category) {
            const imageSrc = this.getCategoryImage(category);
            $("#item-image").attr("src", imageSrc);
        }
    },
    
    // Get the appropriate image based on category
    getCategoryImage: function(category) {
        if (category.toLowerCase().includes("bok")) {
            return "img/src-book.webp";
        } else if (category.toLowerCase().includes("cd")) {
            return "img/src-cd.webp";
        } else if (category.toLowerCase().includes("vinyl")) {
            return "img/src-music.webp";
        } else if (category.toLowerCase().includes("serier")) {
            return "img/src-magazine.webp";
        } else if (category.toLowerCase().includes("dvd")) {
            return "img/src-cd.webp";
        } else {
            // Default image for other categories
            return "img/src-book.webp";
        }
    },
    
    // Handle image upload (mock implementation)
    handleImageUpload: function(input) {
        // This is a mock implementation - in a real system, this would upload to server
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // Just show the file in the preview
                $('#item-image').attr('src', e.target.result);
            };
            
            reader.readAsDataURL(input.files[0]);
            
            // Show feedback
            alert('I ett verkligt system skulle denna bild laddas upp till servern.');
        }
    },
    
    // Save item changes
    saveItemChanges: function() {
        return;
    },
    
    // Delete an item
    confirmDeleteItem: function() {
        const itemId = parseInt($('#item-id').val());
        const item = KarisAntikvariat.mockItems.find(item => item.id === itemId);
        
        if (!item) {
            alert('Objektet hittades inte');
            return;
        }
        
        if (confirm(`Är du säker på att du vill ta bort "${item.title}" från lagret? Detta kan inte ångras.`)) {
            // Find the item index
            const index = KarisAntikvariat.mockItems.findIndex(item => item.id === itemId);
            
            // Remove the item
            if (index !== -1) {
                KarisAntikvariat.mockItems.splice(index, 1);
                
                // Show confirmation
                alert(`Objekt "${item.title}" har tagits bort från lagret.`);
                
                // Redirect to inventory page
                window.location.href = 'inventory.html';
            }
        }
    },
    
    // Combine author first and last name
    combineAuthorName: function(firstName, lastName) {
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
};

// Add Item Tab Functions
window.KarisAntikvariat.AddItem = {
    // Initialize Add Item tab
    isInitialized: false,
    init: function() {
        // Only initialize once
        if (this.isInitialized) {
            console.log("AddItem module already initialized, skipping");
            return;
        }
        
        console.log("Initializing AddItem module");
        
        // Set the flag to prevent reinitialization
        this.isInitialized = true;
        
        // Populate all dropdown menus from database
        this.populateDropdowns();
        
        // Setup event handlers
        this.setupEventHandlers();
    },
    
    // Populate all dropdown menus from database references
    populateDropdowns: function() {
        this.populateCategoryDropdown();
        this.populateGenreDropdown();
        this.populateConditionDropdown();
        this.populateShelfDropdown();
        this.populateStatusDropdown();
        this.populateLanguageDropdown();
    },
    
    // Populate category dropdown
    populateCategoryDropdown: function() {
        const $dropdown = $('#item-category');
        
        // Clear dropdown
        $dropdown.empty();
        
        // Add default option
        $dropdown.append('<option value="">Välj kategori</option>');
        
        // Add options for each category with shelves
        if (KarisAntikvariat.Categories && KarisAntikvariat.Categories.length) {
            KarisAntikvariat.Categories.forEach(category => {
                $dropdown.append(`<option value="${category.name}">${category.name}</option>`);
            });
        } else {
            console.warn("Categories not found in database");
        }
    },
    
    // Populate genre dropdown
    populateGenreDropdown: function() {
        const $dropdown = $('#item-genre');
        
        // Clear dropdown
        $dropdown.empty();
        
        // Add default option
        $dropdown.append('<option value="">Välj genre</option>');
        
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
        const $dropdown = $('#item-condition');
        
        // Clear dropdown
        $dropdown.empty();
        
        // Add default option
        $dropdown.append('<option value="">Välj skick</option>');
        
        // Add options for each condition
        if (KarisAntikvariat.Conditions && KarisAntikvariat.Conditions.length) {
            KarisAntikvariat.Conditions.forEach(condition => {
                $dropdown.append(`<option value="${condition.name}">${condition.name} (${condition.code})</option>`);
            });
        } else {
            console.warn("Conditions not found in database");
        }
    },
    
    // Populate shelf dropdown
    populateShelfDropdown: function() {
        const $dropdown = $('#item-shelf');
        
        // Clear dropdown
        $dropdown.empty();
        
        // Add default option
        $dropdown.append('<option value="">Välj hylla</option>');
        
        // Add options for each shelf
        if (KarisAntikvariat.Shelves && KarisAntikvariat.Shelves.length) {
            KarisAntikvariat.Shelves.forEach(shelf => {
                $dropdown.append(`<option value="${shelf.name}">${shelf.name}</option>`);
            });
        } else {
            console.warn("Shelves not found in database");
        }
    },
    
    // Populate status dropdown
    populateStatusDropdown: function() {
        const $dropdown = $('#item-status');
        
        // Clear dropdown
        $dropdown.empty();
        
        // Add options for each status
        if (KarisAntikvariat.StatusTypes && KarisAntikvariat.StatusTypes.length) {
            KarisAntikvariat.StatusTypes.forEach(status => {
                $dropdown.append(`<option value="${status.name}">${status.name}</option>`);
            });
        } else {
            console.warn("Status types not found in database");
            // Add default options
            $dropdown.append('<option value="Tillgänglig" selected>Tillgänglig</option>');
            $dropdown.append('<option value="Reserverad">Reserverad</option>');
        }
    },
    
    // Populate language dropdown
    populateLanguageDropdown: function() {
        const $dropdown = $('#item-language');
        
        // Clear dropdown
        $dropdown.empty();
        
        // Add default option
        $dropdown.append('<option value="">Välj språk</option>');
        
        // Add options for each language
        if (KarisAntikvariat.Languages && KarisAntikvariat.Languages.length) {
            KarisAntikvariat.Languages.forEach(language => {
                $dropdown.append(`<option value="${language.name}">${language.name}</option>`);
            });
        } else {
            // Fallback options if languages not defined
            const languages = [
                { name: "Svenska" },
                { name: "Finska" },
                { name: "Engelska" },
                { name: "Svenska/Engelska" }
            ];
            
            languages.forEach(language => {
                $dropdown.append(`<option value="${language.name}">${language.name}</option>`);
            });
        }
    },
    
    // Setup event handlers
    setupEventHandlers: function() {
        const self = this;
        
        // Remove any existing event handlers to prevent duplicates
        $("#add-item-form").off("submit");
        $("#clear-form-btn").off("click");
        $("#item-category").off("change");
        $("#item-image-upload").off("change");
        
        // Update image preview on category change
        $("#item-category").change(function() {
            self.updateNewItemImagePreview();
        });
        
        // Handle image upload
        $("#item-image-upload").change(function() {
            self.handleImageUpload(this);
        });
        
        // Handle form submission
        $("#add-item-form").submit(function(e) {
            e.preventDefault();
            self.addNewItem();
        });
        
        // Clear form button
        $("#clear-form-btn").click(function() {
            self.clearAddItemForm();
        });
    },
    
    // Update the new item image preview based on selected category
    updateNewItemImagePreview: function() {
        const category = $("#item-category").val().split(' - ')[0];
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
    },
    
    // Handle image upload (mock implementation)
    handleImageUpload: function(input) {
        // This is a mock implementation - in a real system, this would upload to server
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // Just show the file in the preview
                $('#new-item-image').attr('src', e.target.result);
            };
            
            reader.readAsDataURL(input.files[0]);
            
            // Show feedback
            alert('I ett verkligt system skulle denna bild laddas upp till servern.');
        }
    },
    
    // Clear the Add Item form
    clearAddItemForm: function() {
        $("#add-item-form")[0].reset();
        $("#new-item-image").attr("src", "img/src-book.webp");
    },
    
    // Add a new item
/**
 * Add a new item - modified version
 */
addNewItem: function() {
    return;
},
    
    // Combine author first and last name
    combineAuthorName: function(firstName, lastName) {
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
};

// Initialize when DOM is ready
$(document).ready(function() {
    // Initialize item admin functionality when on item-admin page
    if (window.location.pathname.includes('item-admin.html')) {
        // Wait a bit for other scripts to load first
        setTimeout(function() {
            KarisAntikvariat.ItemAdmin.init();
        }, 100);
    }
    
    // Initialize Add Item tab when it becomes active
    $('#add-tab').on('click', function() {
        // Initialize when tab is activated
        setTimeout(function() {
            KarisAntikvariat.AddItem.init();
        }, 100);
    });
    
    // Also initialize if we directly navigate to the Add tab via URL fragment
    if (window.location.hash === '#add') {
        setTimeout(function() {
            KarisAntikvariat.AddItem.init();
        }, 100);
    }
});