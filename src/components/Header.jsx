import { useEffect, useState } from "react";
import logo from "../assets/fw.png";
import { Dropdown } from 'bootstrap';

function Header(){
    // Datos del usuario
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        // Obtiene el usuario a partir del token en caso de estar almacenado en sesion
        if(!sessionStorage.getItem("token"))
            return;
        const getUser = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/me`, {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
                        },
                    }
                );
                const data = await response.json();
                if (response.ok)
                {
                    sessionStorage.setItem("user", JSON.stringify(data.user));
                    setUser(data.user);
                }
                    
            } catch (e) {
                // Si no se ha podido recuperr el token significa que se ha burrado de la BBDD
                // .. elimina el token de la sesion y requiere de volver a hacer log-in
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("user");
                console.log(e.message);
            }
        };

        getUser();
    }, []);

    function logout() {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        window.location.href = `/login`;
    }

    //Estructura del header con Bootstrap
    return(
        <header className="p-3 bg-dark text-white mb-4">
            <div className="container">
                <div className="d-flex align-items-center justify-content-between">
                    {/* Logo con enlace a home */}
                    <a href="/" className="d-flex align-items-center mb-2 mb-lg-0">
                        <img src={logo} width="40" height="40" aria-label="Foro" />
                    </a>

                    <div className="me-lg-auto" />

                    {/* Seccion de usuario */}
                    <div className="text-end">
                    {!user ? (
                        //Si el usuario no tiene la sesion inciada muestra el boton de inicio de sesion y registro
                        <>
                            <button type="button" className="btn btn-outline-light me-2" onClick={() => window.location.href = `/login`}>
                                Iniciar sesión
                            </button>
                            <button type="button" className="btn btn-warning" onClick={() => window.location.href = `/register`}>
                                Registrarse
                            </button>
                        </>
                        ) : 
                        (
                        //Si no muestra los datos del usuario y un desplegable para cerrar la sesión
                        <div className="dropdown">
                            <button className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown">
                                {user.username}
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li><a className="dropdown-item" href="#" onClick={logout}>Cerrar sesión</a></li>
                            </ul>
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header;