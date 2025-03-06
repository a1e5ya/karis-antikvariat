/**
 * Karis Antikvariat - Mock Data
 * This file contains mock inventory data for demonstration purposes
 */


// Add items to the namespace without redeclaring it
window.KarisAntikvariat = window.KarisAntikvariat || {};

// Mock inventory items
window.KarisAntikvariat.mockItems = [
    { 
        id: 1, 
        title: "Vår gemensamma dag", 
        author: "Kjell Westö", 
        category: "Bok", 
        shelf: "Finlandssvenska", 
        genre: "Romaner", 
        condition: {
            name: "Mycket bra",
            code: "K-2"
        }, 
        price: 12.50, 
        status: "Tillgänglig", 
        notes: "Första upplagan, lätt slitage på omslag", 
        date: "2023-12-15", 
        internalNotes: "", 
        specialPrice: false, 
        rare: false,
        language: "Svenska",
        year: 2017,
        publisher: "Schildts & Söderströms"
    },
    { 
        id: 2, 
        title: "Där vi en gång gått", 
        author: "Kjell Westö", 
        category: "Bok", 
        shelf: "Finlandssvenska", 
        genre: "Romaner", 
        condition: {
            name: "Nyskick",
            code: "K-1"
        }, 
        price: 14.90, 
        status: "Tillgänglig", 
        notes: "Bestseller, flera exemplar i lager", 
        date: "2024-01-05", 
        internalNotes: "Inköpt från Köpmansgatan 8, Karis", 
        specialPrice: false, 
        rare: false,
        language: "Svenska",
        year: 2006,
        publisher: "Schildts"
    },
    { 
        id: 3, 
        title: "Karelen - en gränstrakt", 
        author: "Karin Erlandsson", 
        category: "Bok", 
        shelf: "Lokalhistoria", 
        genre: "Historia", 
        condition: {
            name: "Bra",
            code: "K-3"
        }, 
        price: 9.90, 
        status: "Tillgänglig", 
        notes: "Illustrerad utgåva", 
        date: "2024-01-15", 
        internalNotes: "", 
        specialPrice: false, 
        rare: false,
        language: "Svenska",
        year: 2018,
        publisher: "Schildts & Söderströms"
    },
    { 
        id: 4, 
        title: "Seglande skepp", 
        author: "Lars Sjöman", 
        category: "Bok", 
        shelf: "Sjöfart", 
        genre: "Historia", 
        condition: {
            name: "Bra",
            code: "K-3"
        }, 
        price: 11.50, 
        status: "Tillgänglig", 
        notes: "Med fotografier", 
        date: "2024-01-28", 
        internalNotes: "", 
        specialPrice: false, 
        rare: false,
        language: "Svenska",
        year: 2010,
        publisher: "Nautiska Förlaget"
    },
    { 
        id: 5, 
        title: "Mumintrollet och havet", 
        author: "Tove Jansson", 
        category: "Bok", 
        shelf: "Barn/Ungdom", 
        genre: "Barnböcker", 
        condition: {
            name: "Mycket bra",
            code: "K-2"
        }, 
        price: 8.90, 
        status: "Tillgänglig", 
        notes: "Illustrerad av författaren", 
        date: "2024-02-03", 
        internalNotes: "", 
        specialPrice: false, 
        rare: true,
        language: "Svenska",
        year: 1965,
        publisher: "Schildts"
    },
    { 
        id: 6, 
        title: "Greatest Hits", 
        author: "ABBA", 
        category: "Vinyl", 
        shelf: "Musik", 
        genre: "Rock", 
        condition: {
            name: "Bra",
            code: "K-3"
        }, 
        price: 24.99, 
        status: "Såld", 
        notes: "Originalpress från 1980", 
        date: "2024-02-15", 
        internalNotes: "Såld till kund från Ekenäs", 
        specialPrice: true, 
        rare: false,
        language: "",
        year: 1980,
        publisher: "Polar Music"
    },
    { 
        id: 7, 
        title: "Karis historia", 
        author: "Lokal Historiker", 
        category: "Bok", 
        shelf: "Lokalhistoria", 
        genre: "Historia", 
        condition: {
            name: "Acceptabelt",
            code: "K-4"
        }, 
        price: 7.50, 
        status: "Tillgänglig", 
        notes: "Anteckningar på insidan", 
        date: "2024-02-20", 
        internalNotes: "", 
        specialPrice: false, 
        rare: false,
        language: "Svenska",
        year: 1995,
        publisher: "Karis Stad"
    },
    { 
        id: 8, 
        title: "Finlands sjöfart", 
        author: "Marinhistoriker", 
        category: "Bok", 
        shelf: "Sjöfart", 
        genre: "Historia", 
        condition: {
            name: "Nyskick",
            code: "K-1"
        }, 
        price: 15.90, 
        status: "Tillgänglig", 
        notes: "Med kartor och illustrationer", 
        date: "2024-03-01", 
        internalNotes: "", 
        specialPrice: false, 
        rare: false,
        language: "Svenska",
        year: 2020,
        publisher: "Finska Litteratursällskapet"
    },
    { 
        id: 9, 
        title: "Jazz Standards", 
        author: "Miles Davis", 
        category: "CD", 
        shelf: "Musik", 
        genre: "Jazz", 
        condition: {
            name: "Nyskick",
            code: "K-1"
        }, 
        price: 9.99, 
        status: "Tillgänglig", 
        notes: "Samling av klassiska jazzstycken", 
        date: "2024-02-18", 
        internalNotes: "", 
        specialPrice: false, 
        rare: false,
        language: "",
        year: 2005,
        publisher: "Blue Note Records"
    },
    { 
        id: 10, 
        title: "Fantomen - Den svarta masken", 
        author: "Lee Falk", 
        category: "Serier", 
        shelf: "Serier", 
        genre: "Äventyr", 
        condition: {
            name: "Bra",
            code: "K-3"
        }, 
        price: 5.50, 
        status: "Tillgänglig", 
        notes: "Klassisk serietidning", 
        date: "2024-02-05", 
        internalNotes: "", 
        specialPrice: false, 
        rare: false,
        language: "Svenska",
        year: 1985,
        publisher: "Semic"
    },
    { 
        id: 11, 
        title: "Titanics undergång", 
        author: "James Cameron", 
        category: "DVD", 
        shelf: "Film", 
        genre: "Drama", 
        condition: {
            name: "Mycket bra",
            code: "K-2"
        }, 
        price: 7.99, 
        status: "Tillgänglig", 
        notes: "Special Edition med extramaterial", 
        date: "2024-01-23", 
        internalNotes: "", 
        specialPrice: false, 
        rare: false,
        language: "Svenska/Engelska",
        year: 1997,
        publisher: "20th Century Fox"
    },
    { 
        id: 12, 
        title: "Klassiska pärlor", 
        author: "Berliner Philharmoniker", 
        category: "CD", 
        shelf: "Musik", 
        genre: "Klassisk", 
        condition: {
            name: "Nyskick",
            code: "K-1"
        }, 
        price: 8.90, 
        status: "Tillgänglig", 
        notes: "Samling av klassiska stycken", 
        date: "2024-02-10", 
        internalNotes: "", 
        specialPrice: false, 
        rare: false,
        language: "",
        year: 2015,
        publisher: "Deutsche Grammophon"
    },
    { 
        id: 13, 
        title: "Gamla mynt från Östersjön", 
        author: "", 
        category: "Samlarobjekt", 
        shelf: "Samlarobjekt", 
        genre: "", 
        condition: {
            name: "Bra",
            code: "K-3"
        }, 
        price: 45.00, 
        status: "Tillgänglig", 
        notes: "Samling av mynt hittade i Östersjön", 
        date: "2024-03-02", 
        internalNotes: "Inköpta från samlare i Åbo", 
        specialPrice: true, 
        rare: true,
        language: "",
        year: 0,
        publisher: ""
    },
    { 
        id: 14, 
        title: "Pippi Långstrump", 
        author: "Astrid Lindgren", 
        category: "Bok", 
        shelf: "Barn/Ungdom", 
        genre: "Barnböcker", 
        condition: {
            name: "Acceptabelt",
            code: "K-4"
        }, 
        price: 6.90, 
        status: "Tillgänglig", 
        notes: "Klassisk barnbok, välläst exemplar", 
        date: "2024-01-18", 
        internalNotes: "", 
        specialPrice: false, 
        rare: false,
        language: "Svenska",
        year: 1974,
        publisher: "Rabén & Sjögren"
    },
    { 
        id: 15, 
        title: "The Dark Side of the Moon", 
        author: "Pink Floyd", 
        category: "Vinyl", 
        shelf: "Musik", 
        genre: "Rock", 
        condition: {
            name: "Mycket bra",
            code: "K-2"
        }, 
        price: 35.00, 
        status: "Tillgänglig", 
        notes: "Legendariskt album i originalutgåva", 
        date: "2024-02-25", 
        internalNotes: "", 
        specialPrice: false, 
        rare: true,
        language: "",
        year: 1973,
        publisher: "Harvest Records"
    },
    { 
        id: 16, 
        title: "Åbo slotts historia", 
        author: "Henrik Finne", 
        category: "Bok", 
        shelf: "Lokalhistoria", 
        genre: "Historia", 
        condition: {
            name: "Nyskick",
            code: "K-1"
        }, 
        price: 13.50, 
        status: "Tillgänglig", 
        notes: "Rikt illustrerad med fotografier och ritningar", 
        date: "2024-01-30", 
        internalNotes: "", 
        specialPrice: false, 
        rare: false,
        language: "Svenska",
        year: 2008,
        publisher: "Åbo Akademi"
    },
    { 
        id: 17, 
        title: "Nordiska gudar", 
        author: "Jonas Klingberg", 
        category: "Bok", 
        shelf: "Finlandssvenska", 
        genre: "Dikter", 
        condition: {
            name: "Bra",
            code: "K-3"
        }, 
        price: 10.90, 
        status: "Tillgänglig", 
        notes: "Diktsamling inspirerad av nordisk mytologi", 
        date: "2024-02-08", 
        internalNotes: "Signerad av författaren", 
        specialPrice: false, 
        rare: true,
        language: "Svenska",
        year: 2018,
        publisher: "Schildts & Söderströms"
    },
    { 
        id: 18, 
        title: "Helsingfors genom tiderna", 
        author: "Mårten Jansson", 
        category: "Bok", 
        shelf: "Lokalhistoria", 
        genre: "Historia", 
        condition: {
            name: "Nyskick",
            code: "K-1"
        }, 
        price: 16.90, 
        status: "Tillgänglig", 
        notes: "Omfattande historieverk med sällsynta fotografier", 
        date: "2024-02-28", 
        internalNotes: "", 
        specialPrice: false, 
        rare: false,
        language: "Svenska",
        year: 2022,
        publisher: "Finska Litteratursällskapet"
    },
    { 
        id: 19, 
        title: "Min tid på havet", 
        author: "Johan Segerfelt", 
        category: "Bok", 
        shelf: "Sjöfart", 
        genre: "Biografi", 
        condition: {
            name: "Mycket bra",
            code: "K-2"
        }, 
        price: 11.90, 
        status: "Tillgänglig", 
        notes: "Självbiografi av en erfaren sjökapten", 
        date: "2024-02-12", 
        internalNotes: "", 
        specialPrice: false, 
        rare: false,
        language: "Svenska",
        year: 2015,
        publisher: "Nautiska Förlaget"
    },
    { 
        id: 20, 
        title: "Suomenlinna - Havsborgen", 
        author: "Leif Eriksson", 
        category: "Bok", 
        shelf: "Lokalhistoria", 
        genre: "Historia", 
        condition: {
            name: "Bra",
            code: "K-3"
        }, 
        price: 12.50, 
        status: "Tillgänglig", 
        notes: "Med kartor och historiska ritningar", 
        date: "2024-03-05", 
        internalNotes: "", 
        specialPrice: false, 
        rare: false,
        language: "Svenska",
        year: 2019,
        publisher: "Finska Litteratursällskapet"
    }
];