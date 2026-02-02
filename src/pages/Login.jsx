import React, { useEffect, useState } from 'react';
import { Modal as BootstrapModal } from 'bootstrap';
import ModalError from '../components/ModalError';

const Login = () => {
    const [email, setEmail] = useState(''); //Email del formulario
    const [password, setPassword] = useState(''); //Contraseña del formulario
    const [modal, setModal] = useState(""); //Mensaje que muestra el modal

    //Acion de inicio de inicio de sesion
    const login = async (e) => {
        e.preventDefault();

        const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        //Error al iniciar sesión
        if (!response.ok) {
            //Devuelve un modal con error
            setModal(`Error al iniciar sesión.`);
            BootstrapModal.getOrCreateInstance(document.getElementById('modal')).show();
        }
        else //Inicio de sesion satisfactorio
        {
            //Obtiene el token de sesion y lo almacena en cokies de sesion
            const data = await response.json();
            const tokenUsuario = data.token;

            if (tokenUsuario) {
                sessionStorage.setItem("token", tokenUsuario);
                //Redirige a home
                window.location.href = `/`;
            }
        }
    };

    //Si ya tenia un token activo impide entrar al registro y redirige al home
    useEffect(() => {
        if(sessionStorage.getItem("token"))
            window.location.href = `/`;
    }, []);

    return (
        <div className="container" style={{ maxWidth: "500px" }}>
            {/* Modal que muestra los errores */}
            <ModalError title="Error" message={modal} />
            {/* Formulario de inicio de sesion */}
            <form onSubmit={login}>
                <h2>Iniciar sesión</h2>

                <label htmlFor="email">Email:</label>
                <input type="email" className="form-control mb-3" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                <label htmlFor="password">Contraseña:</label>
                <input type="password" className="form-control mb-3" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                <button type="submit" className='btn btn-primary' >Iniciar sesión</button>
            </form>
        </div>
    );
};

export default Login;