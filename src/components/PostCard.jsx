import { Link } from "react-router-dom";

//Elemento de la lista de post
function PostCard({post}) {
    return(
        //Al hacer click sobre el elemento redirige a la página de información
        <Link key={post.id} to={`/posts/${post.id}`} className="text-decoration-none text-dark">
            <div key={post.id} className="card mb-3 p-2 clickable-card">
                <div>
                    <span className="badge bg-primary">{post.theme.name}</span>
                </div>
                {/* Devuelve el nombre de usuario, hace cuanto se publico y la canitdad de likes que tiene */}
                <p>{post.user.username} ({post.published_ago}) - {post.likes_count} Likes</p>
                <h3>{post.title}</h3>
                {/* Reduce el contenido del posts para mostrar solo 300 letras en vez de el post entero */}
                <p>{post.content.length > 300 ? post.content.slice(0,300) + "..." : post.content}</p>
            </div>
        </Link>
    );
}

export default PostCard;