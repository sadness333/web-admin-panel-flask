from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO
import datetime

app = Flask(__name__)
socketio = SocketIO(app)

# Текущая дата
current_date = datetime.datetime.now().strftime("%d %B %Y")

# Заглушки данных
APPOINTMENTS = [
    {"time": "09:00", "pet": "Барсик", "owner": "Иван Петров", "reason": "Вакцинация", "status": "Ожидается"},
    {"time": "10:30", "pet": "Шарик", "owner": "Мария Иванова", "reason": "Осмотр", "status": "Ожидается"},
    {"time": "12:00", "pet": "Рекс", "owner": "Алексей Смирнов", "reason": "Травма лапы", "status": "Ожидается"},
    {"time": "14:30", "pet": "Мурка", "owner": "Анна Сидорова", "reason": "Стерилизация", "status": "Завершен"},
    {"time": "16:00", "pet": "Пушок", "owner": "Елена Козлова", "reason": "Аллергия", "status": "Отменен"},
]

PETS = [
    {"name": "Барсик", "type": "Кот", "age": "3 года", "owner": "Иван Петров", "last_visit": "2023-10-01", "status": "Здоров", "photo": "https://via.placeholder.com/150"},
    {"name": "Мурка", "type": "Кошка", "age": "2 года", "owner": "Анна Сидорова", "last_visit": "2023-10-15", "status": "На лечении", "photo": "https://via.placeholder.com/150"},
    {"name": "Шарик", "type": "Собака", "age": "5 лет", "owner": "Мария Иванова", "last_visit": "2023-09-25", "status": "Здоров", "photo": "https://via.placeholder.com/150"},
    {"name": "Рекс", "type": "Собака", "age": "7 лет", "owner": "Алексей Смирнов", "last_visit": "2023-10-10", "status": "На лечении", "photo": "https://via.placeholder.com/150"},
]

CHAT_MESSAGES = [
    {"sender": "Клиент", "text": "Здравствуйте, у кота температура!", "time": "10:15"},
    {"sender": "Ветеринар", "text": "Добрый день! Какая температура у питомца?", "time": "10:18"},
    {"sender": "Клиент", "text": "39.5", "time": "10:20"},
    {"sender": "Ветеринар", "text": "Это повышенная температура для кошки. Нужно срочно показать врачу. Можете привезти сегодня?", "time": "10:22"},
    {"sender": "Клиент", "text": "Да, сможем приехать к 14:00", "time": "10:25"},
    {"sender": "Ветеринар", "text": "Отлично, записал вас на 14:00. Пожалуйста, не кормите кота за 3 часа до приема.", "time": "10:28"},
]

@app.route('/')
def home():
    return render_template('index.html', appointments=APPOINTMENTS, pets=PETS, current_date=current_date)

@app.route('/appointments')
def appointments():
    return render_template('appointments.html', appointments=APPOINTMENTS, current_date=current_date)

@app.route('/patients')
def patients():
    return render_template('patients.html', pets=PETS)

@app.route('/search')
def search():
    return render_template('search.html', pets=PETS)

@app.route('/chat')
def chat():
    return render_template('chat.html', messages=CHAT_MESSAGES)

@app.route('/settings')
def settings():
    return render_template('settings.html')

# API для чата
@app.route('/api/messages', methods=['POST'])
def send_message():
    data = request.json
    message = {
        'sender': 'Ветеринар',
        'text': data.get('text', ''),
        'time': datetime.datetime.now().strftime("%H:%M")
    }
    # В реальном приложении здесь будет сохранение сообщения в базу данных
    CHAT_MESSAGES.append(message)
    # Отправка сообщения через WebSocket
    socketio.emit('new_message', message)
    return jsonify(message)

# WebSocket для чата
@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('message')
def handle_message(data):
    message = {
        'sender': data.get('sender', 'Клиент'),
        'text': data.get('text', ''),
        'time': datetime.datetime.now().strftime("%H:%M")
    }
    CHAT_MESSAGES.append(message)
    socketio.emit('new_message', message)

if __name__ == '__main__':
    socketio.run(app, debug=True)