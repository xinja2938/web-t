// Data storage
let animeData = [];
let myList = [];
let currentUser = null;
let currentAnime = null;

// DOM Elements
const authScreen = document.getElementById('auth-screen');
const mainContent = document.getElementById('main-content');
const loginForm = document.getElementById('login-form');
const loginName = document.getElementById('login-name');
const loginEmail = document.getElementById('login-email');
const searchInput = document.getElementById('search-input');
const searchIcon = document.getElementById('search-button');
const homeContent = document.getElementById('home-content');
const allContent = document.getElementById('all-content');
const myListContent = document.getElementById('my-list-content');
const profileContent = document.getElementById('profile-content');
const detailPage = document.getElementById('detail-page');
const navItems = document.querySelectorAll('.nav-item');
const seeAllLinks = document.querySelectorAll('.see-all');
const backButton = document.getElementById('back-button');
const favoriteButton = document.getElementById('favorite-button');
const logoutBtn = document.getElementById('logout-btn');
const profileName = document.getElementById('profile-name');
const profileEmail = document.getElementById('profile-email');

// Initialize the application
function init() {
    loadData();
    setupEventListeners();
    checkLoggedInStatus();
}

// Load data from localStorage
function loadData() {
    // Load anime data
    const storedAnimeData = localStorage.getItem('animeData');
    if (storedAnimeData) {
        animeData = JSON.parse(storedAnimeData);
    } else {
        // If no data exists, initialize with sample data
        animeData = getSampleData();
        localStorage.setItem('animeData', JSON.stringify(animeData));
    }

    // Load my list
    const storedMyList = localStorage.getItem('myList');
    if (storedMyList) {
        myList = JSON.parse(storedMyList);
    }

    // Load user data
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
    }
}

// Sample data for initial load
function getSampleData() {
    return [
        {
            id: 1,
            title: "Demon Lord 2099 Hindi Dub",
            name: "Demon Lord 2099 (Maou 2099)",
            language: "Hindi Dub",
            quality: "SD",
            poster: "https://i.imgur.com/tAB0BHJ.jpg",
            episodes: [
                { id: 1, number: 1, link: "https://example.com/watch/demon-lord-2099-ep1" },
                { id: 2, number: 2, link: "https://example.com/watch/demon-lord-2099-ep2" },
                { id: 3, number: 3, link: "https://example.com/watch/demon-lord-2099-ep3" },
                { id: 4, number: 4, link: "https://example.com/watch/demon-lord-2099-ep4" },
                { id: 5, number: 5, link: "https://example.com/watch/demon-lord-2099-ep5" },
                { id: 6, number: 6, link: "https://example.com/watch/demon-lord-2099-ep6" },
                { id: 7, number: 7, link: "https://example.com/watch/demon-lord-2099-ep7" },
                { id: 8, number: 8, link: "https://example.com/watch/demon-lord-2099-ep8" },
                { id: 9, number: 9, link: "https://example.com/watch/demon-lord-2099-ep9" },
                { id: 10, number: 10, link: "https://example.com/watch/demon-lord-2099-ep10" },
                { id: 11, number: 11, link: "https://example.com/watch/demon-lord-2099-ep11", isNew: true },
                { id: 12, number: 12, link: "https://example.com/watch/demon-lord-2099-ep12", isFinale: true }
            ],
            clicks: 120,
            favorites: 45,
            date: "2023-05-15"
        },
        {
            id: 2,
            title: "One Piece Hindi Dub",
            name: "One Piece",
            language: "Hindi Dub",
            quality: "HD",
            poster: "https://i.imgur.com/uLGLPla.jpg",
            episodes: [
                { id: 1, number: 1, link: "https://example.com/watch/one-piece-ep1" },
                { id: 2, number: 2, link: "https://example.com/watch/one-piece-ep2" }
            ],
            clicks: 350,
            favorites: 120,
            date: "2023-05-10"
        },
        {
            id: 3,
            title: "Fullmetal Alchemist Brotherhood Hindi Dub",
            name: "Fullmetal Alchemist Brotherhood",
            language: "Hindi Dub",
            quality: "HD",
            poster: "https://i.imgur.com/qJBGjTJ.jpg",
            episodes: [
                { id: 1, number: 1, link: "https://example.com/watch/fma-brotherhood-ep1" },
                { id: 2, number: 2, link: "https://example.com/watch/fma-brotherhood-ep2" }
            ],
            clicks: 280,
            favorites: 95,
            date: "2023-05-05"
        },
        {
            id: 4,
            title: "Hunter x Hunter Hindi Dub",
            name: "Hunter x Hunter",
            language: "Hindi Dub",
            quality: "HD",
            poster: "https://i.imgur.com/EteYLeA.jpg",
            episodes: [
                { id: 1, number: 1, link: "https://example.com/watch/hunter-x-hunter-ep1" },
                { id: 2, number: 2, link: "https://example.com/watch/hunter-x-hunter-ep2" }
            ],
            clicks: 230,
            favorites: 85,
            date: "2023-05-01"
        }
    ];
}

