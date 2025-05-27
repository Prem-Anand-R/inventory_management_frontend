import React, { useState } from 'react';
import { RiMenuUnfoldLine } from "react-icons/ri";
import { TfiDashboard } from "react-icons/tfi";
import {
    FaTh,
    FaBars,
    FaUserAlt,
    FaShoppingBag,
    FaThList
}from "react-icons/fa";
import { RiDashboardLine } from "react-icons/ri";
import { IoBagHandleOutline } from "react-icons/io5";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { GrOfflineStorage } from "react-icons/gr";
import { SiShopware } from "react-icons/si";
import { MdSpaceDashboard } from "react-icons/md";
import { NavLink } from 'react-router-dom';
import "../Components/App.css"


const Sidebar = ({children}) => {
    const[isOpen ,setIsOpen] = useState(false);
    const toggle = () => {setIsOpen (!isOpen);   
    };
    
    const menuItem=[
        {
            path:"/dashboard",
            name:"Dashboard",
            icon:<RiDashboardLine />
        },
        {
            path:"/outward",
            name:"Outward",
            icon:<IoBagHandleOutline/>
        },
       
       
        {
            path:"/inward",
            name:"inward",
            icon:<BiSolidPurchaseTag/>
        },
        {
            path:"/productList", 
            name:"List",
            icon:<GrOfflineStorage/>
        }
    ]
 
    
    return (
         <div className="container1">
        <div style={{width: isOpen ? "230px" : "55px"}} className="sidebar">
        <div className="top_section">
                <h1 style={{display: isOpen ? "block" : "none"}} className="logo">Inventory</h1>
                <div style={{marginLeft: isOpen ? "50px" : "0px"}} className="bars">
                    <SiShopware />
                </div>
            </div>
            {
                menuItem.map((item, index)=>(
                    <NavLink to={item.path} key={index} className="link " style={{textDecoration: 'none'}} activeclassName="active">
                        <div className="  ">
                            <div className='icon'>{item.icon}</div>
                            <div className='textName text-center'>{item.name}</div>
                        </div>
                        {/* <div style={{display:'flex',flexDirection:'column'}} className="link_text">{item.name}</div> */}
                    </NavLink>
                ))
            }
        </div>
        <main style={{ flex: 1, height: '100vh', overflowY: 'auto', padding: '0px' }} className="Main">{children}</main>
     </div>
    );
};

export default Sidebar;