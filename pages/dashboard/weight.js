import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import styles from './Weight.module.css'; // Importa o CSS específico para esta página
import { requestJson } from '../../lib/api';

export default function Weight() {
  const [weightLogs, setWeightLogs] = useState([]);
  const [students, setStudents] = useState([]); // Para o dropdown de alunos
  const [selectedStudentName, setSelectedStudentName] = useState('');
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState('');
  // Novos estados para as medidas corporais
  const [chest, setChest] = useState('');
  const [quadril, setQuadril] = useState('');
  const [braco, setBraco] = useState('');
  const [perna, setPerna] = useState('');
  // Novo estado para a seleção de mês
  const [selectedMonth, setSelectedMonth] = useState('');

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Lista de meses para o dropdown
  const months = [
    { value: '', label: 'Todos os Meses' },
    { value: '01', label: 'Janeiro' },
    { value: '02', label: 'Fevereiro' },
    { value: '03', label: 'Março' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Maio' },
    { value: '06', label: 'Junho' },
    { value: '07', label: 'Julho' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Setembro' },
    { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' },
    { value: '12', label: 'Dezembro' },
  ];

  // Função para buscar a lista de alunos
  const fetchStudents = async () => {
    try {
      const data = await requestJson('/students');
      if (data === null) {
        setError('Unable to connect to the server. Please ensure the backend is running on port 5000.');
        setStudents([]);
        return;
      }
      setStudents(data);
    } catch (err) {
      console.error("Erro ao buscar alunos:", err);
      setError("Erro ao carregar a lista de alunos.");
    }
  };

  // Função para buscar os registros de peso
  const fetchWeightLogs = useCallback(async () => {
    try {
      const data = await requestJson('/weightlogs');
      if (data === null) {
        setError('Unable to connect to the server. Please ensure the backend is running on port 5000.');
        setWeightLogs([]);
        return;
      }
      // Filtra por mês se um mês estiver selecionado
      const filteredData = selectedMonth
        ? data.filter(log => new Date(log.date).getMonth() + 1 === parseInt(selectedMonth))
        : data;

      // Ordena os logs por data (mais recente primeiro) e nome do aluno
      const sortedLogs = filteredData.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateA < dateB) return 1;
        if (dateA > dateB) return -1;
        return a.student_name.localeCompare(b.student_name);
      });
      setWeightLogs(sortedLogs);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar registros de peso:", err);
      setError("Erro ao carregar registros de peso. Verifique o backend.");
      setWeightLogs([]);
    }
  }, [selectedMonth]);

  useEffect(() => {
    fetchStudents().catch(err => console.error('Error fetching students:', err));
    fetchWeightLogs().catch(err => console.error('Error fetching weight logs:', err));
  }, [selectedMonth, fetchWeightLogs]); // Adiciona selectedMonth como dependência para re-filtrar os logs

  const handleAddWeightLog = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!selectedStudentName || !weight || !date) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const newLog = await requestJson('/weightlogs', {
        method: 'POST',
        body: JSON.stringify({
          student_name: selectedStudentName,
          weight: parseFloat(weight),
          date: date,
          // Inclui as novas medidas corporais
          chest: chest ? parseFloat(chest) : null,
          quadril: quadril ? parseFloat(quadril) : null,
          braco: braco ? parseFloat(braco) : null,
          perna: perna ? parseFloat(perna) : null,
        }),
      });
      // Adiciona o novo log no topo e recarrega para garantir a ordenação e dados mais recentes
      setWeightLogs([newLog, ...weightLogs]);
      setSelectedStudentName('');
      setWeight('');
      setDate('');
      setChest('');
      setQuadril('');
      setBraco('');
      setPerna('');
      setSuccessMessage("Registro de peso e medidas adicionado com sucesso!");
      fetchWeightLogs(); // Recarrega para garantir a ordenação e dados mais recentes
    } catch (err) {
      console.error("Erro ao adicionar registro de peso:", err);
      setError(`Erro ao adicionar registro de peso: ${err.message || 'Verifique os dados.'}`);
    }
  };

  return (
    <DashboardLayout>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Gerenciamento de Peso e Medidas</h1>

        {error && <div className={styles.errorBox}>{error}</div>}
        {successMessage && <div className={styles.successBox}>{successMessage}</div>}

        <div className={styles.formSection}>
          <h2 className={styles.formTitle}>Registrar Novo Peso e Medidas</h2>
          <form onSubmit={handleAddWeightLog} className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="student-name-select" className={styles.formLabel}>
                Nome do Aluno <span className={styles.required}>*</span>
              </label>
              <input
                id="student-name-select"
                type="text"
                list="students-list"
                value={selectedStudentName}
                onChange={(e) => setSelectedStudentName(e.target.value)}
                className={styles.formInput}
                placeholder="Selecione ou digite o nome do aluno"
                required
              />
              <datalist id="students-list">
                {students.map((student) => (
                  <option key={student.id} value={student.name} />
                ))}
              </datalist>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="weight-input" className={styles.formLabel}>
                Peso (kg) <span className={styles.required}>*</span>
              </label>
              <input
                id="weight-input"
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className={styles.formInput}
                placeholder="Ex: 75.5"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="date-input" className={styles.formLabel}>
                Data <span className={styles.required}>*</span>
              </label>
              <input
                id="date-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={styles.formInput}
                required
              />
            </div>

            {/* Novos campos para medidas corporais */}
            <div className={styles.formGroup}>
              <label htmlFor="chest-input" className={styles.formLabel}>
                Peito (cm)
              </label>
              <input
                id="chest-input"
                type="number"
                step="0.1"
                value={chest}
                onChange={(e) => setChest(e.target.value)}
                className={styles.formInput}
                placeholder="Ex: 100.5"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="quadril-input" className={styles.formLabel}>
                Quadril (cm)
              </label>
              <input
                id="quadril-input"
                type="number"
                step="0.1"
                value={quadril}
                onChange={(e) => setQuadril(e.target.value)}
                className={styles.formInput}
                placeholder="Ex: 95.0"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="braco-input" className={styles.formLabel}>
                Braço (cm)
              </label>
              <input
                id="braco-input"
                type="number"
                step="0.1"
                value={braco}
                onChange={(e) => setBraco(e.target.value)}
                className={styles.formInput}
                placeholder="Ex: 30.2"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="perna-input" className={styles.formLabel}>
                Perna (cm)
              </label>
              <input
                id="perna-input"
                type="number"
                step="0.1"
                value={perna}
                onChange={(e) => setPerna(e.target.value)}
                className={styles.formInput}
                placeholder="Ex: 55.8"
              />
            </div>

            <button type="submit" className={styles.formButton}>+ Registrar Peso e Medidas</button>
          </form>
        </div>

        <div className={styles.tableSection}>
          <h2 className={styles.formTitle}>Registros de Peso e Medidas</h2>
          {/* Dropdown de seleção de mês */}
          <div className={styles.monthFilter}>
            <label htmlFor="month-select" className={styles.formLabel}>
              Filtrar por Mês:
            </label>
            <select
              id="month-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className={styles.formSelect}
            >
              {months.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
          </div>

          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeadRow}>
                <th className={styles.tableHeader}>Aluno</th>
                <th className={styles.tableHeader}>Peso (kg)</th>
                <th className={styles.tableHeader}>Peito (cm)</th>
                <th className={styles.tableHeader}>Quadril (cm)</th>
                <th className={styles.tableHeader}>Braço (cm)</th>
                <th className={styles.tableHeader}>Perna (cm)</th>
                <th className={styles.tableHeader}>Data</th>
              </tr>
            </thead>
            <tbody>
              {weightLogs.length > 0 ? (
                weightLogs.map((log) => (
                  <tr key={log.id} className={styles.tableRow}>
                    <td className={`${styles.tableData} ${styles.tableDataStrong}`}>{log.student_name}</td>
                    <td className={styles.tableData}>{log.weight}</td>
                    <td className={styles.tableData}>{log.chest || '-'}</td>
                    <td className={styles.tableData}>{log.quadril || '-'}</td>
                    <td className={styles.tableData}>{log.braco || '-'}</td>
                    <td className={styles.tableData}>{log.perna || '-'}</td>
                    <td className={styles.tableData}>{log.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className={styles.noWeightLogs}>
                    {error ? 'Os registros de peso e medidas estão indisponíveis no momento.' : 'Nenhum registro de peso ou medida ainda.'}
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