// Sidebar toggle functionality with improved state management
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mobileToggle = document.getElementById('mobileToggle');
    
    // Initialize sidebar state manager
    const SidebarManager = {
        // Key for localStorage
        STORAGE_KEY: 'sidebarState',
        
        // Get current state with defaults
        getState() {
            try {
                const savedState = localStorage.getItem(this.STORAGE_KEY);
                return savedState ? JSON.parse(savedState) : { collapsed: false, timestamp: Date.now() };
            } catch (e) {
                console.error('Error reading sidebar state:', e);
                return { collapsed: false, timestamp: Date.now() };
            }
        },
        
        // Save current state
        saveState(isCollapsed) {
            try {
                const state = {
                    collapsed: isCollapsed,
                    timestamp: Date.now()
                };
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
            } catch (e) {
                console.error('Error saving sidebar state:', e);
            }
        },
        
        // Apply state to DOM without animations
        applyStateWithoutAnimation(state) {
            if (!sidebar || !mainContent) return;
            
            // Disable transitions temporarily
            sidebar.style.transition = 'none';
            mainContent.style.transition = 'none';
            
            // Apply state
            this.updateDOM(state.collapsed);
            
            // Force reflow to ensure transitions are disabled
            void sidebar.offsetWidth;
            
            // Re-enable transitions after a short delay
            setTimeout(() => {
                sidebar.style.transition = '';
                mainContent.style.transition = '';
            }, 50);
        },
        
        // Update DOM elements based on collapsed state
        updateDOM(isCollapsed) {
            if (isCollapsed) {
                sidebar.classList.add('collapsed');
                mainContent.classList.add('expanded');
                if (sidebarToggle) {
                    const toggleIcon = sidebarToggle.querySelector('i');
                    if (toggleIcon) {
                        toggleIcon.classList.remove('fa-chevron-left');
                        toggleIcon.classList.add('fa-chevron-right');
                    }
                }
            } else {
                sidebar.classList.remove('collapsed');
                mainContent.classList.remove('expanded');
                if (sidebarToggle) {
                    const toggleIcon = sidebarToggle.querySelector('i');
                    if (toggleIcon) {
                        toggleIcon.classList.remove('fa-chevron-right');
                        toggleIcon.classList.add('fa-chevron-left');
                    }
                }
            }
        },
        
        // Toggle sidebar state with animation
        toggleState() {
            if (!sidebar) return;
            
            const newState = !sidebar.classList.contains('collapsed');
            this.updateDOM(newState);
            this.saveState(newState);
        }
    };
    
    // Initialize sidebar on page load
    if (sidebar && mainContent) {
        const state = SidebarManager.getState();
        SidebarManager.applyStateWithoutAnimation(state);
        
        // Add resize observer to handle responsive adjustments
        const resizeObserver = new ResizeObserver(entries => {
            if (window.innerWidth < 768 && state.collapsed) {
                // On small screens, always show full sidebar when toggling
                sidebar.classList.remove('collapsed');
            }
        });
        
        resizeObserver.observe(document.body);
    }
    
    // Desktop sidebar toggle with improved click handling
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            SidebarManager.toggleState();
        });
    }
    
    // Mobile sidebar toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function(e) {
            e.preventDefault();
            sidebar.classList.toggle('show');
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        const isMobile = window.innerWidth < 768;
        if (isMobile && sidebar && sidebar.classList.contains('show') && 
            !sidebar.contains(event.target) && 
            event.target !== mobileToggle) {
            sidebar.classList.remove('show');
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768 && sidebar) {
            sidebar.classList.remove('show');
        }
    });
});

// Обработка поиска
const searchForm = document.getElementById('searchForm');
if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const petName = document.getElementById('petName').value.toLowerCase();
        const ownerName = document.getElementById('ownerName').value.toLowerCase();
        
        // Фильтрация (заглушка)
        const rows = document.querySelectorAll('#searchResults tbody tr');
        rows.forEach(row => {
            const rowPet = row.cells[0].textContent.toLowerCase();
            const rowOwner = row.cells[2].textContent.toLowerCase();
            row.style.display = (rowPet.includes(petName) && rowOwner.includes(ownerName)) ? '' : 'none';
        });
    });
}

// Логика чата
const sendButton = document.getElementById('sendButton');
const messageInput = document.getElementById('messageInput');
if (sendButton && messageInput) {
    sendButton.addEventListener('click', function() {
        if (messageInput.value.trim() === '') return;

        // Добавление сообщения (заглушка)
        const chatContainer = document.getElementById('chatMessages');
        const newMessage = document.createElement('div');
        newMessage.className = 'message outgoing';
        newMessage.innerHTML = `
            <div class="message-header">
                <span class="sender">Ветеринар</span>
                <small class="text-muted ms-2">Только что</small>
            </div>
            <div class="message-body">${messageInput.value}</div>
        `;
        chatContainer.appendChild(newMessage);
        messageInput.value = '';
        
        // Автоскролл к новому сообщению
        chatContainer.scrollTop = chatContainer.scrollHeight;
    });
    
    // Отправка сообщения по нажатию Enter
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });
}