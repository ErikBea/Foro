//Informacion del post que se encuentra en Post.jsx
function PostInfo({post})
{
    return(
        <>
            <span className="badge bg-primary">{post.theme.name}</span>
            {/* Usuario que ha creado el post, se trata com enlace aunque no se ha implementado informacion de usaurios */}
            <p><a href="#">{post.user.username}</a> ({post.published_ago})</p>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
        </>
    )
}

export default PostInfo;