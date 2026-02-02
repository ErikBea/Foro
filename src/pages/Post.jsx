import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostInfo from "../components/PostInfo";
import ModalAction from "../components/ModalAction";
import Commentary from "../components/Commentary";
import ModalError from "../components/ModalError";
import { Modal as BootstrapModal } from 'bootstrap';

function Post() {
    const { id } = useParams(); //Id obtenido desde home (id del post)
    //Objeto usuario obtenido de la sesión o null si no existe la sesion
    const [user, setUser] = useState(() => 
        sessionStorage.getItem("user") ?
            JSON.parse(sessionStorage.getItem("user")) : null);
    const [post, setPost] = useState(null); //Datos del post
    const [like, setLike] = useState(false); //Se le ha dado o no like al post por el usuario
    const [likeCount, setLikeCount] = useState(-1); //Cantidad de likes que se le han dado al post
    const [commentary, setCommentary] = useState(''); //Comentario que puede escribir el usaurio para enviarlo sobre el post
    const [modal, setModal] = useState(""); //Mensaje de error para el modal

    //Se ejecuta una vez al instanciar el jsx
    useEffect(() => {
        //Obtiene la informacion del post
        const getPost = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/posts/${id}`
                );
                const data = await response.json();

                if (response.ok)
                {
                    //Asigna el post y los likes
                    setPost(data.post);
                    setLikeCount(data.post.likes_count);
                }
            } catch (e) {
                //Devuelve un error en el modal
                console.log(e.message);
                setModal("Error obtener el post.");
                BootstrapModal.getOrCreateInstance(document.getElementById('modal')).show();
            }
        };

        //Obtiene la informacion de si ha hecho like o no al post
        const getLike = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/${id}/like`, {
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
                    }},
                );
                const data = await response.json();

                //asigna el estado
                if (response.ok)
                    setLike(data.liked);
            } catch (e) {
                //Devuelve un error sin modal
                console.log(e.message);
            }
        };

        getPost();
        //Si la sesion no esta iniciada no obtiene el like
        if (sessionStorage.getItem("user")) getLike();
    }, []);

    //Envia un comentario al post
    const comment = async (e) => {
        e.preventDefault();

        const response = await fetch(`${import.meta.env.VITE_API_URL}/commentaries`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
            },
            body: JSON.stringify({ content: commentary, post_id: id }),
        });

        if (!response.ok) {
            //Devuelve un error en el modal
            console.log(e.message);
            setModal("Error al enviar el mensaje.");
            BootstrapModal.getOrCreateInstance(document.getElementById('modal')).show();
        }
        else
        {
            const data = await response.json();

            //Añade el comentario a los que ya estaban en el elemento post
            setPost(prevPost => ({
                ...prevPost,
                commentaries: [data.commentary, ...prevPost.commentaries],
            }));
            //Limpia el comentario
            setCommentary("");
        }
    };

    //Elimina el post
    const removePost = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
            },
            body: JSON.stringify({ id }),
        });

        //Si se ha eliminado vuleve al listado de posts
        if(response.ok)
            window.location.href = `/`;
        else
        {
            //Si no muestra el error de que no se ha podido eliminar en el modal
            setModal("Error intentar eliminar el post.");
            BootstrapModal.getOrCreateInstance(document.getElementById('modal')).show();
        }
    }

    //Elimina un comenatrio
    const removeCommentary = async (commentaryId) => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/commentaries/${commentaryId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
            },
            body: JSON.stringify({ content: commentary, post_id: id }),
        });

        if(response.ok)
        {
            //Lo elimina de la vista
            setPost(prevPost => ({
                ...prevPost,
                commentaries: prevPost.commentaries.filter(c => c.id !== commentaryId),
            }));
        }
        else{
            //Muestra un error en el modal
            setModal("Error intentar eliminar el comentario.");
            BootstrapModal.getOrCreateInstance(document.getElementById('modal')).show();
        }
    }

    //Añade/elimina el like del post
    const likePost = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/${id}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
            }
        });

        //Si se ha podido ejecutar la accion actualiza los useState con el nuevo estado y la nueva cuenta
        if(response.ok)
        {
            const data = await response.json();
            setLike(data.liked);
            setLikeCount(data.count);
        }
        else
        {
            //Muestra un error en el modal
            setModal("Error intentar hacer like.");
            BootstrapModal.getOrCreateInstance(document.getElementById('modal')).show();
        } 
    }

    //Devuelve los permisos para el id especificado
    function isOwner(ownerId)
    {
        //Si es administrador tiene permisos sobre todo
        if (user.role == "admin")
            return true;
        //Si el id del elemento en cuestion coincide con el del usaurio, tiene permisos
        return user.id == ownerId;
    }

    //Si el post todavia no ha cargado muetsra un mensaje 
    if(!post)
        return <p>Cargando...</p>;

    return (
        <div className="container mt-4">
            {/* Modal para mostrar errores */}
            <ModalError title="Error" message={modal} />
            {/* Muestra la informacion del post */}
            <PostInfo post={post} />
            {/* Si tiene permisos sobre el post muestra el boton de eliminacion */}
            {sessionStorage.getItem("user") && isOwner(post.user_id) &&
                <>
                    <button className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteConfirmation">Eliminar</button>
                    <ModalAction title="Eliminar" message="¿Seguro que quieres eliminar el Post?" onConfirm={removePost} />
                </>
            }

            <div className="container mx-auto">
                <hr />
                {/* Si tiene la sesion iniciada, muestra opcion de comentar y boton de like */}
                {sessionStorage.getItem("user") &&
                <>
                    <div>
                        {/* Si el usuario le ha dado a like lo muestra en verde, si no en gris */}
                        <button className={like ? "btn btn-success" : "btn btn-secondary"} onClick={likePost}>Like</button> {likeCount} Likes
                    </div>
                    {/* Seccion para poder enviar un comentario */}
                    <form className="my-4 text-end" onSubmit={comment}>
                        <input type="text" className="form-control mb-3" placeholder="Añade un comentario..." value={commentary} onChange={(e) => setCommentary(e.target.value)} required />
                        <button type="submit" className="btn btn-primary">Comentar</button>
                    </form>
                </>}
                {/* Lista todos los comentarios para el post */}
                {post.commentaries.map((commentary) => (
                    <Commentary key={commentary.id} commentary={commentary} onDelete={() => removeCommentary(commentary.id)} isOwner={sessionStorage.getItem("user") && isOwner(commentary.user_id)} />
                ))}
            </div>
        </div>
    );
}

export default Post;