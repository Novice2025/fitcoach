import React, { useState } from 'react'; // Adicionado React import para consistência, embora não estritamente necessário para useState em Next.js 13+
import { useRouter } from 'next/router';
import Link from 'next/link';
import PropTypes from 'prop-types';
import styles from './DashboardLayout.module.css'; // Importa o módulo CSS

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navItems = [
    { name: 'Início', path: '/dashboard', icon: '🏠' },
    { name: 'Alunos', path: '/dashboard/students', icon: '🧑‍🎓' },
    { name: 'Treinos', path: '/dashboard/workouts', icon: '🏋️' },
    { name: 'Peso', path: '/dashboard/weight', icon: '⚖️' },
    { name: 'Agendamentos', path: '/dashboard/schedule', icon: '📅' },
    { name: 'Pagamentos', path: '/dashboard/payments', icon: '💰' },
  ];

  const handleLogout = () => {
    // Implemente sua lógica de logout aqui
    console.log('Fazendo logout...');
    router.push('/login'); // Redireciona para a página de login
  };

  const handleNavClick = () => {
    setMobileNavOpen(false);
  };

  // Lógica para determinar o título do cabeçalho com base na rota atual
  const getHeaderTitle = () => {
    const currentPath = router.pathname;

    // Lógica mais precisa para o item ativo
    const activeItem = navItems.find(item => {
      if (item.path === '/dashboard') {
        return currentPath === '/dashboard'; // "Início" só é ativo na rota exata /dashboard
      }
      return currentPath.startsWith(item.path); // Outros itens são ativos se a rota começar com seu path
    });

    return activeItem?.name || 'Dashboard';
  };

  return (
    <div className={styles.container}>
      <aside className={`${styles.sidebar} ${mobileNavOpen ? styles.sidebarOpen : ''}`}>
        <h1 className={styles.sidebarHeader}>FitCoach</h1>
        <button
          type="button"
          className={styles.mobileMenuButton}
          onClick={() => setMobileNavOpen((open) => !open)}
          aria-expanded={mobileNavOpen}
          aria-controls="dashboard-navigation"
        >
          {mobileNavOpen ? 'Fechar' : 'Menu'}
        </button>
        <nav>
          <ul
            id="dashboard-navigation"
            className={`${styles.navList} ${mobileNavOpen ? styles.navListOpen : ''}`}
          >
            {navItems.map((item) => (
              <li key={item.name} className={styles.navItem}>
                <Link
                  href={item.path}
                  // Lógica de classe ativa ajustada
                  className={`${styles.navLink} ${
                    (item.path === '/dashboard' && router.pathname === '/dashboard') ||
                    (item.path !== '/dashboard' && router.pathname.startsWith(item.path))
                      ? styles.active
                      : ''
                  }`}
                  onClick={handleNavClick}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* Você pode adicionar um rodapé ou outros elementos da barra lateral aqui */}
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h2 className={styles.headerTitle}>
            {getHeaderTitle()}
          </h2>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Sair
          </button>
        </header>
        {children}
      </main>
    </div>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};