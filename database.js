/**
 * Karis Antikvariat - Database References
 * This file contains centralized reference data for the inventory system
 */

// Use the pre-existing global namespace
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

// Utility functions for lookups
KarisAntikvariat.Utils = {
    // Generic lookup function
    findByName: function(collection, name) {
        return collection.find(item => item.name === name);
    },
    
    // Specific lookup methods
    getCategoryByName: function(name) {
        return this.findByName(this.Categories, name);
    },
    
    getShelfByName: function(name) {
        return this.findByName(this.Shelves, name);
    },
    
    getGenreByName: function(name) {
        return this.findByName(this.Genres, name);
    },
    
    getConditionByName: function(name) {
        return this.findByName(this.Conditions, name);
    },
    
    getStatusByName: function(name) {
        return this.findByName(this.StatusTypes, name);
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KarisAntikvariat;
}