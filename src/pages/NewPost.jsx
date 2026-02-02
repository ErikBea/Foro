import { useEffect, useState } from "react";
import { Modal as BootstrapModal } from 'bootstrap';
import ModalError from "../components/ModalError";

function NewPost(){
    const [themes, setThemes] = useState([]); //Temas para el desplegable del formulario
    const [theme, setTheme] = useState(""); //Tema del nuevo post
    const [title, setTitle] = useState(""); //Titulo del nuevo post
    const [content, setContent] = useState(""); //Contenido del nuevo post
    const [modal, setModal] = useState(""); //Mensaje que muestra el modal

    //carag de datos inicial
    useEffect(() => {
        //Obtiene todos los temas y los almacena el el useState
        const getThemes = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/themes`
                );
                const data = await response.json();

                if (response.ok) {
                    setThemes(data.themes);
                }
            } catch (e) {
                //Devuelve un error en el modal
                console.error(e.message);
                setModal("Error al obtener los temas.");
                BootstrapModal.getOrCreateInstance(document.getElementById('modal')).show();
            }
        };

        //Si no ha iniciado sesion redirige al inicio de sesion
        if(!sessionStorage.getItem("token"))
            window.location.href = `/login`;

        getThemes();
    }, []);

    //Publica un nuevo post
    const post = async(e) =>{
        e.preventDefault();

        const response = await fetch(`${import.meta.env.VITE_API_URL}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
            },
            body: JSON.stringify({ theme_id: theme, title, content }),
        });

        const data = await response.json();

        if (!response.ok) {
            //Devuelve un error en el modal
            setModal(`Error al crear el post: ${data.errors}`);
            BootstrapModal.getOrCreateInstance(document.getElementById('modal')).show();
        }
        else
            //En caso de crearse satisfactoriamente redirige al listado de posts
            window.location.href = `/`;
    }

    return(
        <div className="container mt-4" style={{ maxWidth: "800px" }}>
            {/* Modal que muestra los errores */}
            <ModalError title="Error" message={modal} />
            {/* Formulario para nuevo post */}
            <form onSubmit={post}>
                <label for="theme">Tema</label>
                <select className="form-control" value={theme} onChange={(e) => setTheme(e.target.value)} required>
                    <option value="">Selecciona un tema</option>
                    {/* Listado de temas obtenido desde useState de themes */}
                    {themes.map(t =>(
                        <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                </select>

                <label htmlFor="title">Titulo:</label>
                <input type="text" className="form-control mb-3" placeholder="Post title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={255} required />

                <label htmlFor="title">Contenido:</label>
                <textarea type="text" rows="3" className="form-control mb-3" value={content} onChange={(e) => setContent(e.target.value)} required />

                <button type="submit" className="btn btn-primary">Publicar</button>
            </form>
        </div>
    );
}

export default NewPost;