// Set up event listeners
function setupEventListeners() {
    // Login form submit
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (loginName.value.trim() === '' || loginEmail.value.trim() === '') {
            alert('Please enter your name and email');
            return;
        }
        
        // Create user object
        currentUser = {
            name: loginName.value.trim(),
            email: loginEmail.value.trim()
        };
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Show main content
        authScreen.style.display = 'none';
        mainContent.style.display = 'block';
        
        // Update profile info
        profileName.textContent = currentUser.name;
        profileEmail.textContent = currentUser.email;
        
        // Load home content
        renderHome();
    });

    // Navigation items click
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all nav items
            navItems.forEach(navItem => navItem.classList.remove('active'));
            
            // Add active class to clicked nav item
            item.classList.add('active');
            
            // Get target content to show
            const target = item.getAttribute('data-target');
            showContent(target);
        });
    });

    // See All links click
    seeAllLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Set All nav item as active
            navItems.forEach(navItem => navItem.classList.remove('active'));
            document.querySelector('.nav-item[data-target="all"]').classList.add('active');
            
            // Show all content
            showContent('all');
        });
    });

    // Back button click
    backButton.addEventListener('click', () => {
        detailPage.style.display = 'none';
        
        // Show previous content based on active nav item
        const activeNavItem = document.querySelector('.nav-item.active');
        const target = activeNavItem.getAttribute('data-target');
        showContent(target);
    });

    // Favorite button click
    favoriteButton.addEventListener('click', () => {
        if (!currentAnime) return;
        
        const isFavorite = myList.some(item => item.id === currentAnime.id);
        
        if (isFavorite) {
            // Remove from favorites
            myList = myList.filter(item => item.id !== currentAnime.id);
            favoriteButton.innerHTML = '<i class="far fa-heart"></i>';
            
            // Update anime data
            const animeIndex = animeData.findIndex(anime => anime.id === currentAnime.id);
            if (animeIndex !== -1) {
                animeData[animeIndex].favorites--;
            }
        } else {
            // Add to favorites
            myList.push(currentAnime);
            favoriteButton.innerHTML = '<i class="fas fa-heart"></i>';
            
            // Update anime data
            const animeIndex = animeData.findIndex(anime => anime.id === currentAnime.id);
            if (animeIndex !== -1) {
                animeData[animeIndex].favorites++;
            }
        }
        
        // Save to localStorage
        localStorage.setItem('myList', JSON.stringify(myList));
        localStorage.setItem('animeData', JSON.stringify(animeData));
        
        // Refresh contents
        renderHome();
        renderAll();
        renderMyList();
    });

    // Search input
    searchInput.addEventListener('input', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Search icon click
    searchIcon.addEventListener('click', performSearch);

    // Logout button click
    logoutBtn.addEventListener('click', () => {
        // Clear user data
        currentUser = null;
        localStorage.removeItem('currentUser');
        
        // Reset form fields
        loginName.value = '';
        loginEmail.value = '';
        
        // Show auth screen
        mainContent.style.display = 'none';
        authScreen.style.display = 'flex';
    });
}

// Perform search
function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm.length > 0) {
        // Filter anime data based on search term
        const filteredAnime = animeData.filter(anime => 
            anime.title.toLowerCase().includes(searchTerm) || 
            anime.name.toLowerCase().includes(searchTerm)
        );
        
        // Show all content with filtered results
        renderAll(filteredAnime);
        showContent('all');
        
        // Highlight the "All" nav item
        navItems.forEach(navItem => navItem.classList.remove('active'));
        document.querySelector('.nav-item[data-target="all"]').classList.add('active');
    } else {
        // If search is empty, show normal content
        renderAll();
        const activeNavItem = document.querySelector('.nav-item.active');
        const target = activeNavItem.getAttribute('data-target');
        showContent(target);
    }
}

// Check if user is logged in
function checkLoggedInStatus() {
    if (currentUser) {
        // Update profile info
        profileName.textContent = currentUser.name;
        profileEmail.textContent = currentUser.email;
        
        // Show main content
        authScreen.style.display = 'none';
        mainContent.style.display = 'block';
        
        // Load home content
        renderHome();
    } else {
        // Show login screen
        authScreen.style.display = 'flex';
        mainContent.style.display = 'none';
    }
}

