/**
 * Karis Antikvariat - Public Interface
 * This file contains all public-facing functionality for the website
 */

// Access the namespace without redeclaring it
window.KarisAntikvariat = window.KarisAntikvariat || {};

// Public Interface Functionality
window.KarisAntikvariat.Public = {
    // Current language (default: Swedish)
    language: 'sv',
    
    // Language strings for UI elements
    translations: {
        sv: {
            searchPlaceholder: "Sök efter titel, författare eller kategori",
            allCategories: "Alla kategorier",
            searchButton: "Sök",
            noItemsFound: "Inga objekt hittades. Prova en annan sökterm eller kategori.",
            newsletterSuccess: "Tack för att du prenumererar på vårt nyhetsbrev!",
            newsletterError: "Det gick inte att prenumerera. Försök igen senare.",
            cartNotImplemented: "Funktionen för varukorgen är inte implementerad i denna demoversion"
        },
        fi: {
            searchPlaceholder: "Etsi nimellä, tekijällä tai kategorialla",
            allCategories: "Kaikki kategoriat",
            searchButton: "Etsi",
            noItemsFound: "Ei tuloksia. Kokeile toista hakusanaa tai kategoriaa.",
            newsletterSuccess: "Kiitos tilauksestasi uutiskirjeellemme!",
            newsletterError: "Tilaus epäonnistui. Yritä myöhemmin uudelleen.",
            cartNotImplemented: "Ostoskorin toiminnallisuutta ei ole toteutettu tässä demoversiossa"
        }
    },
    
    // Get a translated string
    getText: function(key) {
        return this.translations[this.language][key] || '';
    },
    
    // Switch language
    switchLanguage: function(lang) {
        if (lang !== 'sv' && lang !== 'fi') return;
        
        this.language = lang;
        
        // Update UI elements with new language
        this.updateInterfaceLanguage();
        
        // Update active language button
        $('.language-switcher button').removeClass('active');
        $(`.language-switcher button:contains('${lang.toUpperCase()}')`).addClass('active');
        
        // Store language preference in localStorage
        localStorage.setItem('karisLanguage', lang);
    },
    
    // Update interface text based on current language
    updateInterfaceLanguage: function() {
        // Update search area
        $('#public-search').attr('placeholder', this.getText('searchPlaceholder'));
        $('#public-category option:first').text(this.getText('allCategories'));
        $('#public-search-btn').text(this.getText('searchButton'));
        
        // More UI elements would be updated here
    },
    
    // Load item details page
    loadItemDetails: function(itemId) {
        const item = window.KarisAntikvariat.mockItems.find(item => item.id === itemId);
        
        if (!item) {
            alert('Objektet hittades inte');
            window.location.href = 'index.html';
            return;
        }
        
        // Set document title
        document.title = item.title + ' - Karis Antikvariat';
        
        // Get and set the appropriate image based on category
        const imageSrc = this.getCategoryImage(item.category);
        $('#item-image').attr('src', imageSrc).attr('alt', item.title);
        
        // Populate item details
        $('#item-title').text(item.title);
        $('#item-author').text(item.author);
        $('#item-category').text(`${item.category}${item.shelf ? ' - ' + item.shelf : ''}`);
        $('#item-genre').text(item.genre || '-');
        
        // Format condition which can be either string or object
        let condition = item.condition;
        if (typeof condition === 'object') {
            condition = condition.name;
        }
        $('#item-condition').text(condition || '-');
        
        $('#item-shelf').text(item.shelf || '-');
        $('#item-date').text(this.formatDate(item.date));
        $('#item-price').text(this.formatPrice(item.price));
        $('#item-notes').text(item.notes || 'Inga ytterligare anteckningar.');
        
        // Additional metadata if available
        if (item.language) $('#item-language').text(item.language);
        if (item.year) $('#item-year').text(item.year);
        if (item.publisher) $('#item-publisher').text(item.publisher);
        
        // Status badge
        if (item.status !== 'Tillgänglig') {
            $('#item-status').removeClass('bg-success').addClass('bg-secondary').text(item.status);
        }
        
        // Load related items
        this.loadRelatedItems(item);
    },
    
    // Load related items for single item page
    loadRelatedItems: function(currentItem) {
        const relatedItemsContainer = $('#related-items');
        if (!relatedItemsContainer.length) return;
        
        // Get related items based on category or author
        const relatedItems = window.KarisAntikvariat.mockItems
            .filter(item => 
                item.id !== currentItem.id && 
                (item.category === currentItem.category || item.author === currentItem.author) &&
                item.status === "Tillgänglig"
            )
            .slice(0, 4); // Take up to 4 related items
            
        // Clear the container
        relatedItemsContainer.empty();
        
        // If no related items found
        if (relatedItems.length === 0) {
            relatedItemsContainer.html('<p class="text-muted">Inga relaterade objekt hittades.</p>');
            return;
        }
        
        // Render each related item
        relatedItems.forEach(item => {
            // Determine the correct image based on the category
            let imageSrc = this.getCategoryImage(item.category);
            
            // Create the HTML for this item
            const itemHtml = `
                <div class="col">
                    <div class="card h-100">
                        <img src="${imageSrc}" class="card-img-top" alt="${item.title}">
                        <div class="card-body">
                            <h5 class="card-title">${item.title}</h5>
                            <p class="card-text text-muted">${item.author}</p>
                            <p class="text-success fw-bold mb-2">${this.formatPrice(item.price)}</p>
                            <a href="item.html?id=${item.id}" class="stretched-link"></a>
                        </div>
                    </div>
                </div>
            `;
            
            // Add it to the container
            relatedItemsContainer.append(itemHtml);
        });
    },
    
    // Initialize newsletter form
    initNewsletterForm: function() {
        const self = this;
        
        $(document).on('submit', '#newsletter-form', function(e) {
            e.preventDefault();
            const email = $('#newsletter-email').val();
            if (email) {
                alert(self.getText('newsletterSuccess'));
                $('#newsletter-email').val('');
            }
        });
    },
    
    // Initialize language switcher
    initLanguageSwitcher: function() {
        const self = this;
        
        // Check if there's a saved language preference
        const savedLanguage = localStorage.getItem('karisLanguage');
        if (savedLanguage) {
            this.switchLanguage(savedLanguage);
        }
        
        // Language switcher buttons
        $('.language-switcher button').click(function() {
            const lang = $(this).text().toLowerCase();
            self.switchLanguage(lang);
        });
    },
    
    // Helper function to get category image
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
    
    // Format price with Euro symbol
    formatPrice: function(price) {
        return '€' + parseFloat(price).toFixed(2);
    },
    
    // Format date to locale string
    formatDate: function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString(this.language === 'sv' ? 'sv-SE' : 'fi-FI');
    },
    
    // Get URL parameter
    getUrlParameter: function(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    },
    
    // Initialize smooth scrolling for anchor links
    initSmoothScrolling: function() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Only apply smooth scrolling to anchors on the same page
                if (href.startsWith('#') && href.length > 1) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        window.scrollTo({
                            top: target.offsetTop - 70,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    },
    
    // Initialize public interface
    init: function() {
        // Load header and footer for public pages
        $("#header-container").load("header-public.html", () => {
            // Initialize language switcher after header is loaded
            this.initLanguageSwitcher();
            
            // Activate current nav link
            if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
                $("#nav-home").addClass("active");
            } else if (window.location.pathname.endsWith('item.html')) {
                // Item page doesn't highlight any nav item
            }
        });
        
        $("#footer-container").load("footer-public.html", () => {
            // Initialize newsletter form after footer is loaded
            this.initNewsletterForm();
        });
        
        // Initialize smooth scrolling
        this.initSmoothScrolling();
        
        // Load item details if on item page
        const itemId = parseInt(this.getUrlParameter('id'));
        if ($('#item-image').length > 0 && !isNaN(itemId)) {
            this.loadItemDetails(itemId);
        }
    }
};

// Initialize when DOM is ready
$(document).ready(function() {
    window.KarisAntikvariat.Public.init();
});