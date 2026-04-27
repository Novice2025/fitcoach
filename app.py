import os
import sqlite3
from flask import Flask, jsonify, request, make_response, g
from flask_cors import CORS
from weasyprint import HTML

app = Flask(__name__)
CORS(app)  # allows all origins

DATABASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fitcoach.db')

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def init_db():
    db = sqlite3.connect(DATABASE)
    db.execute('''CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        goal TEXT,
        status TEXT DEFAULT 'Active'
    )''')
    db.execute('''CREATE TABLE IF NOT EXISTS workouts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_name TEXT,
        exercise TEXT,
        sets TEXT,
        reps TEXT,
        day TEXT
    )''')
    db.execute('''CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_name TEXT,
        amount TEXT,
        date TEXT,
        status TEXT DEFAULT 'Pending'
    )''')
    db.execute('''CREATE TABLE IF NOT EXISTS schedules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        student_name TEXT,
        date TEXT,
        time TEXT,
        location TEXT
    )''')
    db.commit()
    db.close()

init_db()

@app.route('/', methods=['GET'])
def home():
    return "FitCoach API is running!"

# --- STUDENTS ---
@app.route('/students', methods=['GET'])
def get_students():
    db = get_db()
    rows = db.execute('SELECT * FROM students').fetchall()
    return jsonify([dict(r) for r in rows])

@app.route('/students', methods=['POST'])
def add_student():
    data = request.json
    db = get_db()
    db.execute('INSERT INTO students (name, goal, status) VALUES (?, ?, ?)',
               [data['name'], data.get('goal', ''), data.get('status', 'Active')])
    db.commit()
    return jsonify({"message": "Student added"}), 201

@app.route('/students/<int:sid>', methods=['PUT'])
def update_student(sid):
    data = request.json
    db = get_db()
    db.execute('UPDATE students SET name=?, goal=?, status=? WHERE id=?',
               [data['name'], data.get('goal', ''), data.get('status', 'Active'), sid])
    db.commit()
    return jsonify({"message": "Student updated"})

@app.route('/students/<int:sid>', methods=['DELETE'])
def delete_student(sid):
    db = get_db()
    db.execute('DELETE FROM students WHERE id=?', [sid])
    db.commit()
    return jsonify({"message": "Student deleted"})

# --- WORKOUTS ---
@app.route('/workouts', methods=['GET'])
def get_workouts():
    db = get_db()
    rows = db.execute('SELECT * FROM workouts').fetchall()
    return jsonify([dict(r) for r in rows])

@app.route('/workouts', methods=['POST'])
def add_workout():
    data = request.json
    db = get_db()
    db.execute('INSERT INTO workouts (student_name, exercise, sets, reps, day) VALUES (?, ?, ?, ?, ?)',
               [data['student'], data['exercise'], data['sets'], data['reps'], data['day']])
    db.commit()
    return jsonify({"message": "Workout added"}), 201

@app.route('/workouts/<int:wid>', methods=['PUT'])
def update_workout(wid):
    data = request.json
    db = get_db()
    db.execute('UPDATE workouts SET student_name=?, exercise=?, sets=?, reps=?, day=? WHERE id=?',
               [data['student'], data['exercise'], data['sets'], data['reps'], data['day'], wid])
    db.commit()
    return jsonify({"message": "Workout updated"})

@app.route('/workouts/<int:wid>', methods=['DELETE'])
def delete_workout(wid):
    db = get_db()
    db.execute('DELETE FROM workouts WHERE id=?', [wid])
    db.commit()
    return jsonify({"message": "Workout deleted"})

# --- PAYMENTS ---
@app.route('/payments', methods=['GET'])
def get_payments():
    db = get_db()
    rows = db.execute('SELECT * FROM payments').fetchall()
    return jsonify([dict(r) for r in rows])

@app.route('/payments', methods=['POST'])
def add_payment():
    data = request.json
    db = get_db()
    db.execute('INSERT INTO payments (student_name, amount, date, status) VALUES (?, ?, ?, ?)',
               [data['student'], data['amount'], data['date'], data.get('status', 'Pending')])
    db.commit()
    return jsonify({"message": "Payment added"}), 201

@app.route('/payments/<int:pid>', methods=['PUT'])
def update_payment(pid):
    data = request.json
    db = get_db()
    db.execute('UPDATE payments SET student_name=?, amount=?, date=?, status=? WHERE id=?',
               [data['student'], data['amount'], data['date'], data.get('status', 'Pending'), pid])
    db.commit()
    return jsonify({"message": "Payment updated"})

@app.route('/payments/<int:pid>', methods=['DELETE'])
def delete_payment(pid):
    db = get_db()
    db.execute('DELETE FROM payments WHERE id=?', [pid])
    db.commit()
    return jsonify({"message": "Payment deleted"})

# --- SCHEDULES ---
@app.route('/schedules', methods=['GET'])
def get_schedules():
    db = get_db()
    rows = db.execute('SELECT * FROM schedules').fetchall()
    return jsonify([dict(r) for r in rows])

@app.route('/schedules', methods=['POST'])
def add_schedule():
    data = request.json
    db = get_db()
    db.execute('INSERT INTO schedules (title, student_name, date, time, location) VALUES (?, ?, ?, ?, ?)',
               [data['title'], data['student'], data['date'], data['time'], data['location']])
    db.commit()
    return jsonify({"message": "Schedule added"}), 201

@app.route('/schedules/<int:sid>', methods=['PUT'])
def update_schedule(sid):
    data = request.json
    db = get_db()
    db.execute('UPDATE schedules SET title=?, student_name=?, date=?, time=?, location=? WHERE id=?',
               [data['title'], data['student'], data['date'], data['time'], data['location'], sid])
    db.commit()
    return jsonify({"message": "Schedule updated"})

@app.route('/schedules/<int:sid>', methods=['DELETE'])
def delete_schedule(sid):
    db = get_db()
    db.execute('DELETE FROM schedules WHERE id=?', [sid])
    db.commit()
    return jsonify({"message": "Schedule deleted"})

# --- PDF EXPORT ---
@app.route('/workouts/<int:wid>/pdf', methods=['GET'])
def export_workout_pdf(wid):
    db = get_db()
    row = db.execute('SELECT * FROM workouts WHERE id=?', [wid]).fetchone()
    if not row:
        return jsonify({"message": "Workout not found"}), 404
    workout = dict(row)
    html_content = f"""
    <!DOCTYPE html><html><head><title>Workout Report</title>
    <style>body{{font-family:sans-serif;margin:20mm;}}</style></head>
    <body><h1>Workout Report</h1>
    <p><b>Student:</b> {workout['student_name']}</p>
    <p><b>Exercise:</b> {workout['exercise']}</p>
    <p><b>Sets:</b> {workout['sets']}</p>
    <p><b>Reps:</b> {workout['reps']}</p>
    <p><b>Day:</b> {workout['day']}</p>
    </body></html>
    """
    pdf = HTML(string=html_content).write_pdf()
    response = make_response(pdf)
    response.headers['Content-Type'] = 'application/pdf'
    response.headers['Content-Disposition'] = f'attachment; filename=workout_{wid}.pdf'
    return response

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)