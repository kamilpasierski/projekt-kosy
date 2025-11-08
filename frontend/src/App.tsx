import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from "./scenes/navbar";

import RegisterScene from './scenes/register';
import LoginScene from "./scenes/login";

const MainPage = () => {

    return (
        <div>
            <div style={{ paddingTop: '100px', height: '200vh' }}>
            </div>
        </div>
    );
};


function App() {

    return (
        <div className="app bg-gray-20">
            <BrowserRouter>
                <Navbar/>

                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/register" element={<RegisterScene />} />
                    <Route path="/login" element={<LoginScene />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App;