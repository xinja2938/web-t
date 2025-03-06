// DOM Elements
const adminLoginForm = document.getElementById('admin-login');
const adminDashboard = document.getElementById('admin-dashboard');
const adminEmail = document.getElementById('admin-email');
const adminPassword = document.getElementById('admin-password');
const adminLoginBtn = document.getElementById('admin-login-btn');
const adminLogoutBtn = document.getElementById('admin-logout-btn');
const totalUsersEl = document.getElementById('total-users');
const mostClickedEl = document.getElementById('most-clicked');
const seriesNameInput = document.getElementById('series-name');
const seriesLanguageInput = document.getElementById('series-language');
const seriesQualityInput = document.getElementById('series-quality');
const seriesPosterInput = document.getElementById('series-poster');
const episodesList = document.getElementById('episodes-list');
const addEpisodeBtn = document.getElementById('add-episode-btn');
const savePostBtn = document.getElementById('save-post-btn');
const postsList = document.getElementById('posts-list');

// Data storage
let animeData = [];
let users = [];
let currentEditId = null;

// Admin credentials
const ADMIN_EMAIL = 'mdsamir2938@gmail.com';
const ADMIN_PASSWORD = 'Sksamir09876@';

// Initialize the admin panel
function init() {
    loadData();
    setupEventListeners();
    checkAdminLoginStatus();
}

// Load data from localStorage
function loadData() {
    // Load anime data
    const storedAnimeData = localStorage.getItem('animeData');
    if (storedAnimeData) {
        animeData = JSON.parse(storedAnimeData);
    }

    // Load users data
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
        users = JSON.parse(storedUsers);
    } else {
        // Initialize with a sample user
        users = [
            {
                name: "User",
                email: "user@example.com"
            }
        ];
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Set up event listeners
function setupEventListeners() {
    // Admin login button click
    adminLoginBtn.addEventListener('click', () => {
        const email = adminEmail.value.trim();
        const password = adminPassword.value;
        
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            // Store admin login status
            localStorage.setItem('adminLoggedIn', 'true');
            
            // Show admin dashboard
            showAdminDashboard();
        } else {
            alert('Invalid email or password. Access denied.');
        }
    });

    // Admin logout button click
    adminLogoutBtn.addEventListener('click', () => {
        // Clear admin login status
        localStorage.removeItem('adminLoggedIn');
        
        // Show admin login form
        adminDashboard.style.display = 'none';
        adminLoginForm.style.display = 'flex';
    });

    // Add episode button click
    addEpisodeBtn.addEventListener('click', () => {
        addEpisodeInput();
    });

    // Save post button click
    savePostBtn.addEventListener('click', savePost);
}

// Check admin login status
function checkAdminLoginStatus() {
    const adminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    
    if (adminLoggedIn) {
        showAdminDashboard();
    }
}

// Show admin dashboard
function showAdminDashboard() {
    adminLoginForm.style.display = 'none';
    adminDashboard.style.display = 'block';
    
    // Update dashboard stats
    updateDashboardStats();
    
    // Render posts list
    renderPostsList();
    
    // Reset form if not editing
    if (!currentEditId) {
        resetForm();
    }
}

// Update dashboard stats
function updateDashboardStats() {
    // Update total users
    totalUsersEl.textContent = users.length;
    
    // Update most clicked series
    if (animeData.length > 0) {
        const mostClicked = [...animeData].sort((a, b) => b.clicks - a.clicks)[0];
        mostClickedEl.textContent = mostClicked.title;
    } else {
        mostClickedEl.textContent = 'No data';
    }
}

// Add a new episode input to the form
function addEpisodeInput(episode = null) {
    const episodeItem = document.createElement('div');
    episodeItem.className = 'episode-item';
    
    const episodeNumberInput = document.createElement('input');
    episodeNumberInput.type = 'number';
    episodeNumberInput.className = 'episode-input';
    episodeNumberInput.placeholder = 'Episode Number';
    episodeNumberInput.min = 1;
    episodeNumberInput.value = episode ? episode.number : '';
    
    const episodeLinkInput = document.createElement('input');
    episodeLinkInput.type = 'text';
    episodeLinkInput.className = 'episode-input';
    episodeLinkInput.placeholder = 'Episode Link';
    episodeLinkInput.value = episode ? episode.link : '';
    
    const episodeNewCheckbox = document.createElement('input');
    episodeNewCheckbox.type = 'checkbox';
    episodeNewCheckbox.id = `episode-new-${Date.now()}`;
    episodeNewCheckbox.checked = episode ? episode.isNew : false;
    
    const episodeNewLabel = document.createElement('label');
    episodeNewLabel.htmlFor = episodeNewCheckbox.id;
    episodeNewLabel.textContent = 'New';
    
    const episodeFinaleCheckbox = document.createElement('input');
    episodeFinaleCheckbox.type = 'checkbox';
    episodeFinaleCheckbox.id = `episode-finale-${Date.now()}`;
    episodeFinaleCheckbox.checked = episode ? episode.isFinale : false;
    
    const episodeFinaleLabel = document.createElement('label');
    episodeFinaleLabel.htmlFor = episodeFinaleCheckbox.id;
    episodeFinaleLabel.textContent = 'Finale';
    
    const removeButton = document.createElement('button');
    removeButton.className = 'remove-episode';
    removeButton.innerHTML = '<i class="fas fa-trash"></i>';
    removeButton.addEventListener('click', () => {
        episodeItem.remove();
    });
    
    episodeItem.appendChild(episodeNumberInput);
    episodeItem.appendChild(episodeLinkInput);
    episodeItem.appendChild(episodeNewCheckbox);
    episodeItem.appendChild(episodeNewLabel);
    episodeItem.appendChild(episodeFinaleCheckbox);
    episodeItem.appendChild(episodeFinaleLabel);
    episodeItem.appendChild(removeButton);
    
    episodesList.appendChild(episodeItem);
}

