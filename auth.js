/**
 * Karis Antikvariat - Authentication System
 * Simple implementation for login functionality
 */

// Check if user is authenticated
function isAuthenticated() {
    console.log("isAuthenticated called");
    return sessionStorage.getItem('authenticated') === 'true';
}

// Show login modal
function showLoginModal() {
    console.log("showLoginModal called");
    
    // Reset form and hide error message
    $('#login-form')[0].reset();
    $('#login-error').addClass('d-none');
    
    // Show the modal
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();
}

// Show welcome message after login
function showWelcomeMessage() {
    console.log("showWelcomeMessage called");
    // Could add a toast or other notification here
}

// Document ready handler
$(document).ready(function() {
    console.log("auth.js loaded and ready");
    
    // Handle login button click
    $(document).on('click', '#login-btn, .login-btn', function(e) {
        console.log("Login button clicked");
        e.preventDefault();
        showLoginModal();
    });
    
    // Handle login form submission
    $(document).on('submit', '#login-form', function(e) {
        console.log("Login form submitted");
        e.preventDefault();
        
        const username = $('#username').val();
        const password = $('#password').val();
        
        // Simple admin/admin check
        if (username === 'admin' && password === 'admin') {
            console.log("Login successful");
            
            // Store authentication
            sessionStorage.setItem('authenticated', 'true');
            sessionStorage.setItem('username', username);
            
            // Hide modal
            const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            loginModal.hide();
            
            // Redirect to inventory page
            window.location.href = 'inventory.html';
        } else {
            console.log("Login failed");
            $('#login-error').removeClass('d-none');
        }
    });
    
    // Handle logout button
    $(document).on('click', '#logout-btn', function(e) {
        console.log("Logout clicked");
        e.preventDefault();
        
        // Clear authentication
        sessionStorage.removeItem('authenticated');
        sessionStorage.removeItem('username');
        
        // Redirect to home
        window.location.href = 'index.html';
    });
    
    // Handle forgot password link
    $(document).on('click', '#forgot-password', function(e) {
        console.log("Forgot password clicked");
        e.preventDefault();
        
        // Hide login modal
        const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        loginModal.hide();
        
        // Show forgot password modal
        const forgotPasswordModal = new bootstrap.Modal(document.getElementById('forgotPasswordModal'));
        forgotPasswordModal.show();
    });
    
    // Handle forgot password form submission
    $(document).on('submit', '#forgot-password-form', function(e) {
        console.log("Forgot password form submitted");
        e.preventDefault();
        
        const email = $('#recovery-email').val();
        
        // Show demo message
        alert(`I ett verkligt system skulle en återställningslänk skickas till: ${email}`);
        
        // Hide modal
        const forgotPasswordModal = bootstrap.Modal.getInstance(document.getElementById('forgotPasswordModal'));
        forgotPasswordModal.hide();
    });
});