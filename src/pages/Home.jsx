import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import PostFilter from "../components/PostFilter";
import ModalError from "../components/ModalError";
import { Modal as BootstrapModal } from 'bootstrap';

function Home() {
    const [posts, setPosts] = useState([]); //Listado de posts
    const [nextPage, setNextPage] = useState(null); //Url para los siguientes 10 post
    const [themes, setThemes] = useState([]); //Listado de temas para desplegable de filtrado de posts
    const [order, setOrder] = useState("likes"); //Ordenacion de los posts para filtrado
    const [theme, setTheme] = useState(""); //Tema activo para filtrado de posts
    const [search, setSearch] = useState(""); //Busqueda por titulo
    const [modal, setModal] = useState(""); //Mensaje que muestra el modal

    //Añade mas posts a la lista actual, cambia el url de los siguientes por el nuevo o null si no existe
    function addPosts(data)
    {
        const newList = posts.concat(data.posts.data);
        setPosts(newList);
        if(data.posts.next_page_url)
            setNextPage(data.posts.next_page_url);
        else
            setNextPage(null);
    }

    //Obtencion de datos inicial
    useEffect(() => {
        //Obtiene todos los posts sin filtrar y los asigna
        const getPosts = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/posts`
                );
                const data = await response.json();

                if (response.ok) {
                    addPosts(data);
                }
            } catch (e) {
                //Devuelve un error en el modal
                console.log(e.message);
                setModal("Error obtener el listado.");
                BootstrapModal.getOrCreateInstance(document.getElementById('modal')).show();
            }
        };

        //Obtiene todos los temas para asignar al select
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
                console.log(e.message);
                setModal("Error al obtener los temas.");
                BootstrapModal.getOrCreateInstance(document.getElementById('modal')).show();
            }
        };

        //Ejecuta las funciones
        getThemes();
        getPosts();
    }, []);

    //Obtiene mas posts mediante el usestate nextPage, que carga hasta los 10 siguientes posts
    function loadMore() {
        //Si no hay mas posts que cargar no se ejecuta
        if (!nextPage) return;

        const getPosts = async () => {
            try {
                const response = await fetch(
                    nextPage
                );
                const data = await response.json();

                if (response.ok) {
                    //Añade los nuevos posts a los que ya estaban cargados
                    addPosts(data);
                }
            } catch (e) {
                //Devuelve un error en el modal
                console.log(e.message);
                setModal("Error al cargar más resultados.");
                BootstrapModal.getOrCreateInstance(document.getElementById('modal')).show();
            }
        };
        getPosts();
    }

    //Filtra los posts y segun los parametros de burqueda y ordenacion del usaurio
    const filter = async(e) => {
        e.preventDefault();
        //Crea un nuevo listado de parametros
        const searchParams = new URLSearchParams();

        //Si alguno de los useState de filtrado se ha modificado se añade a la ruta
        if (order) searchParams.append("order", order);
        if (theme) searchParams.append("theme", theme);
        if (search) searchParams.append("search", search);

        try {
            //Obtiene un nuevo listado con los filtros
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/posts?${searchParams.toString()}`
            );
            const data = await response.json();

            if (response.ok)
            {
                //Crea una nueva lista de posts y si exsite una segunda página lo guarda para cargar con nextPage
                setPosts(data.posts.data);
                setNextPage(data.posts.next_page_url ?? null);
            } 
        } catch (e) {
            //Devuelve un error en el modal
            console.log(e.message);
            setModal("Error al filtrar.");
            BootstrapModal.getOrCreateInstance(document.getElementById('modal')).show();
        }
    }

    return (
        <div className="container mt-4">
            {/* Modal para mostrar errores */}
            <ModalError title="Error" message={modal} />
            {/* Si la sesion ha sido iniciada, permite crear un post */}
            {sessionStorage.getItem("user") && 
            //Boton para crear post
            <button className="btn btn-success mb-4" onClick={() => window.location.href = `/new-post`}>Nuevo Post</button>}
            {/* Filtros de posts, actualizan y muestran datos de los useState */}
            <PostFilter filter={filter} theme={theme} setTheme={setTheme} themes={themes} 
            order={order} setOrder={setOrder} search={search} setSearch={setSearch} />
            
            {/* Lista los posts */}
            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
            {/* Si hay mas resultados muestra el boton de ver mas que carga la siguiente pagina */}
            {nextPage &&
                <div className="d-flex justify-content-center mt-3">
                    <button className="btn btn-secondary w-25" onClick={loadMore}>
                        Ver más
                    </button>
                </div>
            }
        </div>
    );
}

export default Home;