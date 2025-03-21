from flask import Flask, render_template
import firebase_admin
from firebase_admin import credentials, db

app = Flask(__name__)

# Инициализация Firebase
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://mypolka-4cf39-default-rtdb.firebaseio.com/'
})

@app.route('/')
def home():
    ref = db.reference('appointments')
    appointments = ref.get()
    return render_template('dashboard.html', appointments=appointments)

@app.route('/search')
def search():
    return render_template('search.html')

@app.route('/chat')
def chat():
    return render_template('chat.html')

if __name__ == '__main__':
    app.run(debug=True)