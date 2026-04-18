import os
from flask import Flask, jsonify, request, make_response # make_response foi adicionado aqui
from flask_cors import CORS
from weasyprint import HTML # Adicione esta linha para WeasyPrint

app = Flask(__name__)
# Habilita CORS para todas as rotas, permitindo requisições de localhost:3000 e 127.0.0.1:3000
# Isso é crucial para resolver o erro de CORS que você viu no navegador.
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}})

# Simulado de dados de alunos
students_data = [
    {"id": 1, "name": "Alice Smith", "goal": "Perder Peso", "status": "Ativo"},
    {"id": 2, "name": "Bob Johnson", "goal": "Ganhar Massa", "status": "Inativo"},
    {"id": 3, "name": "Charlie Brown", "goal": "Melhorar Resistência", "status": "Ativo"},
    {"id": 4, "name": "Diana Prince", "goal": "Perder Peso", "status": "Ativo"},
    {"id": 5, "name": "Clark Kent", "goal": "Ganhar Massa", "status": "Ativo"},
    {"id": 6, "name": "Bruce Wayne", "goal": "Definição Muscular", "status": "Inativo"},
]

# Simulado de dados de treinos
workout_logs_data = [
    {"id": 1, "student_id": 1, "student_name": "Alice Smith", "body_part": "Peito", "exercise": "Supino Reto", "sets": 3, "reps": "10-12", "day_of_week": "Segunda-feira", "date": "2026-04-18", "status": "Concluído"},
    {"id": 2, "student_id": 1, "student_name": "Alice Smith", "body_part": "Costas", "exercise": "Remada Curvada", "sets": 3, "reps": "8-10", "day_of_week": "Terça-feira", "date": "2026-04-19", "status": "Pendente"},
    {"id": 3, "student_id": 2, "student_name": "Bob Johnson", "body_part": "Pernas", "exercise": "Agachamento", "sets": 4, "reps": "6-8", "day_of_week": "Quarta-feira", "date": "2026-04-20", "status": "Perdido"},
]

# Simulado de categorias de exercícios
exercise_categories_data = [
    {"id": 1, "name": "Peito"},
    {"id": 2, "name": "Costas"},
    {"id": 3, "name": "Pernas"},
    {"id": 4, "name": "Ombros"},
    {"id": 5, "name": "Braços"},
    {"id": 6, "name": "Abdômen"},
]

# Simulado de exercícios
exercises_data = [
    {"id": 1, "name": "Supino Reto", "category_id": 1, "category_name": "Peito"},
    {"id": 2, "name": "Supino Inclinado", "category_id": 1, "category_name": "Peito"},
    {"id": 3, "name": "Remada Curvada", "category_id": 2, "category_name": "Costas"},
    {"id": 4, "name": "Puxada Alta", "category_id": 2, "category_name": "Costas"},
    {"id": 5, "name": "Agachamento", "category_id": 3, "category_name": "Pernas"},
    {"id": 6, "name": "Leg Press", "category_id": 3, "category_name": "Pernas"},
    {"id": 7, "name": "Desenvolvimento de Ombros", "category_id": 4, "category_name": "Ombros"},
    {"id": 8, "name": "Elevação Lateral", "category_id": 4, "category_name": "Ombros"},
    {"id": 9, "name": "Rosca Direta", "category_id": 5, "category_name": "Braços"},
    {"id": 10, "name": "Tríceps Testa", "category_id": 5, "category_name": "Braços"},
    {"id": 11, "name": "Abdominal Crunch", "category_id": 6, "category_name": "Abdômen"},
]

# Simulado de pagamentos
payments_data = [
    {"id": 1, "student_id": 1, "student_name": "Alice Smith", "amount": 150.00, "date": "2026-04-01", "status": "Pago"},
    {"id": 2, "student_id": 2, "student_name": "Bob Johnson", "amount": 150.00, "date": "2026-04-05", "status": "Pendente"},
]

# --- NOVOS DADOS SIMULADOS PARA PESO E MEDIDAS ---
weight_logs_data = [
    {"id": 1, "student_id": 1, "student_name": "Alice Smith", "date": "2026-04-01", "weight_kg": 60.5, "height_cm": 165, "bmi": 22.2},
    {"id": 2, "student_id": 1, "student_name": "Alice Smith", "date": "2026-05-01", "weight_kg": 59.8, "height_cm": 165, "bmi": 21.9},
    {"id": 3, "student_id": 2, "student_name": "Bob Johnson", "date": "2026-04-15", "weight_kg": 85.0, "height_cm": 180, "bmi": 26.2},
]

