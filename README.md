# Karis Antikvariat Inventory System

A comprehensive web-based inventory management system for Karis Antikvariat, a bookstore specializing in Finland-Swedish literature, local history, and maritime books, as well as various media items including CDs, vinyl records, DVDs, and collectibles.

## Overview

The Karis Antikvariat Inventory System is designed to streamline inventory management, facilitate easier search capabilities, standardize pricing, and prepare for future e-commerce integration. It features both a public-facing interface for customers to browse available items and an administrative interface for staff to manage inventory.

## Features

### Public-Facing Interface
- Browse available inventory
- Search by title, author, or category
- View detailed item information
- View related items
- Newsletter subscription
- Language switcher (Swedish/Finnish)

### Administrative Interface
- Secure login system
- Comprehensive inventory management
  - Add new items with detailed metadata
  - Edit existing items
  - Mark items as sold
  - Delete items from inventory
- Advanced search and filtering
- Database reference management (categories, shelves, genres, conditions)
- List generation for printing
- Item status tracking

## Technology Stack

- Frontend: HTML5, CSS3, JavaScript, jQuery, Bootstrap 5
- Data Storage: Mock data (JSON) with future database integration planned
- Authentication: Session-based authentication (currently simulated)
- Responsive Design: Mobile and desktop support

## File Structure

```
├── admin.js               # Administrative functionality
├── auth.js                # Authentication functions
├── core.js                # Core utility functions
├── database.js            # Reference data (categories, shelves, etc.)
├── footer-admin.html      # Footer for admin pages
├── footer-public.html     # Footer for public pages
├── header-admin.html      # Header for admin pages
├── header-public.html     # Header for public pages
├── index.html             # Homepage (public)
├── inventory.html         # Inventory management page (admin)
├── item-admin.html        # Item edit page (admin)
├── item.html              # Item details page (public)
├── mockItems.js           # Sample inventory data
├── namespace.js           # Global namespace initialization
├── public.js              # Public interface functionality
├── styles.css             # Unified stylesheet
└── img/                   # Image directory
    ├── bild1.webp         # Store images
    ├── bild2.webp
    ├── bild3.webp
    ├── bild4.webp
    ├── hero.webp          # Hero banner image
    ├── src-book.webp      # Item category images
    ├── src-cd.webp
    ├── src-magazine.webp
    └── src-music.webp
```

## Getting Started

1. Clone the repository
2. Open `index.html` in a web browser to access the public interface
3. Navigate to `inventory.html` to access the admin interface
4. Login using the default credentials:
   - Username: `admin`
   - Password: `admin`

## Page Navigation

### Public Pages
- `index.html` - Homepage with store information and inventory browsing
- `item.html` - Detailed view of a specific inventory item

### Admin Pages
- `inventory.html` - Main inventory management interface with multiple tabs:
  - **Search Tab**: Browse, search and manage inventory
  - **Add Item Tab**: Add new items to the inventory
  - **Edit Database Tab**: Manage reference data like categories and shelves
  - **Lists Tab**: Generate printable lists of inventory items
- `item-admin.html` - Edit details of a specific inventory item

## Features in Detail

### Search Functionality
The system provides robust search capabilities in both the public and admin interfaces:
- Text-based search across titles, authors, and item IDs
- Category filtering
- Clickable rows in search results for quick access to item details

### Item Management
The Add Item and Edit Item forms provide comprehensive fields for detailed item information:
- Basic information (Title, Author, Category)
- Pricing and availability
- Condition grading
- Location tracking (shelf)
- Additional metadata (Language, Publisher, Year)
- Notes (visible to customers and internal)
- Special designations (rare items, special pricing)

### Database References
The system maintains centralized reference data for:
- Item categories
- Shelf locations
- Genres
- Condition grades
- Status types

### Authentication
A simple authentication system is implemented to secure the admin interface:
- Login/logout functionality
- Session-based authentication
- Password reset simulation

## Future Enhancements

- Backend integration with PHP and MySQL
- Actual file uploads for item images
- User management with different access levels
- Sales tracking and reporting
- WooCommerce integration for online sales

## Credits

Developed for Axxell educational project.

## License

© 2025 Axxell. All rights reserved.