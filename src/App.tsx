import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home.tsx";
import About from "./pages/About.tsx";
import Navigation from "./global-components/Navigation.tsx";
import Contact from "./pages/Contact.tsx";
import Experience from "./pages/Experience.tsx";
import Projects from "./pages/Projects.tsx";

function App() {

  return (
    <div className={'bg-blank text-blank min-h-screen p-5'}>
      {/* maybe move to separate component later */}
      <BrowserRouter>
        <Navigation />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
