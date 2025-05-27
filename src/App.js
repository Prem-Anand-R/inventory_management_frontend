import LoginPage from './Components/Pages/LoginPage';
import { BrowserRouter, Route, Routes,Navigate} from 'react-router-dom';
import Dashboard from './Components/Pages/Dashboard'
import Sidebar from './Components/Sidebar';
import Product_List from './Components/Pages/Product_List';
import Inward from './Components/Pages/Inward';
import Outward from './Components/Pages/Outward';
import {React,useState} from 'react'

function App() {

  const storedLoggedIn = localStorage.getItem('loggedIn')
  const [loggedIn, setLoggedIn] = useState(storedLoggedIn === 'true');

  const handlelogin =()=>{
    setLoggedIn(true)
    localStorage.setItem('loggedIn','true')
  }

  const handlelogout = ()=>{
    setLoggedIn(false)
    localStorage.setItem('loggedIn','false')
  }

  return (
    <BrowserRouter>
      <Routes>
	  
        <Route path="/" element={!loggedIn ? (<LoginPage  setLoggedIn={handlelogin} />):(<Navigate to={'/dashboard'} />)} />
        <Route path="/dashboard" element={loggedIn ? (<Sidebar ><Dashboard setLoggedIn={handlelogout}/> </Sidebar>) :(<Navigate to={"/"} />)} />
          <Route path="/outward" element={loggedIn ? (
          <Sidebar>
            <Outward />
          </Sidebar>):(<Navigate to={"/"} />)

          }/>
          <Route path="/inward" element={
           loggedIn ? (
            <Sidebar>
              <Inward/>
            </Sidebar>):(<Navigate to={"/"} />)

          }/>
          <Route path="/productList" element={
            loggedIn ? (
            <Sidebar >
              <Product_List />
            </Sidebar>):(<Navigate to={"/"} />)

          }/>
         </Routes>


    </BrowserRouter>

  );
}

export default App;
