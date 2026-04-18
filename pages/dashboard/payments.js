import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import styles from './Payments.module.css'; // Importa o módulo CSS
import { requestJson } from '../../lib/api';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]); // Para o dropdown de alunos
  const [selectedStudentName, setSelectedStudentName] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Helper function returns data instead of setting state
  const fetchPayments = async () => {
    return requestJson('/payments');
  };

  const fetchStudents = async () => {
    return requestJson('/students');
  };

  // Safe useEffect with isMounted guard and try/catch
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [paymentsData, studentsData] = await Promise.all([
          fetchPayments(),
          fetchStudents()
        ]);

        if (paymentsData === null || studentsData === null) {
          if (isMounted) {
            setPayments([]);
            setStudents([]);
            setError('Unable to connect to the server. Please ensure the backend is running on port 5000.');
          }
          return;
        }

        if (isMounted) {
          setPayments(paymentsData);
          setStudents(studentsData);
          setError(null);
        }
      } catch (_err) { // Usando _err para evitar aviso de variável não utilizada
        console.error("Erro ao carregar dados de pagamentos ou alunos:", _err);
        if (isMounted) {
          setPayments([]);
          setStudents([]);
          setError('Não foi possível carregar os dados de pagamentos ou alunos. Verifique se a API Flask está rodando na porta 5000.');
        }
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, []);

  const handleAddPayment = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!selectedStudentName || !amount) {
      setError('Por favor, preencha o nome do aluno e o valor.');
      return;
    }

    // Verifica se o aluno selecionado existe na lista de alunos
    const studentExists = students.some(student => student.name === selectedStudentName);
    if (!studentExists) {
      setError('Aluno não encontrado. Por favor, selecione um aluno da lista.');
      return;
    }

    try {
      // O backend espera o amount como número, então removemos o '$' se houver
      const numericAmount = parseFloat(amount.replace('$', ''));
      if (isNaN(numericAmount)) {
        setError('Valor inválido. Por favor, insira um número.');
        return;
      }

      await requestJson('/payments', {
        method: 'POST',
        body: JSON.stringify({ student_name: selectedStudentName, amount: numericAmount, status: 'Pago' }), // Status traduzido
      });
      setSelectedStudentName('');
      setAmount('');
      const updatedData = await fetchPayments();
      setPayments(updatedData);
      setSuccessMessage('Pagamento registrado com sucesso!');
    } catch (_err) { // Usando _err para evitar aviso de variável não utilizada
      console.error("Erro ao adicionar pagamento:", _err);
      setError('Não foi possível registrar o pagamento no momento. Verifique se a API Flask está disponível e tente novamente.');
    }
  };

  // Ordena os pagamentos para exibição
  const sortedPayments = useMemo(() => {
    return [...payments].sort((a, b) => {
      // Ordena por nome do aluno e depois por data (se houver)
      if (a.student_name < b.student_name) return -1;
      if (a.student_name > b.student_name) return 1;
      // Se tiver um campo de data no pagamento, pode adicionar aqui
      // if (a.date && b.date) return new Date(b.date) - new Date(a.date);
      return 0;
    });
  }, [payments]);

  return (
    <DashboardLayout>
      <div className={styles.container}>
        <h2 className={styles.pageTitle}>💳 Pagamentos</h2>

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
          <h3 className={styles.formTitle}>Registrar Novo Pagamento</h3>
          <form onSubmit={handleAddPayment} className={styles.formGrid}>
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
              <label htmlFor="amount" className={styles.formLabel}>
                Valor (R$) <span className={styles.required}>*</span>
              </label>
              <input
                id="amount"
                type="number"
                step="0.01"
                placeholder="Valor (ex: 150.00)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={styles.formInput}
                required
              />
            </div>

            <button type="submit" className={styles.formButton}>+ Registrar Pagamento</button>
          </form>
        </div>

        <div className={styles.tableSection}>
          <h3 className={styles.formTitle}>Histórico de Pagamentos</h3>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeadRow}>
                <th className={styles.tableHeader}>Aluno</th>
                <th className={styles.tableHeader}>Valor</th>
                <th className={styles.tableHeader}>Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedPayments.length > 0 ? (
                sortedPayments.map((p) => (
                  <tr key={p.id} className={styles.tableRow}>
                    <td className={`${styles.tableData} ${styles.tableDataStrong}`}>{p.student_name}</td>
                    <td className={`${styles.tableData} ${styles.tableDataAmount}`}>R$ {p.amount ? p.amount.toFixed(2).replace('.', ',') : '0,00'}</td>
                    <td className={styles.tableData}>
                      <span className={`${styles.statusSpan} ${styles.statusPaid}`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className={styles.noPayments}>
                    {error ? 'Os dados de pagamento estão indisponíveis no momento.' : 'Nenhum pagamento registrado ainda.'}
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