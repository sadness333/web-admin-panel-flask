document.getElementById('sidebarToggle').addEventListener('click', function() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('collapsed');
    
    const icon = this.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-chevron-right');
});

// Обработка поиска
document.getElementById('searchForm').addEventListener('submit', function(e) {
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

// Логика чата
document.getElementById('sendButton').addEventListener('click', function() {
    const input = document.getElementById('messageInput');
    if (input.value.trim() === '') return;

    // Добавление сообщения (заглушка)
    const chatContainer = document.getElementById('chatMessages');
    const newMessage = document.createElement('div');
    newMessage.className = 'message outgoing';
    newMessage.innerHTML = `
        <div class="message-header">
            <span class="sender">Ветеринар</span>
            <small class="text-muted ms-2">Только что</small>
        </div>
        <div class="message-body">${input.value}</div>
    `;
    chatContainer.appendChild(newMessage);
    input.value = '';
    
    // Автоскролл к новому сообщению
    chatContainer.scrollTop = chatContainer.scrollHeight;
});