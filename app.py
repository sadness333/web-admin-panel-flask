from flask import Flask, render_template

app = Flask(__name__)

# Заглушки данных
APPOINTMENTS = [
    {"time": "10:00", "pet": "Барсик", "owner": "Иван Петров", "status": "Ожидается"},
    {"time": "14:30", "pet": "Мурка", "owner": "Анна Сидорова", "status": "Завершен"},
]

PETS = [
    {"name": "Барсик", "type": "Кот", "last_visit": "2023-10-01", "photo": "https://via.placeholder.com/150"},
    {"name": "Шарик", "type": "Собака", "last_visit": "2023-09-25", "photo": "https://via.placeholder.com/150"},
]

CHAT_MESSAGES = [
    {"sender": "Клиент", "text": "Здравствуйте, у кота температура!", "time": "10:15"},
    {"sender": "Ветеринар", "text": "Привезите на осмотр", "time": "10:20"},
]

@app.route('/')
def home():
    return render_template('index.html', appointments=APPOINTMENTS, pets=PETS)

@app.route('/search')
def search():
    return render_template('search.html', pets=PETS)

@app.route('/chat')
def chat():
    return render_template('chat.html', messages=CHAT_MESSAGES)

if __name__ == '__main__':
    app.run(debug=True)