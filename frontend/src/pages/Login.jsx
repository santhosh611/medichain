// medichain/frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';

const Login = ({ setLoggedInUser }) => {
    const { t } = useTranslation();
    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    });
    const [loginType, setLoginType] = useState('main');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        let response;
        if (loginType === 'main') {
            const superadminRes = await fetch('http://localhost:5000/api/superadmin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });
            if (superadminRes.ok) {
                const data = await superadminRes.json();
                setLoggedInUser({ role: data.role });
                navigate('/superadmin-dashboard');
                return;
            }

            response = await fetch('http://localhost:5000/api/hospital/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });
        } else {
            response = await fetch('http://localhost:5000/api/hospital-admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ admin_username: loginData.username, admin_password: loginData.password })
            });
        }
        
        if (response && response.ok) {
            const data = await response.json();
            if (loginType === 'main' && data.firstTime) {
                setLoggedInUser({ role: data.role, firstTime: true, id: data.hospitalId });
            } else {
                setLoggedInUser({ role: data.role });
                navigate('/');
            }
        } else {
            alert(t('login.invalid_credentials'));
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen w-full">
            <div className="w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <button
                        className={`px-4 py-2 font-semibold rounded-t-lg ${loginType === 'main' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'}`}
                        onClick={() => setLoginType('main')}
                    >
                        {t('login.main_login')}
                    </button>
                    <button
                        className={`px-4 py-2 font-semibold rounded-t-lg ${loginType === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'}`}
                        onClick={() => setLoginType('admin')}
                    >
                        {t('login.hospital_admin_login')}
                    </button>
                </div>
                <form onSubmit={handleLogin} className="w-full max-w-md bg-white p-8 rounded-b-xl shadow-md flex flex-col items-center">
                    <h2 className="text-2xl font-bold mb-4 text-center">
                        {loginType === 'main' ? t('login.main_login') : t('login.hospital_admin_login')}
                    </h2>
                    <input type="text" name="username" value={loginData.username} onChange={handleChange} placeholder={t('login.username_placeholder')} className="w-full p-3 border rounded-lg mb-4" />
                    <input type="password" name="password" value={loginData.password} onChange={handleChange} placeholder={t('login.password_placeholder')} className="w-full p-3 border rounded-lg mb-6" />
                    <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">{t('login.login_button')}</button>
                </form>
                <div className="absolute top-8 right-8">
                    <LanguageSelector />
                </div>
            </div>
        </div>
    );
};

export default Login;