// Show specific content
function showContent(target) {
    // Hide all content
    homeContent.style.display = 'none';
    allContent.style.display = 'none';
    myListContent.style.display = 'none';
    profileContent.style.display = 'none';
    detailPage.style.display = 'none';
    
    // Show target content
    switch(target) {
        case 'home':
            homeContent.style.display = 'block';
            break;
        case 'all':
            allContent.style.display = 'block';
            break;
        case 'my-list':
            renderMyList();
            myListContent.style.display = 'block';
            break;
        case 'profile':
            profileContent.style.display = 'block';
            break;
    }
}

// Render home content
function renderHome() {
    // Sort anime data
    const sortedByDate = [...animeData].sort((a, b) => new Date(b.date) - new Date(a.date));
    const sortedByFavorites = [...animeData].sort((a, b) => b.favorites - a.favorites);
    const sortedByClicks = [...animeData].sort((a, b) => b.clicks - a.clicks);
    
    // Render new episodes (latest by date)
    renderSection('new-episodes', sortedByDate.slice(0, 3));
    
    // Render most favorite (most by favorites and clicks)
    renderSection('most-favorite', sortedByClicks.slice(0, 3));
    
    // Render best episodes (most by favorites)
    renderSection('best-ep', sortedByFavorites.slice(0, 3));
}

// Render a section of anime cards
function renderSection(sectionId, animeList) {
    const section = document.getElementById(sectionId);
    section.innerHTML = '';
    
    animeList.forEach(anime => {
        const card = createAnimeCard(anime);
        section.appendChild(card);
    });
}

// Create an anime card element
function createAnimeCard(anime) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<img src="${anime.poster}" alt="${anime.title}">`;
    
    // Add click event to show detail page
    card.addEventListener('click', () => {
        showAnimeDetail(anime);
    });
    
    return card;
}

// Render all anime
function renderAll(filteredList = null) {
    const allPostsContainer = document.getElementById('all-posts');
    allPostsContainer.innerHTML = '';
    
    const animeList = filteredList || [...animeData].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    animeList.forEach(anime => {
        const card = createAnimeCard(anime);
        allPostsContainer.appendChild(card);
    });
}

// Render my list
function renderMyList() {
    const myListContainer = document.getElementById('my-list-posts');
    myListContainer.innerHTML = '';
    
    if (myList.length === 0) {
        // Create beautiful empty list UI
        const emptyListContainer = document.createElement('div');
        emptyListContainer.className = 'empty-list-container';
        
        emptyListContainer.innerHTML = `
            <div class="empty-list-icon">
                <i class="fas fa-heart-broken"></i>
            </div>
            <h3 class="empty-list-title">Your list is empty</h3>
            <p class="empty-list-message">Add a post to your list by clicking the heart icon on any anime.</p>
        `;
        
        myListContainer.appendChild(emptyListContainer);
        return;
    }
    
    myList.forEach(anime => {
        const card = createAnimeCard(anime);
        myListContainer.appendChild(card);
    });
}

// Show anime detail page
function showAnimeDetail(anime) {
    currentAnime = anime;
    
    // Update anime clicks
    const animeIndex = animeData.findIndex(item => item.id === anime.id);
    if (animeIndex !== -1) {
        animeData[animeIndex].clicks++;
        localStorage.setItem('animeData', JSON.stringify(animeData));
    }
    
    // Update detail page elements
    document.getElementById('detail-poster').src = anime.poster;
    document.getElementById('detail-title').textContent = anime.title;
    document.getElementById('detail-name').textContent = anime.name;
    document.getElementById('detail-language').textContent = anime.language;
    document.getElementById('detail-quality').textContent = anime.quality;
    
    // Check if anime is in favorites
    const isFavorite = myList.some(item => item.id === anime.id);
    favoriteButton.innerHTML = isFavorite ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
    
    // Render episodes
    const episodesContainer = document.getElementById('episodes-container');
    episodesContainer.innerHTML = '';
    
    anime.episodes.forEach(episode => {
        const episodeButton = document.createElement('button');
        episodeButton.className = 'episode-button';
        episodeButton.textContent = `Ep ${episode.number}`;
        
        // Add new or finale class if needed
        if (episode.isNew) {
            episodeButton.classList.add('new');
        } else if (episode.isFinale) {
            episodeButton.classList.add('finale');
        }
        
        // Add click event to open episode link
        episodeButton.addEventListener('click', () => {
            window.open(episode.link, '_blank');
        });
        
        episodesContainer.appendChild(episodeButton);
    });
    
    // Show detail page
    homeContent.style.display = 'none';
    allContent.style.display = 'none';
    myListContent.style.display = 'none';
    profileContent.style.display = 'none';
    detailPage.style.display = 'block';
}

// Initialize app
document.addEventListener('DOMContentLoaded', init);
