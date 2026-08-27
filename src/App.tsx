import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home.tsx";
import About from "./pages/About.tsx";
import Navigation from "./components/Navigation.tsx";
import Contact from "./pages/Contact.tsx";
import Experience from "./pages/Experience.tsx";
import Projects from "./pages/Projects.tsx";

function App() {

  return (
    <div className={'bg-blank text-blank min-h-screen p-5'}>
      {/* maybe move to separate component later */}
      <BrowserRouter>
        {/*
        <p className={'bg-green-400 sm:bg-blue-400 md:bg-red-400 lg:bg-pink-400 xl:bg-purple-400 2xl:bg-amber-400'}>example</p>
        */}
        <div className={'flex justify-center m-1 mt-8'}>
          <Navigation />
        </div>


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
