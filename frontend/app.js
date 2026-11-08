import React, { useEffect, useState } from 'react';
import './Dashboard.css';

//pode ser adaptado para exibir os dados da conta, assim como o painel de pedidos:
export default function Dashboard({ onLogout }) {
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Aqui você pode recuperar dados do usuário ou validar o token salvo no localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      onLogout(); // Se não houver token, manda de volta para o login
    }
    // Opcional: Decodificar o JWT ou buscar dados do perfil na API Python
  }, []);

  const handleLogoutClick = () => {
    localStorage.removeItem('token');
    onLogout();
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo">
          <span>Marca - Painel do Cliente</span>
        </div>
        <button className="btn-logout" onClick={handleLogoutClick}>Sair</button>
      </header>

      <main className="dashboard-main">
        <div className="container">
          <h1>Bem-vindo à sua Conta!</h1>
          <p className="subtitle">Aqui você pode gerenciar suas informações e acompanhar seus pedidos.</p>

          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>Meus Pedidos</h3>
              <p>Você ainda não possui pedidos recentes registrados na plataforma.</p>
            </div>
            <div className="dashboard-card">
              <h3>Configurações da Conta</h3>
              <p>Gerencie seus dados de acesso e preferências de segurança.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}