// Save post
function savePost() {
    const name = seriesNameInput.value.trim();
    const language = seriesLanguageInput.value.trim();
    const quality = seriesQualityInput.value.trim();
    const poster = seriesPosterInput.value.trim();
    
    // Validate form
    if (!name || !language || !quality || !poster) {
        alert('Please fill in all series info fields');
        return;
    }
    
    // Get episodes
    const episodeItems = document.querySelectorAll('.episode-item');
    const episodes = [];
    
    episodeItems.forEach((item, index) => {
        const inputs = item.querySelectorAll('.episode-input');
        const checkboxes = item.querySelectorAll('input[type="checkbox"]');
        
        const number = parseInt(inputs[0].value);
        const link = inputs[1].value.trim();
        const isNew = checkboxes[0].checked;
        const isFinale = checkboxes[1].checked;
        
        if (number && link) {
            episodes.push({
                id: Date.now() + index,
                number,
                link,
                isNew,
                isFinale
            });
        }
    });
    
    if (episodes.length === 0) {
        alert('Please add at least one episode');
        return;
    }
    
    // Create title
    const title = `${name} ${language}`;
    
    if (currentEditId) {
        // Update existing anime
        const animeIndex = animeData.findIndex(anime => anime.id === currentEditId);
        
        if (animeIndex !== -1) {
            animeData[animeIndex] = {
                ...animeData[animeIndex],
                title,
                name,
                language,
                quality,
                poster,
                episodes
            };
        }
    } else {
        // Add new anime
        const newAnime = {
            id: Date.now(),
            title,
            name,
            language,
            quality,
            poster,
            episodes,
            clicks: 0,
            favorites: 0,
            date: new Date().toISOString().split('T')[0]
        };
        
        animeData.push(newAnime);
    }
    
    // Save to localStorage
    localStorage.setItem('animeData', JSON.stringify(animeData));
    
    // Reset form and current edit
    resetForm();
    currentEditId = null;
    
    // Update UI
    renderPostsList();
    updateDashboardStats();
    
    alert('Post saved successfully!');
}

// Reset form
function resetForm() {
    seriesNameInput.value = '';
    seriesLanguageInput.value = '';
    seriesQualityInput.value = '';
    seriesPosterInput.value = '';
    episodesList.innerHTML = '';
    currentEditId = null;
    savePostBtn.textContent = 'Save Post';
}

// Render posts list
function renderPostsList() {
    postsList.innerHTML = '';
    
    if (animeData.length === 0) {
        postsList.innerHTML = '<li class="post-item">No posts available</li>';
        return;
    }
    
    animeData.forEach(anime => {
        const postItem = document.createElement('li');
        postItem.className = 'post-item';
        
        const postTitle = document.createElement('div');
        postTitle.className = 'post-title';
        postTitle.textContent = anime.title;
        
        const postActions = document.createElement('div');
        postActions.className = 'post-actions';
        
        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="fas fa-edit"></i>';
        editButton.addEventListener('click', () => {
            editPost(anime.id);
        });
        
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.addEventListener('click', () => {
            deletePost(anime.id);
        });
        
        postActions.appendChild(editButton);
        postActions.appendChild(deleteButton);
        
        postItem.appendChild(postTitle);
        postItem.appendChild(postActions);
        
        postsList.appendChild(postItem);
    });
}

// Edit post
function editPost(id) {
    const anime = animeData.find(item => item.id === id);
    
    if (!anime) return;
    
    // Set current edit ID
    currentEditId = id;
    
    // Populate form
    seriesNameInput.value = anime.name;
    seriesLanguageInput.value = anime.language;
    seriesQualityInput.value = anime.quality;
    seriesPosterInput.value = anime.poster;
    
    // Clear episodes list
    episodesList.innerHTML = '';
    
    // Add episode inputs
    anime.episodes.forEach(episode => {
        addEpisodeInput(episode);
    });
    
    // Update save button text
    savePostBtn.textContent = 'Update Post';
    
    // Scroll to form
    seriesNameInput.scrollIntoView({ behavior: 'smooth' });
}

// Delete post
function deletePost(id) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    // Remove from anime data
    animeData = animeData.filter(anime => anime.id !== id);
    
    // Save to localStorage
    localStorage.setItem('animeData', JSON.stringify(animeData));
    
    // Update UI
    renderPostsList();
    updateDashboardStats();
    
    // Reset form if currently editing this post
    if (currentEditId === id) {
        resetForm();
    }
    
    alert('Post deleted successfully!');
}

// Initialize admin panel
document.addEventListener('DOMContentLoaded', init);