# --- NOVOS DADOS SIMULADOS PARA AGENDAMENTOS ---
schedules_data = [
    {"id": 1, "student_id": 1, "student_name": "Alice Smith", "date": "2026-04-25", "time": "10:00", "type": "Treino Personalizado", "status": "Confirmado"},
    {"id": 2, "student_id": 3, "student_name": "Charlie Brown", "date": "2026-04-26", "time": "14:30", "type": "Avaliação Física", "status": "Pendente"},
]


@app.route('/', methods=['GET'])
def home():
    return "Bem-vindo à API FitCoach!"

# --- Rotas de Alunos ---
@app.route('/students', methods=['GET'])
def get_students():
    return jsonify(students_data)

@app.route('/students/<int:student_id>', methods=['GET'])
def get_student(student_id):
    student = next((s for s in students_data if s['id'] == student_id), None)
    if student:
        return jsonify(student)
    return jsonify({"message": "Aluno não encontrado"}), 404

@app.route('/students', methods=['POST'])
def add_student():
    new_student = request.json
    new_student['id'] = len(students_data) + 1
    students_data.append(new_student)
    return jsonify(new_student), 201

@app.route('/students/<int:student_id>', methods=['PUT'])
def update_student(student_id):
    student = next((s for s in students_data if s['id'] == student_id), None)
    if student:
        data = request.json
        student.update(data)
        return jsonify(student)
    return jsonify({"message": "Aluno não encontrado"}), 404

@app.route('/students/<int:student_id>', methods=['DELETE'])
def delete_student(student_id):
    global students_data
    students_data = [s for s in students_data if s['id'] != student_id]
    return jsonify({"message": "Aluno deletado"}), 200

# --- Rotas de Treinos ---
@app.route('/workouts', methods=['GET'])
def get_workouts():
    return jsonify(workout_logs_data)

@app.route('/workouts/<int:workout_id>', methods=['GET'])
def get_workout(workout_id):
    workout = next((w for w in workout_logs_data if w['id'] == workout_id), None)
    if workout:
        return jsonify(workout)
    return jsonify({"message": "Treino não encontrado"}), 404

@app.route('/workouts', methods=['POST'])
def add_workout():
    new_workout = request.json
    new_workout['id'] = len(workout_logs_data) + 1
    # Adiciona o nome do aluno ao log do treino
    student = next((s for s in students_data if s['id'] == new_workout['student_id']), None)
    if student:
        new_workout['student_name'] = student['name']
    else:
        new_workout['student_name'] = "Desconhecido" # Fallback
    workout_logs_data.append(new_workout)
    return jsonify(new_workout), 201

@app.route('/workouts/<int:workout_id>', methods=['PUT'])
def update_workout(workout_id):
    workout = next((w for w in workout_logs_data if w['id'] == workout_id), None)
    if workout:
        data = request.json
        workout.update(data)
        return jsonify(workout)
    return jsonify({"message": "Treino não encontrado"}), 404

@app.route('/workouts/<int:workout_id>', methods=['DELETE'])
def delete_workout(workout_id):
    global workout_logs_data
    workout_logs_data = [w for w in workout_logs_data if w['id'] != workout_id]
    return jsonify({"message": "Treino deletado"}), 200

# --- Rotas de Categorias de Exercícios ---
@app.route('/exercises/categories', methods=['GET'])
def get_exercise_categories():
    return jsonify(exercise_categories_data)

@app.route('/exercises/categories', methods=['POST'])
def add_exercise_category():
    new_category = request.json
    new_category['id'] = len(exercise_categories_data) + 1
    exercise_categories_data.append(new_category)
    return jsonify(new_category), 201

# --- Rotas de Exercícios ---
@app.route('/exercises', methods=['GET'])
def get_exercises():
    return jsonify(exercises_data)

@app.route('/exercises/<int:exercise_id>', methods=['GET'])
def get_exercise(exercise_id):
    exercise = next((e for e in exercises_data if e['id'] == exercise_id), None)
    if exercise:
        return jsonify(exercise)
    return jsonify({"message": "Exercício não encontrado"}), 404

@app.route('/exercises', methods=['POST'])
def add_exercise():
    new_exercise = request.json
    new_exercise['id'] = len(exercises_data) + 1
    # Adiciona o nome da categoria ao exercício
    category = next((c for c in exercise_categories_data if c['id'] == new_exercise['category_id']), None)
    if category:
        new_exercise['category_name'] = category['name']
    else:
        new_exercise['category_name'] = "Desconhecido" # Fallback
    exercises_data.append(new_exercise)
    return jsonify(new_exercise), 201

# --- Rotas de Pagamentos ---
@app.route('/payments', methods=['GET'])
def get_payments():
    return jsonify(payments_data)

@app.route('/payments/<int:payment_id>', methods=['GET'])
def get_payment(payment_id):
    payment = next((p for p in payments_data if p['id'] == payment_id), None)
    if payment:
        return jsonify(payment)
    return jsonify({"message": "Pagamento não encontrado"}), 404

