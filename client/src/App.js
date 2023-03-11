import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import LoginPage from "./pages/LoginPage";
import Homepage from "./pages/Homepage";
import RegisterPage from "./pages/RegisterPage";
import Navbar from "./pages/Navbar";
import { AuthProvider, AuthContext } from './context/auth';
import React, { useContext } from 'react';

function App() {

  const Private = ({children}) => {
    const { authorized } = useContext(AuthContext)
    if( !authorized ) return <Navigate to="/login"/>
    return(children)
  }

  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Routes>       
            <Route exact path= "/login" element = {<LoginPage/>} />
            <Route exact path= "/cadastro" element = { <RegisterPage/> } />
            <Route exact path= "/nav" element = { <Navbar/> } />
            <Route exact path= "/" element = {
              <Private>
                <Homepage/>
              </Private>
            }/>
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
