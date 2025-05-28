import React, { useEffect, useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import { IoStatsChart } from "react-icons/io5";
import { TbChartArcs, TbChartPie } from "react-icons/tb";
import PieChart1 from './Charts/PieChart1';
import PieChart2 from './Charts/PieChart2';
import ColumnChart1 from './Charts/ColumnChart1';
import PieChart3 from './Charts/PieChart3';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';


function Dashboard({setLoggedIn}) {

    const [totalStock, setTotalStock] = useState(0);
    const [totalInward, setTotalInward] = useState(0);
    const [totalOutward, setTotalOutward] = useState(0);
    const navigate = useNavigate();
    
    useEffect(() => {
        axios.get('https://inventory-api-00rj.onrender.com/totalProductSum')
            .then((res) => {
                setTotalStock(res.data[0].total);
            })
            .catch((err) => console.log(err));

        axios.get('https://inventory-api-00rj.onrender.com/inwardSum')
            .then((res) => {
                setTotalInward(res.data[0].total);
               
            })
            .catch((err) => console.log(err));

        axios.get('https://inventory-api-00rj.onrender.com/outwardSum')
            .then((res) => {
                setTotalOutward(res.data[0].total);
               
            })
            .catch((err) => console.log(err));

    }, [])


    return (
        <>
            {/* top nav  */}
            <div className="head">
                <header className="p-2 mb-3 border-bottom">
                    <div className="container">
                        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                            <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 text-dark text-decoration-none">

                            </a>

                            <h2 className="nav col-12 col-lg-auto me-lg-auto mb-2  mb-md-0">
                                Dashboard
                            </h2>

                            <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
                                <input type="search" className="form-control" placeholder="Search..." aria-label="Search" />
                            </form>

                            <div className="dropdown text-end">
                                <a href="#" className="d-block link-dark text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                    <img src='https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=740&t=st=1704194994~exp=1704195594~hmac=116bc5ebb3af9c46699725dfb0b9d63280ce62bbbbd2f1da6c9940887b12e3e0' alt="mdo" width="32" height="32" className="rounded-circle" />
                                </a>
                                <ul className="dropdown-menu text-small">
                                    <li onClick={() => {
                                        toast.success('Successfully Logout!');
                                       
                                       setTimeout(()=>{
                                        setLoggedIn(true)
                                        navigate('/');                                        
                                       },2000);
                                    }}><a className="dropdown-item pointer-event">Sign out</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </header>                
            </div>
            <div className='row p-0 m-0'>
                <div className='col-lg-9 p-0 col-sm-6'>

                    {/* cards  */}

                    <div className='row mx-3 m-0 p-0 mb-4 '>
                        <div className=" col-lg-2 col-sm-12 my-2 mx-3 d-flex justify-content-around  toplist ">
                            <div className='p-3  my-2 toplisticon text-success'><TbChartArcs /></div>
                            <div className='p-3'>
                                <h1 className='text-success'> {totalInward}</h1>
                                <p className=' text-success  ' style={{ fontSize: '14px', fontWeight: 'bold' }}>Total Purchase Products </p>
                            </div>
                        </div>
                        <div className=" col-lg-2 col-sm-12 mx-3 my-2 d-flex justify-content-around  toplist ">
                            <div className='p-3  my-2 toplisticon text-danger' ><TbChartPie /></div>
                            <div className='p-3'>
                                <h1 className='text-danger'> {totalOutward}</h1>
                                <p className=' text-danger' style={{ fontSize: '13px', fontWeight: 'bold' }}>Total Sales Products </p>
                            </div>
                        </div>
                        <div className=" col-lg-2 col-sm-12 my-2 mx-2 d-flex justify-content-around   toplist ">
                            <div className='p-3  my-2 toplisticon text-primary'><IoStatsChart /></div>
                            <div className='p-3'>
                                <h1 className='text-primary'>{totalStock}</h1>
                                <span className='text-primary' style={{ fontSize: '14px', fontWeight: 'bold' }}>Available Products</span>
                            </div>
                        </div>



                    </div>

                    {/* charts  */}
                    <div className='row p-0 m-0 ms-4'>
                        <div className='col-lg-5 col-sm-12  chartBar me-3  my-2 d-flex justify-content-around'>
                            <div className='my-5 pt-3  mx-4 ' >
                                <PieChart1 />
                            </div>
                        </div>
                        <div className='col-lg-6 col-sm-12  chartBar  my-2  p-3' >
                            <ColumnChart1 />
                            <h6 className='text-center'>Sales in Month</h6>
                        </div>

                    </div>
                </div>
                <div className='col-lg-3 col-sm-6 mt-2 px-2'>
                    <div className='chartBar d-flex justify-content-center '>
                        <div>
                            <PieChart3 />
                            <h6 className='text-center mt-3'>Particular Product Availability</h6>
                        </div>
                    </div>
                    <div className=' d-flex justify-content-center mt-4 p-2 chartBar'>
                        <div>
                            <PieChart2 />

                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    )
}

export default Dashboard