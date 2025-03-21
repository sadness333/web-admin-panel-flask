// Инициализация Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT.firebaseio.com",
    projectId: "YOUR_PROJECT",
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Загрузка данных на главной
function loadAppointments() {
    const ref = database.ref('appointments');
    ref.on('value', (snapshot) => {
        const data = snapshot.val();
        let rows = '';
        for (let key in data) {
            rows += `
                <tr>
                    <td>${data[key].time}</td>
                    <td>${data[key].pet}</td>
                    <td>${data[key].owner}</td>
                    <td><span class="badge bg-warning">${data[key].status}</span></td>
                </tr>
            `;
        }
        document.querySelector('#appointments-table tbody').innerHTML = rows;
    });
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', loadAppointments);