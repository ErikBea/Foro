function Commentary ({commentary, onDelete, isOwner})
{
    //Un elemento comentario que es mostrado en Post
    return(
        <div className="card mb-3 p-2" key={commentary.id}>
            {/* Usuario y hace cuanto se publico, informacion de usaurio esta sin implementar */}
            <p><a href="#">{commentary.user.username}</a> ({commentary.published_ago})</p>
            <p>{commentary.content}</p>
            {/* Si es el usaurio propietario puede eliminar el comentario */}
            {isOwner &&
            <div>
                <button className="btn btn-danger" onClick={onDelete} >Eliminar</button>
            </div>}
        </div>
    );
}

export default Commentary;