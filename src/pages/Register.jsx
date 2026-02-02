import React, { useEffect, useState } from 'react';
import { Modal as BootstrapModal } from 'bootstrap';
import ModalError from '../components/ModalError';

function Register() {
    const [username, setUsername] = useState(''); //Nombre de usuario del formulario
    const [email, setEmail] = useState(''); //Email del formulario
    const [password, setPassword] = useState(''); //Contraseña del formulario
    const [modal, setModal] = useState(""); //Mensaje que muestra el modal

    //Accion de registro
    const register = async (e) => {
        e.preventDefault();

        const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();

        //Error al intentar registrar
        if (!response.ok)
        {
            //Devuelve un modal con error y el lsitado de errores
            setModal(`Error en la validación de datos: ${data.errors}`);
            BootstrapModal.getOrCreateInstance(document.getElementById('modal')).show();
        }
        else
            //Si se ha podido registrar redirige al inicio de sesion
            window.location.href = `/login`;
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
            {/* Formulario de registro */}
            <form onSubmit={register}>
                <h2>Registrar</h2>

                <label htmlFor="username">Usuario:</label>
                <input type="text" className="form-control mb-3" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />

                <label htmlFor="email">Email:</label>
                <input type="email" className="form-control mb-3" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                <label htmlFor="password">Contraseña:</label>
                <input type="password" className="form-control mb-3" id="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />

                <button type="submit" className='btn btn-primary' >Registrar</button>
            </form>
        </div>
    );
};

export default Register;