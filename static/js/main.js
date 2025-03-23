// Sidebar toggle functionality with improved state management
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.getElementById('mainContent');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mobileToggle = document.getElementById('mobileToggle');
    
    // Если элементы не найдены, выходим из функции
    if (!sidebar) return;
    
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
            if (mainContent) mainContent.style.transition = 'none';
            
            // Apply state
            this.updateDOM(state.collapsed);
            
            // Force reflow to ensure transitions are disabled
            void sidebar.offsetWidth;
            
            // Re-enable transitions after a short delay
            setTimeout(() => {
                sidebar.style.transition = '';
                if (mainContent) mainContent.style.transition = '';
            }, 50);
        },
        
        // Update DOM elements based on collapsed state
        updateDOM(isCollapsed) {
            if (isCollapsed) {
                sidebar.classList.add('collapsed');
                if (mainContent) mainContent.classList.add('expanded');
                if (sidebarToggle) {
                    const toggleIcon = sidebarToggle.querySelector('i');
                    if (toggleIcon) {
                        toggleIcon.classList.remove('fa-chevron-left');
                        toggleIcon.classList.add('fa-chevron-right');
                    }
                }
            } else {
                sidebar.classList.remove('collapsed');
                if (mainContent) mainContent.classList.remove('expanded');
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
    if (sidebar) {
        const state = SidebarManager.getState();
        SidebarManager.applyStateWithoutAnimation(state);
        
        // Add resize observer to handle responsive adjustments
        const resizeObserver = new ResizeObserver(entries => {
            if (window.innerWidth < 768 && sidebar.classList.contains('collapsed')) {
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
document.addEventListener('DOMContentLoaded', function() {
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
});

// Логика чата
document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chatMessages');
    const sendButton = document.getElementById('sendButton');
    const messageInput = document.getElementById('messageInput');
    
    if (chatMessages) {
        // Прокрутка чата вниз при загрузке
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    if (sendButton && messageInput) {
        // Функция отправки сообщения
        function sendMessage() {
            const messageText = messageInput.value.trim();
            if (messageText === '') return;
            
            // Создание нового сообщения в UI
            const newMessage = document.createElement('div');
            newMessage.className = 'message outgoing';
            newMessage.innerHTML = `
                <div class="message-header">
                    <span class="sender">Ветеринар</span>
                    <small class="text-muted ms-2">Только что</small>
                </div>
                <div class="message-body">${messageText}</div>
            `;
            
            // Добавление сообщения в чат
            chatMessages.appendChild(newMessage);
            
            // Отправка на сервер через API
            fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: messageText }),
            })
            .then(response => response.json())
            .catch(error => console.error('Error sending message:', error));
            
            // Очистка поля ввода
            messageInput.value = '';
            
            // Прокрутка чата вниз
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        // Обработчики событий
        sendButton.addEventListener('click', sendMessage);
        
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        // Быстрые ответы
        const quickReplies = document.querySelectorAll('.quick-reply');
        if (quickReplies) {
            quickReplies.forEach(button => {
                button.addEventListener('click', function() {
                    messageInput.value = this.textContent;
                    sendMessage();
                });
            });
        }
    }
    
    // Переключение между контактами
    const chatContacts = document.querySelectorAll('.chat-contact');
    if (chatContacts) {
        chatContacts.forEach(contact => {
            contact.addEventListener('click', function() {
                document.querySelectorAll('.chat-contact').forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                
                // В реальном приложении здесь будет загрузка истории сообщений для выбранного контакта
                console.log('Выбран контакт:', this.dataset.contact);
            });
        });
    }
    
    // Поиск контактов
    const contactSearch = document.getElementById('contactSearch');
    if (contactSearch) {
        contactSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            document.querySelectorAll('.chat-contact').forEach(contact => {
                const name = contact.querySelector('h6').textContent.toLowerCase();
                const pet = contact.querySelector('p').textContent.toLowerCase();
                
                if (name.includes(searchTerm) || pet.includes(searchTerm)) {
                    contact.style.display = '';
                } else {
                    contact.style.display = 'none';
                }
            });
        });
    }
});

// Проверка авторизации
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            
            // Отправка данных авторизации
            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    username: username, 
                    password: password,
                    remember_me: rememberMe
                }),
            })
            .then(response => {
                if (response.ok) {
                    // Перенаправление на главную страницу без параметра next
                    window.location.href = '/';
                } else {
                    return response.json().then(data => {
                        throw new Error(data.message || 'Ошибка авторизации');
                    });
                }
            })
            .catch(error => {
                const errorAlert = document.getElementById('loginError');
                if (errorAlert) {
                    errorAlert.textContent = error.message;
                    errorAlert.classList.remove('d-none');
                }
            });
        });
    }
});