@app.route('/payments', methods=['POST'])
def add_payment():
    new_payment = request.json
    new_payment['id'] = len(payments_data) + 1
    # Adiciona o nome do aluno ao pagamento
    student = next((s for s in students_data if s['id'] == new_payment['student_id']), None)
    if student:
        new_payment['student_name'] = student['name']
    else:
        new_payment['student_name'] = "Desconhecido" # Fallback
    payments_data.append(new_payment)
    return jsonify(new_payment), 201

@app.route('/payments/<int:payment_id>', methods=['PUT'])
def update_payment(payment_id):
    payment = next((p for p in payments_data if p['id'] == payment_id), None)
    if payment:
        data = request.json
        payment.update(data)
        return jsonify(payment)
    return jsonify({"message": "Pagamento não encontrado"}), 404

@app.route('/payments/<int:payment_id>', methods=['DELETE'])
def delete_payment(payment_id):
    global payments_data
    payments_data = [p for p in payments_data if p['id'] != payment_id]
    return jsonify({"message": "Pagamento deletado"}), 200

# --- NOVAS ROTAS DE PESO E MEDIDAS ---
@app.route('/weightlogs', methods=['GET'])
def get_weight_logs():
    return jsonify(weight_logs_data)

@app.route('/weightlogs', methods=['POST'])
def add_weight_log():
    new_log = request.json
    new_log['id'] = len(weight_logs_data) + 1
    student = next((s for s in students_data if s['id'] == new_log['student_id']), None)
    if student:
        new_log['student_name'] = student['name']
    weight_logs_data.append(new_log)
    return jsonify(new_log), 201

# --- NOVAS ROTAS DE AGENDAMENTOS ---
@app.route('/schedules', methods=['GET'])
def get_schedules():
    return jsonify(schedules_data)

@app.route('/schedules', methods=['POST'])
def add_schedule():
    new_schedule = request.json
    new_schedule['id'] = len(schedules_data) + 1
    student = next((s for s in students_data if s['id'] == new_schedule['student_id']), None)
    if student:
        new_schedule['student_name'] = student['name']
    schedules_data.append(new_schedule)
    return jsonify(new_schedule), 201

# --- Nova Rota para Exportar Treino em PDF ---
@app.route('/workouts/<int:workout_id>/pdf', methods=['GET'])
def export_workout_pdf(workout_id):
    workout = next((w for w in workout_logs_data if w['id'] == workout_id), None)
    if not workout:
        return jsonify({"message": "Treino não encontrado"}), 404

    # Gerar conteúdo HTML para o PDF
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Relatório de Treino - {workout['student_name']}</title>
        <style>
            body {{ font-family: sans-serif; margin: 20mm; }}
            h1 {{ color: #333; text-align: center; }}
            h2 {{ color: #555; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 20px; }}
            p {{ margin-bottom: 5px; }}
            .detail-label {{ font-weight: bold; }}
            .workout-details {{ margin-top: 15px; border: 1px solid #ddd; padding: 15px; border-radius: 5px; }}
            .footer {{ text-align: center; margin-top: 40px; font-size: 0.8em; color: #777; }}
        </style>
    </head>
    <body>
        <h1>Relatório de Treino</h1>
        <p>Gerado em: {workout['date']}</p>

        <h2>Detalhes do Aluno</h2>
        <p><span class="detail-label">Nome:</span> {workout['student_name']}</p>
        <p><span class="detail-label">ID do Aluno:</span> {workout['student_id']}</p>

        <h2>Detalhes do Treino</h2>
        <div class="workout-details">
            <p><span class="detail-label">Parte do Corpo:</span> {workout['body_part']}</p>
            <p><span class="detail-label">Exercício:</span> {workout['exercise']}</p>
            <p><span class="detail-label">Séries:</span> {workout['sets']}</p>
            <p><span class="detail-label">Repetições:</span> {workout['reps']}</p>
            <p><span class="detail-label">Dia da Semana:</span> {workout['day_of_week']}</p>
            <p><span class="detail-label">Data:</span> {workout['date']}</p>
            <p><span class="detail-label">Status:</span> {workout['status']}</p>
        </div>

        <div class="footer">
            Relatório gerado pela API FitCoach.
        </div>
    </body>
    </html>
    """

    # Gerar o PDF a partir do HTML
    pdf = HTML(string=html_content).write_pdf()

    # Retornar o PDF como um arquivo para download
    response = make_response(pdf) # make_response foi importado no início
    response.headers['Content-Type'] = 'application/pdf'
    response.headers['Content-Disposition'] = f'attachment; filename=treino_{workout_id}_{workout["student_name"].replace(" ", "_")}.pdf'
    return response


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)