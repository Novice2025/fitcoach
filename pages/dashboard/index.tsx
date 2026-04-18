// pages/dashboard/index.tsx
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { requestJson } from '../../lib/api';
import styles from '../../styles/DashboardHome.module.css';

interface Student {
  id: string | number;
  name: string;
}

export default function DashboardHome() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStudents() {
      try {
        setLoading(true);
        const data = await requestJson('/students');
        if (data) {
          setStudents(data);
        } else {
          setStudents([]);
          setError("Não foi possível carregar os alunos. Verifique a conexão com o servidor.");
        }
      } catch (err) {
        console.error("Erro ao buscar alunos:", err);
        const message = err instanceof Error ? err.message : "Ocorreu um erro ao buscar os alunos.";
        setError(message);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, []);

  return (
    <DashboardLayout>
      <div className={styles.dashboardHome}>
        <h1>Visão Geral do Dashboard</h1>

        {loading && <p>Carregando dados do dashboard...</p>}
        {error && <p style={{ color: 'red' }}>Erro: {error}</p>}

        {!loading && !error && (
          <div className={styles.summaryCards}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryCardTitle}>Total de Alunos</h3>
              <p className={styles.summaryCardValue}>{students.length}</p>
              <h3 className={styles.summaryCardTitle}>Alunos Recentes</h3>
              <ul className={styles.studentList}>
                {students.length > 0 ? (
                  students.slice(0, 5).map((student) => (
                    <li key={student.id} className={styles.studentListItem}>
                      <span className={styles.studentName}>{student.name}</span>
                    </li>
                  ))
                ) : (
                  <li>Nenhum aluno recente.</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}