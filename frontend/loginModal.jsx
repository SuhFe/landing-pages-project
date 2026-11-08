import React, { useState } from 'react';
import './LoginModal.css';

export default function LoginModal({ isOpen, onClose }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const endpoint = isRegistering ? 'http://localhost:8000/api/register' : 'http://localhost:8000/api/login';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Ocorreu um erro na autenticação.');
      }

      if (isRegistering) {
        setSuccessMsg('Cadastro realizado com sucesso! Faça login.');
        setIsRegistering(false);
      } else {
        // Sucesso no Login: Salva o token JWT de forma segura e fecha o modal
        localStorage.setItem('token', data.access_token);
        alert('Login efetuado com sucesso!');
        onClose();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2>{isRegistering ? 'Criar Conta' : 'Acessar sua Conta'}</h2>
        
        {error && <div className="alert-error">{error}</div>}
        {successMsg && <div className="alert-success">{successMsg}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="seuemail@exemplo.com" 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
              required 
            />
          </div>
          <button type="submit" class="btn-primary">
            {isRegistering ? 'Cadastrar' : 'Entrar'}
          </button>
        </form>

        <p className="toggle-mode">
          {isRegistering ? 'Já tem uma conta?' : 'Ainda não tem conta?'} {' '}
          <span onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? 'Faça login' : 'Cadastre-se'}
          </span>
        </p>
      </div>
    </div>
  );
}