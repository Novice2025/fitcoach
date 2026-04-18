import React, { useState, useEffect, useMemo, useCallback } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { requestJson } from '../../lib/api';
import styles from './Analytics.module.css'; // Importa o CSS
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrar os componentes do Chart.js que serão usados
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Analytics() {
  const [stats, setStats] = useState({ totalStudents: 0, totalRevenue: 0 });
  const [allStudents, setAllStudents] = useState([]); // Todos os alunos para o filtro
  const [allSchedules, setAllSchedules] = useState([]); // Todos os agendamentos
  const [selectedStudentFilter, setSelectedStudentFilter] = useState('all'); // Filtro de aluno
  const [error, setError] = useState('');

  const parseAmount = (amount) => {
    if (typeof amount === 'number') {
      return amount;
    }
    // Remove qualquer coisa que não seja número, ponto ou sinal de menos, e substitui vírgula por ponto
    return parseFloat(String(amount).replace(/[^0-9.,-]/g, '').replace(',', '.')) || 0;
  };

  const loadAnalytics = useCallback(async () => {
    let isMounted = true; // Flag para evitar atualização de estado em componente desmontado

    try {
      const [studentsData, paymentsData, scheduleData] = await Promise.all([
        requestJson('/students'),
        requestJson('/payments'),
        requestJson('/schedule')
      ]);

      if (studentsData === null || paymentsData === null || scheduleData === null) {
        if (isMounted) {
          setError('Unable to connect to the server. Please ensure the backend is running on port 5000.');
          setStats({ totalStudents: 0, totalRevenue: 0 });
          setAllStudents([]);
          setAllSchedules([]);
        }
        return;
      }

      if (isMounted) {
        const revenue = paymentsData.reduce((sum, payment) => {
          return sum + parseAmount(payment.amount);
        }, 0);

        setStats({
          totalStudents: studentsData.length,
          totalRevenue: revenue
        });
        setAllStudents(studentsData);
        setAllSchedules(scheduleData);
        setError('');
      }
    } catch (err) {
      console.error("Erro ao carregar análises:", err);
      if (isMounted) {
        setStats({ totalStudents: 0, totalRevenue: 0 });
        setAllStudents([]);
        setAllSchedules([]);
        setError('Não foi possível carregar os dados de análise. Verifique se a API Flask está rodando na porta 5000.');
      }
    }

    return () => { isMounted = false; }; // Cleanup function
  }, []); // Sem dependências, pois queremos que carregue uma vez

  useEffect(() => {
    loadAnalytics().catch(err => console.error('Error loading analytics:', err));
  }, [loadAnalytics]); // loadAnalytics é uma dependência do useEffect

  // Dados para o gráfico de presença por aluno
  const attendanceChartData = useMemo(() => {
    const studentAttendance = {}; // { 'Nome Aluno': { total: 0, completed: 0 } }

    // Inicializa todos os alunos
    allStudents.forEach(student => {
      studentAttendance[student.name] = { total: 0, completed: 0 };
    });

    // Processa os agendamentos
    allSchedules.forEach(session => {
      if (studentAttendance[session.student_name]) {
        studentAttendance[session.student_name].total++;
        if (session.status === 'Concluído') {
          studentAttendance[session.student_name].completed++;
        }
      }
    });

    const labels = [];
    const completedData = [];
    const missedData = []; // Sessões não concluídas (Perdido, Reagendado, Agendado)

    Object.keys(studentAttendance).forEach(studentName => {
      // Aplica o filtro de aluno
      if (selectedStudentFilter === 'all' || selectedStudentFilter === studentName) {
        labels.push(studentName);
        completedData.push(studentAttendance[studentName].completed);
        missedData.push(studentAttendance[studentName].total - studentAttendance[studentName].completed);
      }
    });

    return {
      labels,
      datasets: [
        {
          label: 'Sessões Concluídas',
          data: completedData,
          backgroundColor: 'rgba(54, 162, 235, 0.6)', // Azul
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
        {
          label: 'Sessões Não Concluídas',
          data: missedData,
          backgroundColor: 'rgba(255, 99, 132, 0.6)', // Vermelho
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    };
  }, [allStudents, allSchedules, selectedStudentFilter]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Presença dos Alunos (Sessões Concluídas vs. Não Concluídas)',
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Número de Sessões',
        },
      },
    },
  };

  return (
    <DashboardLayout>
      <h2 className={styles.pageTitle}>📊 Análises de Negócios</h2>

      {error && (
        <div className={styles.errorBox}>
          {error}
        </div>
      )}

      <div className={styles.cardContainer}>
        {/* Card de Total de Alunos */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Total de Alunos Ativos</h3>
          <p className={styles.cardValue}>
            {stats.totalStudents}
          </p>
        </div>

        {/* Card de Receita Total */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Receita Total</h3>
          <p className={styles.cardValue}>
            R$ {stats.totalRevenue.toFixed(2).replace('.', ',')}
          </p>
        </div>
      </div>

      <div className={styles.chartSection}>
        <h3 className={styles.chartTitle}>Gráfico de Presença por Aluno</h3>
        <div className={styles.filterContainer}>
          <label htmlFor="student-filter" className={styles.filterLabel}>Filtrar por Aluno:</label>
          <select
            id="student-filter"
            className={styles.filterSelect}
            value={selectedStudentFilter}
            onChange={(e) => setSelectedStudentFilter(e.target.value)}
          >
            <option value="all">Todos os Alunos</option>
            {allStudents.map(student => (
              <option key={student.name} value={student.name}>{student.name}</option>
            ))}
          </select>
        </div>
        <div className={styles.chartWrapper}>
          {attendanceChartData.labels.length > 0 ? (
            <Bar data={attendanceChartData} options={chartOptions} />
          ) : (
            <p className={styles.noChartData}>Nenhum dado de presença disponível para o filtro selecionado.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}