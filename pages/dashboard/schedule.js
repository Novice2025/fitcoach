import React, { useState, useEffect, useMemo, useCallback } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import styles from './Schedule.module.css'; // Importa o módulo CSS
import { requestJson } from '../../lib/api';

export default function Schedule() {
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]); // Para o dropdown de alunos
  const [selectedStudentName, setSelectedStudentName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [status, setStatus] = useState('Agendado'); // Novo: Status padrão para novas sessões
  const [observation, setObservation] = useState(''); // Novo: Campo de observação
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Opções de Status para o dropdown
  const statusOptions = useMemo(() => [
    'Agendado', 'Concluído', 'Perdido', 'Reagendado'
  ], []);

  const fetchSchedule = useCallback(async () => {
    try {
      // CORREÇÃO AQUI: Alterado de '/schedule' para '/schedules'
      const data = await requestJson('/schedules');
      setError(null);
      return data;
    } catch (err) {
      console.error("Erro ao buscar agendamentos:", err);
      setError('Não foi possível carregar os agendamentos. Verifique o backend.');
      return [];
    }
  }, []);

  const fetchStudents = useCallback(async () => {
    try {
      const data = await requestJson('/students');
      setError(null);
      return data;
    } catch (err) {
      console.error("Erro ao buscar alunos:", err);
      setError('Não foi possível carregar a lista de alunos.');
      return [];
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [scheduleData, studentsData] = await Promise.all([
          fetchSchedule(),
          fetchStudents()
        ]);

        if (scheduleData === null || studentsData === null) {
          if (isMounted) {
            setSessions([]);
            setStudents([]);
            setError('Unable to connect to the server. Please ensure the backend is running on port 5000.');
          }
          return;
        }

        if (isMounted) {
          setSessions(scheduleData);
          setStudents(studentsData);
          setError(null);
        }
      } catch (_err) {
        // Erro já tratado nas funções fetch, apenas loga aqui se necessário
        console.error("Erro geral ao carregar dados:", _err);
        if (isMounted) {
          setSessions([]);
          setStudents([]);
        }
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, [fetchSchedule, fetchStudents]); // Dependências para useCallback

  const handleAddSession = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!selectedStudentName || !date || !time) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      // CORREÇÃO AQUI: Alterado de '/schedule' para '/schedules'
      await requestJson('/schedules', {
        method: 'POST',
        body: JSON.stringify({
          student_name: selectedStudentName,
          date,
          time,
          status, // Inclui o status
          observation // Inclui a observação
        }),
      });
      // Limpa o formulário
      setSelectedStudentName('');
      setDate('');
      setTime('');
      setStatus('Agendado'); // Reseta para o padrão
      setObservation('');

      const updatedSessions = await fetchSchedule();
      setSessions(updatedSessions);
      setSuccessMessage('Sessão agendada com sucesso!');
    } catch (_err) {
      console.error('Erro ao adicionar sessão:', _err);
      setError('Não foi possível salvar a sessão agora. Verifique se a API Flask está disponível e tente novamente.');
    }
  };

  const handleUpdateSession = async (sessionId, newStatus, newObservation) => {
    setError(null);
    setSuccessMessage(null);

    try {
      // CORREÇÃO AQUI: Alterado de '/schedule/${sessionId}' para '/schedules/${sessionId}'
      await requestJson(`/schedules/${sessionId}`, {
        method: 'PUT', // Ou PATCH, dependendo da sua API
        body: JSON.stringify({ status: newStatus, observation: newObservation }),
      });
      const updatedSessions = await fetchSchedule();
      setSessions(updatedSessions);
      setSuccessMessage('Status da sessão atualizado com sucesso!');
    } catch (_err) {
      console.error('Erro ao atualizar status da sessão:', _err);
      setError('Não foi possível atualizar o status da sessão. Tente novamente.');
    }
  };

  // Ordena as sessões por data e hora
  const sortedSessions = useMemo(() => {
    return [...sessions].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA - dateB;
    });
  }, [sessions]);

  return (
    <DashboardLayout>
      <div className={styles.container}>
        <h2 className={styles.pageTitle}>📅 Gerenciamento de Agendamentos</h2>

        {error && (
          <div className={styles.errorBox}>
            {error}
          </div>
        )}

        {successMessage && (
          <div className={styles.successBox}>
            {successMessage}
          </div>
        )}

        <div className={styles.formSection}>
          <h3 className={styles.formTitle}>Agendar Nova Sessão</h3>
          <form onSubmit={handleAddSession} className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="student-name" className={styles.formLabel}>
                Nome do Aluno <span className={styles.required}>*</span>
              </label>
              <input
                id="student-name"
                type="text"
                list="students-list"
                placeholder="Nome do Aluno"
                value={selectedStudentName}
                onChange={(e) => setSelectedStudentName(e.target.value)}
                className={styles.formInput}
                required
              />
              <datalist id="students-list">
                {students.map((student) => (
                  <option key={student.id} value={student.name} />
                ))}
              </datalist>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="date" className={styles.formLabel}>
                Data <span className={styles.required}>*</span>
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={styles.formInput}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="time" className={styles.formLabel}>
                Hora <span className={styles.required}>*</span>
              </label>
              <input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={styles.formInput}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="status" className={styles.formLabel}>
                Status Inicial
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={styles.formSelect}
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="observation" className={styles.formLabel}>
                Observação
              </label>
              <textarea
                id="observation"
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                className={styles.formInput}
                rows="2"
                placeholder="Adicione uma observação (ex: motivo do reagendamento)"
              ></textarea>
            </div>

            <button type="submit" className={styles.formButton}>+ Agendar</button>
          </form>
        </div>

        <div className={styles.tableSection}>
          <h3 className={styles.formTitle}>Sessões Agendadas</h3>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeadRow}>
                <th className={styles.tableHeader}>Aluno</th>
                <th className={styles.tableHeader}>Data</th>
                <th className={styles.tableHeader}>Hora</th>
                <th className={styles.tableHeader}>Status</th>
                <th className={styles.tableHeader}>Observação</th>
                <th className={styles.tableHeader}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {sortedSessions.length > 0 ? (
                sortedSessions.map((s) => (
                  <tr key={s.id} className={styles.tableRow}>
                    <td className={`${styles.tableData} ${styles.tableDataStrong}`}>{s.student_name}</td>
                    <td className={styles.tableData}>{s.date}</td>
                    <td className={styles.tableData}>{s.time}</td>
                    <td className={styles.tableData}>
                      <span className={`${styles.statusSpan} ${
                        s.status === 'Agendado' ? styles.statusScheduled :
                        s.status === 'Concluído' ? styles.statusCompleted :
                        s.status === 'Perdido' ? styles.statusMissed :
                        styles.statusRescheduled
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className={styles.tableData}>{s.observation || '-'}</td>
                    <td className={styles.tableData}>
                      <select
                        value={s.status}
                        onChange={(e) => handleUpdateSession(s.id, e.target.value, s.observation)}
                        className={styles.actionSelect}
                      >
                        {statusOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      {s.status === 'Reagendado' && (
                        <button
                          onClick={() => {
                            const newObservation = prompt("Adicionar/Editar observação para reagendamento:", s.observation || '');
                            if (newObservation !== null) { // Se o usuário não cancelou o prompt
                              handleUpdateSession(s.id, s.status, newObservation);
                            }
                          }}
                          className={styles.editObservationButton}
                        >
                          Obs
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className={styles.noSessions}>
                    {error ? 'Os dados de agendamento estão indisponíveis no momento.' : 'Nenhuma sessão agendada ainda.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}