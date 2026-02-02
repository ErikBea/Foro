//Filtros que se muestran en el menu home
function PostFilter({ filter, theme, setTheme, themes, order, setOrder, search, setSearch }){
    return(
        //Al enviar se ejecuta la funcion filter
        <form onSubmit={filter} className="mb-3">
            {/* Filtrado por tema para mostrar unicamente los que pertenezcana  esta tematica */}
            <label htmlFor="theme">Tema</label>
            <select className="form-control mb-2" value={theme} onChange={(e) => setTheme(e.target.value)}>
                <option value="">Todos</option>
                {/* Listado de temas con su id obtenidos de home-> api/themes */}
                {themes.map(t =>(
                    <option key={t.id} value={t.id}>{t.name}</option>
                ))}
            </select>
            <label htmlFor="order">Ordenar por</label>
            {/* Tipos de ordenacion para mostrar primero los mas nuevos o los mas gustados */}
            <select className="form-control mb-2" value={order} onChange={(e) => setOrder(e.target.value)}>
                <option value="likes">Likes</option>
                <option value="recent">Recientes</option>
            </select>
            {/* Buscador para buscado por nombre */}
            <label htmlFor="Search">Buscar</label>
            <input type="text" className="form-control mb-3" placeholder="Título..." value={search} onChange={(e) => setSearch(e.target.value)} />

            <button type="submit" className="btn btn-primary">Filtrar</button>
        </form>
    );
}

export default PostFilter;