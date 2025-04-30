import React, { useState } from 'react';
import axios from 'axios';

const LoginPopup = ({ onClose, onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!email || !password) {
            setError('Vui lòng nhập email và mật khẩu');
            return;
        }
    
        try {
            const formData = new URLSearchParams();
            formData.append('username', email);
            formData.append('password', password);
    
            const response = await axios.post(
                'http://127.0.0.1:8000/auth/login',
                formData,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );
    
            const { access_token, token_type } = response.data;
            localStorage.setItem('token', access_token);
            localStorage.setItem('token_type', token_type);
    
            const userResponse = await axios.get('http://127.0.0.1:8000/user/me', {
                headers: {
                    Authorization: `${token_type} ${access_token}`,
                },
            });
    
            onLoginSuccess(access_token, userResponse.data);
            onClose();
        } catch (err) {
            console.error('Login error:', err);
            if (err.response?.data?.detail) {
                setError(err.response.data.detail);
            } else {
                setError('Đăng nhập thất bại. Vui lòng thử lại.');
            }
        }
    };
    

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-80 relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold">
                    &times;
                </button>
                <h2 className="text-xl font-bold mb-4">Đăng nhập</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            className="w-full px-3 py-2 border rounded"
                            placeholder="Nhập email của bạn"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Mật khẩu</label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 border rounded"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                        Đăng nhập
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPopup;