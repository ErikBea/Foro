import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//Imports de los jsx
import Home from './pages/Home.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Post from "./pages/Post.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import NewPost from "./pages/NewPost.jsx";

function App() {
  //Vista principal que ejecuta el resto de jsx
  return (
    //Ocupa toda la pantalla por defecto para que el footer se mantenga siempre en la parte inferior
    <div className="d-flex flex-column min-vh-100">
      {/* Gestiona las rutas */}
      <Router>
        {/* jsx del Header visible en todas las rutas */}
        <Header/>
        {/* Estilos para que ocupe todo el espacio disponible y de esta forma el footer este en la aprte interior en paginas mas pequeñas */}
        <main className="flex-fill">
          {/* Listado de rutas para las vistas y su respectivos jsx */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/posts/:id" element={<Post />} />
            <Route path="/new-post" element={<NewPost />} />
          </Routes>
        </main>
        {/* jsx del Footer visible en todas las rutas */}
        <Footer/>
      </Router>
    </div>
  )
}

export default App
