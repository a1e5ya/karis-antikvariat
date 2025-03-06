// Karis Antikvariat - Admin Interface
const KarisAntikvariat = window.KarisAntikvariat || {};

KarisAntikvariat.Admin = {
    // Authentication state
    authenticated: false,
    currentUser: null,
    
    // Initialize admin interface
    init: function() {
        // Initialize tabs
        this.initializeTabs();
        
        // Set up event handlers
        this.setupEventHandlers();
        
        // Load database references using DatabaseManager
        KarisAntikvariat.DatabaseManager.loadDatabaseReferences();
        
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
                    <td>${KarisAntikvariat.Utils.formatPrice(item.price)}</td>
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
                    <td>${KarisAntikvariat.Utils.formatPrice(item.price)}</td>  
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
    
    // Search inventory items
    searchItems: function() {
        const searchTerm = $('#search-term').val().toLowerCase();
        const categoryFilter = $('#category-filter').val();
        
        // Filter items
        const filteredItems = KarisAntikvariat.mockItems.filter(item => {
            const matchesSearch = !searchTerm || 
                item.title.toLowerCase().includes(searchTerm) ||
                (item.author && item.author.toLowerCase().includes(searchTerm)) ||
                item.id.toString().includes(searchTerm);
            
            const matchesCategory = categoryFilter === 'any' || !categoryFilter || 
                item.category.toLowerCase().includes(categoryFilter.toLowerCase()) ||
                (item.shelf && item.shelf.toLowerCase().includes(categoryFilter.toLowerCase()));
            
            return matchesSearch && matchesCategory;
        });
        
        // Update the UI
        this.loadInventoryItems(filteredItems);
    },
    
    // Clear the Add Item form
    clearAddItemForm: function() {
        $("#add-item-form")[0].reset();
        $("#new-item-image").attr("src", "img/src-book.webp");
    },
    
    // Add a new item
    addNewItem: function(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = {
            title: $("#item-title").val(),
            status: $("#item-status").val(),
            authorFirstName: $("#author-first").val(),
            authorLastName: $("#author-last").val(),
            author: this.combineAuthorName($("#author-first").val(), $("#author-last").val()),
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
        this.clearAddItemForm();
        
        // Switch to search tab and show the newly added item
        const searchTab = document.querySelector('#search-tab');
        bootstrap.Tab.getInstance(searchTab).show();
        
        // Update search term to show the new item
        $("#search-term").val(newItem.title);
        this.searchItems();
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
    },
    
    // Edit an existing item
    editItem: function(itemId) {
        window.location.href = `item-admin.html?id=${itemId}`;
    },
    
    // Mark an item as sold
    sellItem: function(itemId) {
        const item = KarisAntikvariat.mockItems.find(item => item.id === parseInt(itemId));
        if (!item) {
            alert('Objektet hittades inte');
            return;
        }
        
        if (item.status !== 'Tillgänglig') {
            alert('Objektet är inte tillgängligt för försäljning');
            return;
        }
        
        if (confirm(`Är du säker på att du vill markera "${item.title}" som såld?`)) {
            item.status = 'Såld';
            
            // Reload the inventory table
            this.searchItems();
            
            // Show confirmation
            alert(`Objekt "${item.title}" har markerats som såld.`);
        }
    },
    
    // Delete an item
    deleteItem: function(itemId) {
        const index = KarisAntikvariat.mockItems.findIndex(item => item.id === parseInt(itemId));
        if (index === -1) {
            alert('Objektet hittades inte');
            return;
        }
        
        const item = KarisAntikvariat.mockItems[index];
        
        if (confirm(`Är du säker på att du vill ta bort "${item.title}" från lagret?`)) {
            // Remove the item
            KarisAntikvariat.mockItems.splice(index, 1);
            
            // Reload the inventory table
            this.searchItems();
            
            // Show confirmation
            alert(`Objekt "${item.title}" har tagits bort från lagret.`);
        }
    },
    
    // View an item
    viewItem: function(itemId) {
        window.location.href = `item-admin.html?id=${itemId}`;
    },
    
    // Toggle select all checkbox for lists
    toggleSelectAll: function() {
        const isChecked = $(this).prop('checked');
        $('input[name="list-item"]').prop('checked', isChecked);
    },
    
    // Handle print list button
    handlePrintList: function() {
        const selectedIds = [];
        $('input[name="list-item"]:checked').each(function() {
            selectedIds.push($(this).val());
        });
        
        if (selectedIds.length === 0) {
            alert('Välj minst ett objekt att skriva ut');
            return;
        }
        
        // Get selected items
        const selectedItems = KarisAntikvariat.mockItems.filter(item => 
            selectedIds.includes(item.id.toString())
        );
        
        // Open print window
        this.printList(selectedItems);
    },
    
    // Print a list of items
    printList: function(items) {
        // Create print content
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
                </style>
            </head>
            <body>
                <h1>Lagerlista - Karis Antikvariat</h1>
                <div class="print-date">Utskriven: ${new Date().toLocaleDateString('sv-SE')}</div>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Titel</th>
                            <th>Författare</th>
                            <th>Kategori</th>
                            <th>Hylla</th>
                            <th>Pris</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        items.forEach(item => {
            content += `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.title}</td>
                    <td>${item.author || '-'}</td>
                    <td>${item.category}</td>
                    <td>${item.shelf || '-'}</td>
                    <td>${KarisAntikvariat.Utils.formatPrice(item.price)}</td>
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
    }
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
    
    // Handle clear form button
    $("#clear-form-btn").click(function() {
        KarisAntikvariat.Admin.clearAddItemForm();
    });
    
    // Initialize with default image
    updateNewItemImagePreview();
}

// Initialize when DOM is ready
$(document).ready(function() {
    KarisAntikvariat.Admin.init();
    enhanceAddItemForm();
});