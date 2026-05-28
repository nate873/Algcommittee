import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function AdminRoute({ children }) {
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log('No session found');
        setStatus('denied');
        return;
      }

      console.log('Session user ID:', session.user.id);

      const { data, error } = await supabase
        .from('user_roles')
        .select('is_admin')
        .eq('user_id', session.user.id)
        .single();

      console.log('user_roles data:', data);
      console.log('user_roles error:', error);

      setStatus(data?.is_admin ? 'allowed' : 'denied');
    };
    check();
  }, []);

  if (status === 'loading') return (
    <div style={{ minHeight: '100vh', background: '#0B1F3A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 36, height: 36, border: '3px solid rgba(201,168,76,0.2)', borderTop: '3px solid #C9A84C', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (status === 'denied') return <Navigate to="/" replace />;

  return children;
}