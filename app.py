from flask import Flask, render_template

app = Flask(__name__)

# Заглушка данных для примеров
APPOINTMENTS = [
    {"time": "10:00", "pet": "Барсик", "owner": "Иван Петров", "status": "Ожидается"},
    {"time": "14:30", "pet": "Мурка", "owner": "Анна Сидорова", "status": "Завершен"},
]

PETS = [
    {"name": "Барсик", "type": "Кот", "last_visit": "2023-10-01"},
    {"name": "Шарик", "type": "Собака", "last_visit": "2023-09-25"},
]

@app.route('/')
def home():
    return render_template('index.html', appointments=APPOINTMENTS, pets=PETS)

@app.route('/search')
def search():
    return render_template('search.html')

@app.route('/chat')
def chat():
    return render_template('chat.html')

if __name__ == '__main__':
    app.run(debug=True)