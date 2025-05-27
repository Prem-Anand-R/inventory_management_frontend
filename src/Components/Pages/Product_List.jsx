import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdDeleteForever } from "react-icons/md";
import { FaPenToSquare } from "react-icons/fa6";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Product_List() {

    const [productListData, setProductListData] = useState([]);
    const [formTable, setFormTable] = useState('Add');
    const [productList, setProductList] = useState({
        productName: '',
        productPrice: '',
        stocks: ''
    });
    const [getProductId, setGetProductId] = useState(-1);
    const [getProductList, setGetProductList] = useState({
        productName: '',
        price: '',
        stock: ''
    });
    const [productListValues, setProductListValues] = useState([]);
    const [updateCheckProduct, setUpdateCheckProduct] = useState([]);

    useEffect(() => {
        fetData();
        const setTime=()=>{
            fetData();

        }
       const time= setInterval(setTime,500);
       return ()=> {
        fetData();
        clearInterval(time);
    }

    }, []);

    function fetData(){
        axios.get('http://localhost:3008/productList')
        .then((res) => {
            setProductListData(res.data);
            setProductListValues(res.data.map((data) => {
                return data.product_name;
            }))
        })
        .catch(err => console.log(err));
    }

   
    const handleAddSubmit = (e) => {
        e.preventDefault();
        const productExists = productListValues.find((data) => data === productList.productName);    
        if (!productExists) {         
            axios.post('http://localhost:3008/productListUp', productList)
                .then(res => {
                    setProductList({
                        productName: '',
                        productPrice: '',
                        stocks: ''
                    });
                    console.log(res);
                })
                .catch(err => console.log(err));

                toast.success('Product Added successfully!', {
                    position: "top-right",
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    });
        } else {
         
            toast.warn(' Product already exists', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    };
    

    const handleProductUpdate = (event) => {
        event.preventDefault();     
        if(updateCheckProduct.product_name === getProductList.productName && updateCheckProduct.product_price === getProductList.price && updateCheckProduct.stocks === getProductList.stock)
        {
            toast.info('No changes detected', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                });
        }else{
        axios.put('http://localhost:3008/listupdate/' + getProductId, getProductList)
            .then(res => {
                setFormTable('Add');
                setProductList({
                    productName: '',
                    productPrice: '',
                    stocks: ''
                });
                console.log(res)
            })
            .catch(err => console.log(err))
            toast.success('Update Successfully', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                });
        }
    }

    const checkForm = () => {
        switch (formTable) {
            case 'Add':
                return (
                    <>
                        <h6 className='text-center fw-bold '>Adding Values </h6>
                        <form className="row g-3 needs-validation" onSubmit={handleAddSubmit}>
                            <div className="col-md-12">
                                <label for="validationCustom01" className="form-label">Product Name</label>
                                <input type="text" className="form-control" id="validationCustom01" placeholder='product name'
                                    value={productList.productName} onChange={(e) => {
                                        setProductList({ ...productList, productName: e.target.value })
                                    }}
                                    required />
                                <div className="valid-feedback">
                                    Looks good!
                                </div>
                            </div>
                            <div className="col-md-12">
                                <label for="validationCustom02" className="form-label">Price</label>
                                <input type="text" className="form-control" id="validationCustom02" placeholder='price'
                                    value={productList.productPrice} onChange={(e) => {
                                        setProductList({ ...productList, productPrice: e.target.value })
                                    }}
                                    required />
                                <div className="valid-feedback">
                                    Looks good!
                                </div>
                            </div>
                            <div className="col-md-12">
                                <label for="validationCustom02" className="form-label">Stock</label>
                                <input type="text" className="form-control" id="validationCustom02" placeholder='stocks'
                                    value={productList.stocks} onChange={(e) => {
                                        setProductList({ ...productList, stocks: e.target.value })
                                    }} required />
                                <div className="valid-feedback">
                                    Looks good!
                                </div>
                            </div>

                            <div className="col-12">
                                <button className="btn btn-primary" type="submit">Add</button>
                            </div>
                        </form>
                    </>
                );
                break;
            case 'Update':
                return (
                    <>
                        <h6 className='text-center fw-bold '>Updating Values </h6>
                        <form className="row g-3 needs-validation" onSubmit={handleProductUpdate}>
                            <div className="col-md-12">
                                <label for="validationCustom01" className="form-label">Product Name</label>
                                <input type="text" className="form-control" id="validationCustom01" placeholder='product name'
                                    value={getProductList.productName} onChange={e => setGetProductList({ ...getProductList, productName: e.target.value })} required />
                                <div className="valid-feedback">
                                    Looks good!
                                </div>
                            </div>
                            <div className="col-md-12">
                                <label for="validationCustom02" className="form-label">Price</label>
                                <input type="text" className="form-control" id="validationCustom02" placeholder='price' value={getProductList.price} onChange={e => setGetProductList({ ...getProductList, price: e.target.value })} required />
                                <div className="valid-feedback">
                                    Looks good!
                                </div>
                            </div>
                            <div className="col-md-12">
                                <label for="validationCustom02" className="form-label">Stock</label>
                                <input type="text" className="form-control" id="validationCustom02" placeholder='stocks' value={getProductList.stock} onChange={e => setGetProductList({ ...getProductList, stock: e.target.value })} required />
                                <div class="valid-feedback">
                                    Looks good!
                                </div>
                            </div>
                            <div className="col-12">
                                <button className="btn btn-primary" type="submit">Update</button>
                            </div>
                        </form>
                    </>
                );
                break;
            default:
                return alert("Undefined Vales")
        }
    }
   

    const updateList = (id) => {
        fetch('http://localhost:3008/productList1/' + id)
            .then((res) => res.json())
            .then(data => {
                setGetProductList({
                    productName: data[0]?.product_name,
                    price: data[0]?.product_price,
                    stock: data[0]?.stocks
                });
                setUpdateCheckProduct(data[0]);
            })
            .catch(err => console.log(err))
    }


    return (
        <>
            <div className="row mx-3 my-3">
                <h2>Product List</h2>
                <hr />

                {/* form  */}

                <div className='col-lg-4 col-sm-12 my-3 formList me-3 p-4'>
                    {checkForm()}
                </div>

                {/* TABLE */}

                <div className='col-lg-7 col-sm-12 my-3'>
                    <div className='tableList table-responsive'>
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Product_Name</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Stock</th>
                                </tr>

                            </thead>
                            <tbody>
                                {productListData.map((data, index) => {
                                    return (<tr>
                                        <th scope="row">{index + 1}</th>
                                        <td>{data.product_name}</td>
                                        <td>{data.product_price}</td>
                                        <td>{data.stocks}</td>
                                        <td className='text-success fs-6 pointerClass' onClick={() => {
                                            setFormTable('Update');
                                            setGetProductId(data.product_id);
                                            updateList(data.product_id)
                                        }}><FaPenToSquare /></td>
                                    </tr>)
                                })}

                            </tbody>
                        </table>
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

export default Product_List