import React, { useState, useEffect, useMemo, useCallback } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import styles from './Workouts.module.css';
import { requestJson, deleteWorkout, updateWorkout, fetchExerciseCategories } from '../../lib/api';

// Opções de Repetições
const repsOptions = [
  "6-8", "8-10", "10-12", "12-15", "15-20", "20+"
];

// Opções de Dia da Semana
const dayOfWeekOptions = [
  "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira",
  "Sexta-feira", "Sábado", "Domingo"
];

// Opções de Status
const statusOptions = [
  "Pendente", "Concluído", "Perdido", "Reagendado"
];

export default function Workouts() {
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [students, setStudents] = useState([]);
  const [exerciseCategories, setExerciseCategories] = useState([]); // Inicializado como array vazio
  const [exercises, setExercises] = useState([]); // All exercises
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Form states for adding new workout
  const [selectedStudentName, setSelectedStudentName] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState('');
  const [selectedExercise, setSelectedExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState(statusOptions[0]);

  // Form states for managing categories and exercises
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newExerciseName, setNewExerciseName] = useState('');
  const [selectedCategoryForNewExercise, setSelectedCategoryForNewExercise] = useState('');

  // State for editing workouts
  const [editingWorkoutId, setEditingWorkoutId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Fetch Students
  const fetchStudents = useCallback(async () => {
    try {
      const data = await requestJson('/students');
      setStudents(data);
    } catch (err) {
      console.error("Erro ao buscar alunos:", err);
      setError("Erro ao carregar alunos.");
    }
  }, []);

  // Fetch Workout Logs
  const fetchWorkoutLogs = useCallback(async () => {
    try {
      const data = await requestJson('/workouts');
      setWorkoutLogs(data);
    } catch (err) {
      console.error("Erro ao buscar treinos:", err);
      setError("Erro ao carregar treinos.");
    }
  }, []);

  // Fetch Exercise Categories
  const fetchExerciseCategoriesData = useCallback(async () => {
    try {
      const data = await fetchExerciseCategories();
      // Garante que data é um array antes de definir o estado
      setExerciseCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao buscar categorias de exercícios:", err);
      setError("Erro ao carregar categorias de exercícios.");
      setExerciseCategories([]); // Garante que seja um array vazio em caso de erro
    }
  }, []);

  // Fetch Exercises
  const fetchExercises = useCallback(async () => {
    try {
      const data = await requestJson('/exercises'); // Assuming a route to get all exercises
      // Garante que data é um array antes de definir o estado
      setExercises(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao buscar exercícios:", err);
      setError("Erro ao carregar exercícios.");
      setExercises([]); // Garante que seja um array vazio em caso de erro
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchStudents();
    fetchWorkoutLogs();
    fetchExerciseCategoriesData();
    fetchExercises();
  }, [fetchStudents, fetchWorkoutLogs, fetchExerciseCategoriesData, fetchExercises]);

  // Filter available exercises based on selected body part
  const availableExercisesForSelection = useMemo(() => {
    if (!selectedBodyPart || !Array.isArray(exerciseCategories) || !Array.isArray(exercises)) return [];
    const category = exerciseCategories.find(cat => cat.name === selectedBodyPart);
    if (!category) return [];
    return exercises.filter(ex => ex.category_id === category.id);
  }, [selectedBodyPart, exerciseCategories, exercises]);

  // Handle adding a new workout log
  const handleAddWorkoutLog = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!selectedStudentName || !selectedBodyPart || !selectedExercise || !sets || !reps || !dayOfWeek || !date || !status) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const student = students.find(s => s.name === selectedStudentName);
    if (!student) {
      setError("Aluno não encontrado. Por favor, selecione um aluno existente.");
      return;
    }

    try {
      const newLog = await requestJson('/workouts', {
        method: 'POST',
        body: JSON.stringify({
          student_id: student.id,
          body_part: selectedBodyPart,
          exercise: selectedExercise,
          sets: parseInt(sets),
          reps: reps,
          day_of_week: dayOfWeek,
          date: date,
          status: status,
        }),
      });

      setWorkoutLogs(prevLogs => [...prevLogs, newLog]);
      // Clear form
      setSelectedStudentName('');
      setSelectedBodyPart('');
      setSelectedExercise('');
      setSets('');
      setReps('');
      setDayOfWeek('');
      setDate('');
      setStatus(statusOptions[0]);
      setSuccessMessage("Treino atribuído com sucesso!");
    } catch (err) {
      console.error("Erro ao atribuir treino:", err);
      setError(`Erro ao atribuir treino: ${err.message || 'Verifique os dados.'}`);
    }
  };

  // Handle adding a new exercise category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!newCategoryName) {
      setError("Por favor, insira o nome da nova categoria.");
      return;
    }

    try {
      const newCategory = await requestJson('/exercises/categories', {
        method: 'POST',
        body: JSON.stringify({ name: newCategoryName }),
      });
      setExerciseCategories(prev => [...prev, newCategory]);
      setNewCategoryName('');
      setSuccessMessage("Categoria adicionada com sucesso!");
    } catch (err) {
      console.error("Erro ao adicionar categoria:", err);
      setError(`Erro ao adicionar categoria: ${err.message || 'Verifique os dados.'}`);
    }
  };

  // Handle adding a new exercise
  const handleAddExercise = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!newExerciseName || !selectedCategoryForNewExercise) {
      setError("Por favor, insira o nome do exercício e selecione uma categoria.");
      return;
    }

    const category = exerciseCategories.find(cat => cat.name === selectedCategoryForNewExercise);
    if (!category) {
      setError("Categoria selecionada não encontrada.");
      return;
    }

    try {
      const newExercise = await requestJson('/exercises', {
        method: 'POST',
        body: JSON.stringify({ name: newExerciseName, category_id: category.id }),
      });
      setExercises(prev => [...prev, { ...newExercise, category_name: category.name }]); // Add category_name for display
      setNewExerciseName('');
      setSelectedCategoryForNewExercise('');
      setSuccessMessage("Exercício adicionado com sucesso!");
    } catch (err) {
      console.error("Erro ao adicionar exercício:", err);
      setError(`Erro ao adicionar exercício: ${err.message || 'Verifique os dados.'}`);
    }
  };

  // Handle delete workout
  const handleDeleteWorkout = async (id) => {
    if (!window.confirm("Tem certeza que deseja deletar este treino?")) {
      return;
    }
    setError(null);
    setSuccessMessage(null);
    try {
      await deleteWorkout(id);
      setWorkoutLogs(prevLogs => prevLogs.filter(log => log.id !== id));
      setSuccessMessage("Treino deletado com sucesso!");
    } catch (err) {
      console.error("Erro ao deletar treino:", err);
      setError(`Erro ao deletar treino: ${err.message || 'Tente novamente.'}`);
    }
  };

  // Handle edit click (sets up the form for editing)
  const handleEditClick = (log) => {
    setEditingWorkoutId(log.id);
    setEditForm({
      student_name: log.student_name,
      body_part: log.body_part,
      exercise: log.exercise,
      sets: log.sets,
      reps: log.reps,
      day_of_week: log.day_of_week,
      date: log.date,
      status: log.status,
    });
  };

  // Handle changes in the edit form
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle update workout
  const handleUpdateWorkout = async () => {
    setError(null);
    setSuccessMessage(null);

    const student = students.find(s => s.name === editForm.student_name);
    if (!student) {
      setError("Aluno não encontrado. Por favor, selecione um aluno existente.");
      return;
    }

    try {
      const updatedLog = await updateWorkout(editingWorkoutId, {
        student_id: student.id,
        body_part: editForm.body_part,
        exercise: editForm.exercise,
        sets: parseInt(editForm.sets),
        reps: editForm.reps,
        day_of_week: editForm.day_of_week,
        date: editForm.date,
        status: editForm.status,
      });

      setWorkoutLogs(prevLogs => prevLogs.map(log =>
        log.id === editingWorkoutId ? { ...updatedLog, student_name: student.name } : log
      ));
      setEditingWorkoutId(null);
      setEditForm({});
      setSuccessMessage("Treino atualizado com sucesso!");
    } catch (err) {
      console.error("Erro ao atualizar treino:", err);
      setError(`Erro ao atualizar treino: ${err.message || 'Verifique os dados.'}`);
    }
  };

  return (
    <DashboardLayout>
      <h2 className={styles.pageTitle}>🏋️ Gerenciamento de Treinos</h2>

      {error && <div className={styles.errorBox}>{error}</div>}
      {successMessage && <div className={styles.successBox}>{successMessage}</div>}

      {/* Section for Assigning New Workout */}
      <div className={styles.formSection}>
        <h3 className={styles.formTitle}>Atribuir Novo Treino</h3>
        <form onSubmit={handleAddWorkoutLog} className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="student-name" className={styles.formLabel}>Nome do Aluno <span className={styles.required}>*</span></label>
            <input
              list="students"
              id="student-name"
              className={styles.formInput}
              value={selectedStudentName}
              onChange={(e) => setSelectedStudentName(e.target.value)}
              placeholder="Selecione ou digite o nome do aluno"
              required
            />
            <datalist id="students">
              {students.map((student) => (
                <option key={student.id} value={student.name} />
              ))}
            </datalist>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="body-part" className={styles.formLabel}>Parte do Corpo <span className={styles.required}>*</span></label>
            <select
              id="body-part"
              className={styles.formSelect}
              value={selectedBodyPart}
              onChange={(e) => {
                setSelectedBodyPart(e.target.value);
                setSelectedExercise(''); // Reset exercise when body part changes
              }}
              required
            >
              <option value="">Selecione uma parte do corpo</option>
              {Array.isArray(exerciseCategories) && exerciseCategories.map((category) => (
                <option key={category.id} value={category.name}>{category.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="exercise" className={styles.formLabel}>Exercício <span className={styles.required}>*</span></label>
            <select
              id="exercise"
              className={styles.formSelect}
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
              required
              disabled={!selectedBodyPart}
            >
              <option value="">Selecione um exercício</option>
              {Array.isArray(availableExercisesForSelection) && availableExercisesForSelection.map((ex) => (
                <option key={ex.id} value={ex.name}>{ex.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="sets" className={styles.formLabel}>Séries <span className={styles.required}>*</span></label>
            <input
              type="number"
              id="sets"
              className={styles.formInput}
              value={sets}
              onChange={(e) => setSets(e.target.value)}
              placeholder="Ex: 3"
              min="1"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="reps" className={styles.formLabel}>Repetições <span className={styles.required}>*</span></label>
            <select
              id="reps"
              className={styles.formSelect}
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              required
            >
              <option value="">Selecione as repetições</option>
              {repsOptions.map((rep) => (
                <option key={rep} value={rep}>{rep}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="day-of-week" className={styles.formLabel}>Dia da Semana <span className={styles.required}>*</span></label>
            <select
              id="day-of-week"
              className={styles.formSelect}
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
              required
            >
              <option value="">Selecione o dia</option>
              {dayOfWeekOptions.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="date" className={styles.formLabel}>Data <span className={styles.required}>*</span></label>
            <input
              type="date"
              id="date"
              className={styles.formInput}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="status" className={styles.formLabel}>Status <span className={styles.required}>*</span></label>
            <select
              id="status"
              className={styles.formSelect}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <button type="submit" className={styles.formButton}>Atribuir Treino</button>
        </form>
      </div>

      {/* Section for Managing Exercise Categories */}
      <div className={styles.formSection}>
        <h3 className={styles.formTitle}>Gerenciar Categorias de Exercícios</h3>
        <form onSubmit={handleAddCategory} className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="new-category-name" className={styles.formLabel}>Nova Categoria</label>
            <input
              type="text"
              id="new-category-name"
              className={styles.formInput}
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Ex: Peito, Costas"
              required
            />
          </div>
          <button type="submit" className={styles.formButton}>Adicionar Categoria</button>
        </form>
        <div className={styles.categoryList}>
          <h4>Categorias Existentes:</h4>
          <ul>
            {Array.isArray(exerciseCategories) && exerciseCategories.map(cat => (
              <li key={cat.id}>{cat.name}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Section for Managing Exercises */}
      <div className={styles.formSection}>
        <h3 className={styles.formTitle}>Gerenciar Exercícios</h3>
        <form onSubmit={handleAddExercise} className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="new-exercise-name" className={styles.formLabel}>Nome do Exercício</label>
            <input
              type="text"
              id="new-exercise-name"
              className={styles.formInput}
              value={newExerciseName}
              onChange={(e) => setNewExerciseName(e.target.value)}
              placeholder="Ex: Supino Reto"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="exercise-category" className={styles.formLabel}>Categoria</label>
            <select
              id="exercise-category"
              className={styles.formSelect}
              value={selectedCategoryForNewExercise}
              onChange={(e) => setSelectedCategoryForNewExercise(e.target.value)}
              required
            >
              <option value="">Selecione uma categoria</option>
              {Array.isArray(exerciseCategories) && exerciseCategories.map((category) => (
                <option key={category.id} value={category.name}>{category.name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className={styles.formButton}>Adicionar Exercício</button>
        </form>
        <div className={styles.exerciseList}>
          <h4>Exercícios Existentes:</h4>
          <ul>
            {Array.isArray(exercises) && exercises.map(ex => (
              <li key={ex.id}>{ex.name} ({ex.category_name})</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Section for Assigned Workouts Table */}
      <div className={styles.tableSection}>
        <h3 className={styles.formTitle}>Treinos Atribuídos</h3>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeadRow}>
              <th className={styles.tableHeader}>Aluno</th>
              <th className={styles.tableHeader}>Parte do Corpo</th>
              <th className={styles.tableHeader}>Exercício</th>
              <th className={styles.tableHeader}>Séries</th>
              <th className={styles.tableHeader}>Repetições</th>
              <th className={styles.tableHeader}>Dia da Semana</th>
              <th className={styles.tableHeader}>Data</th>
              <th className={styles.tableHeader}>Status</th>
              <th className={styles.tableHeader}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {workoutLogs.length > 0 ? (
              workoutLogs.map((log) => (
                editingWorkoutId === log.id ? (
                  <tr key={log.id} className={styles.tableRow}>
                    <td>
                      <input
                        list="students-edit"
                        name="student_name"
                        value={editForm.student_name}
                        onChange={handleEditFormChange}
                        className={styles.editInput}
                      />
                      <datalist id="students-edit">
                        {students.map((student) => (
                          <option key={student.id} value={student.name} />
                        ))}
                      </datalist>
                    </td>
                    <td>
                      <select
                        name="body_part"
                        value={editForm.body_part}
                        onChange={handleEditFormChange}
                        className={styles.editSelect}
                      >
                        {Array.isArray(exerciseCategories) && exerciseCategories.map((category) => (
                          <option key={category.id} value={category.name}>{category.name}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        name="exercise"
                        value={editForm.exercise}
                        onChange={handleEditFormChange}
                        className={styles.editSelect}
                      >
                        {Array.isArray(exercises) && exercises.filter(ex => ex.category_name === editForm.body_part).map((ex) => (
                          <option key={ex.id} value={ex.name}>{ex.name}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        name="sets"
                        value={editForm.sets}
                        onChange={handleEditFormChange}
                        className={styles.editInput}
                      />
                    </td>
                    <td>
                      <select
                        name="reps"
                        value={editForm.reps}
                        onChange={handleEditFormChange}
                        className={styles.editSelect}
                      >
                        {repsOptions.map((rep) => (
                          <option key={rep} value={rep}>{rep}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        name="day_of_week"
                        value={editForm.day_of_week}
                        onChange={handleEditFormChange}
                        className={styles.editSelect}
                      >
                        {dayOfWeekOptions.map((day) => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="date"
                        name="date"
                        value={editForm.date}
                        onChange={handleEditFormChange}
                        className={styles.editInput}
                      />
                    </td>
                    <td>
                      <select
                        name="status"
                        value={editForm.status}
                        onChange={handleEditFormChange}
                        className={styles.editSelect}
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button onClick={handleUpdateWorkout} className={styles.actionButton}>Salvar</button>
                      <button onClick={() => setEditingWorkoutId(null)} className={styles.actionButton}>Cancelar</button>
                    </td>
                  </tr>
                ) : (
                  <tr key={log.id} className={styles.tableRow}>
                    <td className={styles.tableData}>{log.student_name}</td>
                    <td className={styles.tableData}>{log.body_part}</td>
                    <td className={styles.tableData}>{log.exercise}</td>
                    <td className={styles.tableData}>{log.sets}</td>
                    <td className={styles.tableData}>{log.reps}</td>
                    <td className={styles.tableData}>{log.day_of_week}</td>
                    <td className={styles.tableData}>{log.date}</td>
                    <td className={styles.tableData}>
                      <span className={`${styles.statusSpan} ${
                        log.status === 'Pendente' ? styles.statusPending :
                        log.status === 'Concluído' ? styles.statusCompleted :
                        log.status === 'Perdido' ? styles.statusMissed :
                        styles.statusRescheduled
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => handleEditClick(log)} className={styles.actionButton}>Editar</button>
                      <button onClick={() => handleDeleteWorkout(log.id)} className={styles.actionButton}>Deletar</button>
                    </td>
                  </tr>
                )
              ))
            ) : (
              <tr>
                <td colSpan="9" className={styles.noWorkouts}>
                  {error ? 'Os dados do treino estão indisponíveis no momento.' : 'Nenhum treino atribuído ainda.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}