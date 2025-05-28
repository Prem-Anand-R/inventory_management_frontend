import React, { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import axios from 'axios';
import { MdDeleteForever } from "react-icons/md";
import { FaPenToSquare } from "react-icons/fa6";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import swal from 'sweetalert';
import { format } from 'date-fns';

const Inward = React.forwardRef((props, ref) => {

    const [productListData, setProductListData] = useState([]);
    const [inwardData, setInwardData] = useState([]);
    const [formTable, setFormTable] = useState('Add');
    const [inwardList, setInwardList] = useState({
        product_id: '',
        date: '',
        productName: '',
        productPrice: '',
        numProduct: ''
    });
    const [getProductId, setGetProductId] = useState(0);

    const [ids, setIds] = useState({
        id: '',
        productId: ''
    })

    const [getProductList, setGetProductList] = useState({
        product_id: '',
        date: '',
        productName: '',
        productPrice: '',
        numProduct: ''
    });
    const [updateCheckProduct, setUpdateCheckProduct] = useState([]);

    useEffect(() => {
        fetData();
        const setTime = () => {
            fetData();

        }
        const time = setInterval(setTime, 1000);
        return () => {
            fetData();
            clearInterval(time);
        }

    }, [])


    function fetData() {
        axios.get('https://inventory-api-00rj.onrender.com/inward')
            .then((res) => {
                setInwardData(res.data);
            })
            .catch(err => console.log(err));

        axios.get('https://inventory-api-00rj.onrender.com/productList')
            .then((res) => {
                setProductListData(res.data)
            })
            .catch(err => console.log(err));
    }

    const handleAddSubmit = async (e) => {
        e.preventDefault();

        try {

            await axios.post('https://inventory-api-00rj.onrender.com/inwardListUp', inwardList);

            setInwardList({
                product_id: '',
                date: '',
                productName: '',
                productPrice: '',
                numProduct: ''
            });
            toast.success('Product Added successfully!');


            await axios.put(`https://inventory-api-00rj.onrender.com/inward_listUpdate/${inwardList.product_id}`, inwardList);

        } catch (error) {
            console.error('Error:', error);
        }
    };


    const handleProductUpdate = async (event) => {
        try {
            event.preventDefault();

            const inwardListResponse = await fetch(`https://inventory-api-00rj.onrender.com/inwardList1/${ids.id}`);
            const inwardListData = await inwardListResponse.json();

            if (
                updateCheckProduct.product_name === getProductList.productName &&
                updateCheckProduct.price === getProductList.productPrice &&
                updateCheckProduct.num_product === getProductList.numProduct
            ) {
                toast.info('No changes detected', { /* toast configuration */ });
            } else {
                await axios.put(`https://inventory-api-00rj.onrender.com/inwardlist/${getProductId}`, getProductList);

                setFormTable('Add');
                setInwardList({ date: '', productName: '', productPrice: '', numProduct: '' });

                toast.success('Update Successfully', { /* toast configuration */ });



                if (inwardListData[0]?.num_product > getProductList.numProduct) {
                    const value = inwardListData[0]?.num_product - getProductList.numProduct;
                    await axios.put(`https://inventory-api-00rj.onrender.com/outward_listUpdate/${ids.productId}`, { numProduct: value });
                } else if (inwardListData[0]?.num_product < getProductList.numProduct) {
                    const value = getProductList.numProduct - inwardListData[0]?.num_product;
                    await axios.put(`https://inventory-api-00rj.onrender.com/inward_listUpdate/${ids.productId}`, { numProduct: value });
                } else {
                    window.alert('The number of products is equal');
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    function formatDateForInput(dateString) {
        // Assuming dateString is in the format 'MM/DD/YYYY'
        const dateParts = dateString.split('/');
        
        if (dateParts.length === 3) {
          const [month, day, year] = dateParts;
          const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          return formattedDate;
        }
      
        // Handle invalid date string or unexpected format
        console.error(`Invalid date string format: ${dateString}`);
        return '';
      }
      
      
    const checkForm = () => {
        switch (formTable) {
            case 'Add':
                return (
                    <>
                        <h6 className='text-center fw-bold '>Adding Values </h6>
                        <form className="row g-3 needs-validation mt-2" onSubmit={handleAddSubmit}>
                            <div className="col-md-6">
                                <label for="validationCustom01" class="form-label">Date</label>
                                <input type="date" class="form-control" id="validationCustom01" placeholder='product name'
                                    value={inwardList.date} onChange={(e) => {
                                        setInwardList({ ...inwardList, date: e.target.value })
                                    }}
                                    required />
                                <div className="valid-feedback">
                                    Looks good!
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label for="validationCustom01" className="form-label">Product Name</label>
                                <select className="form-select" aria-label="Default select example"
                                    onChange={e => {
                                        const [productName, productId] = e.target.value.split('|');

                                        setInwardList({ ...inwardList, productName, product_id: productId });
                                    }}>
                                    <option selected>select menu</option>
                                    {productListData.map((name, index) => {
                                        return <option key={index} value={`${name.product_name}|${name.product_id}`} >{name.product_name}</option>
                                    })}
                                </select>
                                <div className="valid-feedback">
                                    Looks good!
                                </div>
                            </div>
                            <div className="col-md-12">
                                <label for="validationCustom02" className="form-label">Price</label>
                                <input type="text" className="form-control" id="validationCustom02" placeholder='price'
                                    value={inwardList.productPrice} onChange={(e) => {
                                        setInwardList({ ...inwardList, productPrice: e.target.value })
                                    }}
                                    required />
                                <div className="valid-feedback">
                                    Looks good!
                                </div>
                            </div>
                            <div className="col-md-12">
                                <label for="validationCustom02" className="form-label">Stock</label>
                                <input type="text" className="form-control" id="validationCustom02" placeholder='stocks'
                                    value={inwardList.numProduct} onChange={(e) => {
                                        setInwardList({ ...inwardList, numProduct: e.target.value })
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
            case 'Update':
                return (
                    <>
                        <h6 className='text-center fw-bold '>Updating Values </h6>
                        <form className="row g-3 needs-validation mt-2" onSubmit={handleProductUpdate}>
                            <div className="col-md-6">
                                <label for="validationCustom01" className="form-label">Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="validationCustom01"
                                    placeholder='date'
                                    value={formatDateForInput(new Date(getProductList.date).toLocaleDateString())}
                                    onChange={e => setGetProductList({ ...getProductList, date: e.target.value })}
                                    required
                                />

                                <div className="valid-feedback">
                                    Looks good!
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label for="validationCustom01" className="form-label">Product Name</label>
                                <select className="form-select" aria-label="Default select example"
                                    value={getProductList.productName} onChange={e => {
                                        const [productName, productId] = e.target.value.split('|');

                                        setGetProductList({ ...getProductList, productName, product_id: productId });
                                    }}>
                                    <option selected>{getProductList.productName}</option>
                                    {productListData.map((name, index) => {
                                        return <option key={index} value={`${name.product_name}|${name.product_id}`} >{name.product_name}</option>
                                    })}
                                </select>
                            </div>
                            <div className="col-md-12">
                                <label for="validationCustom02" className="form-label">Price</label>
                                <input type="text" className="form-control" id="validationCustom02" placeholder='price' value={getProductList.productPrice} onChange={e => setGetProductList({ ...getProductList, productPrice: e.target.value })} required />
                                <div className="valid-feedback">
                                    Looks good!
                                </div>
                            </div>
                            <div className="col-md-12">
                                <label for="validationCustom02" className="form-label">Stock</label>
                                <input type="text" className="form-control" id="validationCustom02" placeholder='stocks' value={getProductList.numProduct} onChange={e => setGetProductList({ ...getProductList, numProduct: e.target.value })} required />
                                <div className="valid-feedback">
                                    Looks good!
                                </div>
                            </div>
                            <div className="col-12">
                                <button className="btn btn-primary" type="submit">Update</button>
                            </div>
                        </form>
                    </>
                );
            default:
                return alert("Undefined Vales")
        }
    }


    const updateList = async (id, productId) => {
        try {
            const response = await fetch(`https://inventory-api-00rj.onrender.com/inwardList1/${id}`);
            const data = await response.json();

            if (data && data.length > 0) {
                setGetProductList({
                    product_id: data[0]?.product_id,
                    date: data[0]?.date,
                    productName: data[0]?.product_name,
                    productPrice: data[0]?.price,
                    numProduct: data[0]?.num_product
                });
                setUpdateCheckProduct(data[0]);
                setIds({
                    id: id,
                    productId: productId
                })
            } else {
                console.log('No data found for the given id.');
            }


        } catch (error) {
            console.error('Error:', error);
        }
    };


    const handleDelete = async (id, productId) => {
        try {
            const willDelete = await swal({
                title: "Are you sure?",
                text: "Once deleted, you will not be able to recover this data!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            });

            if (willDelete) {
                swal("data has been deleted!", {
                    icon: "success",
                });

                const response = await fetch(`https://inventory-api-00rj.onrender.com/inwardList1/${id}`);
                const inwardListData = await response.json();

                if (inwardListData && inwardListData.length > 0) {
                    const updatedStockDelete = { numProduct: inwardListData[0].num_product };

                    await axios.put(`https://inventory-api-00rj.onrender.com/outward_listUpdate/${productId}`, updatedStockDelete);

                    console.log('Update successful');
                } else {
                    console.log('No data found for the given id.');
                }

                await axios.delete(`https://inventory-api-00rj.onrender.com/inwarddelete/${id}`);


            } else {
                swal("Your file is safe!");
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("Something went wrong!");
        }
    };

    const [sortDatas, setSortDatas] = useState({
        startDate: '',
        endDate: '',
        productName: '',
    })

    console.log(sortDatas);
    const [sortBtn, setSortBtn] = useState(false);
    const [sortDataRecived, setDataRecived] = useState([]);
    const [sortBtnCol, setSortBtnCol] = useState(false);


    // print 
    const [printReport, setPrintReport] = useState(false);

    const handleSortBtn = async () => {
        if (sortDatas.startDate && sortDatas.endDate || sortDatas.productName) {
            try {
                const response = await axios.get('https://inventory-api-00rj.onrender.com/inwardSorting', { params: sortDatas });
                setDataRecived(response.data);
                setSortBtn(prevSortBtn => !prevSortBtn);
                setSortBtnCol(false)

            } catch (err) {
                console.error(err);
            }
        } else {
            swal("Please enter  required fields...", {
                icon: "warning",
            });
            setSortBtnCol(true)
        }

    };



    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Visitor Pass',
        onAfterPrint: () => console.log('Printed PDF successfully!'),
    });



    return (
        <>
            <div className="row mx-3 my-3">
                <h2>Inward Details</h2>
                <hr />

                {/* form  */}

                <div className='col-lg-4 col-sm-12 my-3 formList me-3 p-4'>
                    {checkForm()}
                </div>

                {/* TABLE */}

                <div className='col-lg-7 col-sm-12 my-3'>
                    <div className={sortBtnCol ? 'row input_color' : 'row '}>
                        <h5>Sorted By:</h5>
                        <hr />
                        <div className='col-lg-3 col-sm-6 my-1'>
                            <input type='date' className="form-control" onChange={(e) => { setSortDatas({ ...sortDatas, startDate: e.target.value }) }} />                           
                                                      
                        </div>
                        <div className='col-lg-1 col-sm-3 my-1 text-center '><h5 className='mt-1'>to</h5></div>
                        <div className='col-lg-3 col-sm-6  my-1'><input type='date' className="form-control" onChange={(e) => { setSortDatas({ ...sortDatas, endDate: e.target.value }) }} /></div>
                        <div className='col-lg-3 col-sm-6 my-1'><input type='text' placeholder='search by product name' className="form-control" onChange={(e) => { setSortDatas({ ...sortDatas, productName: e.target.value }) }} /></div>
                        <div className='col-2 my-1'> <button className='btn btn-primary' onClick={handleSortBtn}>{sortBtn ? 'Show All' : 'Search'}</button></div>


                    </div>
                    <div className=' tableList table-responsive mt-3' style={{ display: printReport ? 'none' : 'block' }}>
                        <table className="table table-striped" >
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Product_Name</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Products</th>
                                </tr>

                            </thead>
                            <tbody>
                                {sortBtn ? sortDataRecived.map((data, index) => {
                                    return (
                                        <tr key={index}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{new Date(data.date).toLocaleDateString()}</td>
                                            <td>{data.product_name}</td>
                                            <td>{data.price}</td>
                                            <td>{data.num_product}</td>
                                            <td onClick={() => handleDelete(data.id, data.product_id)}>
                                                <MdDeleteForever className='text-danger fs-5 pointerClass' />
                                            </td>
                                            <td className='text-success fs-6 pointerClass' onClick={() => {
                                                setFormTable('Update');
                                                setGetProductId(data.id);
                                                updateList(data.id, data.product_id);
                                            }}>
                                                <FaPenToSquare />
                                            </td>
                                        </tr>
                                    );
                                }) : inwardData.map((data, index) => {
                                    return (
                                        <tr key={index}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{new Date(data.date).toLocaleDateString()}</td>
                                            <td>{data.product_name}</td>
                                            <td>{data.price}</td>
                                            <td>{data.num_product}</td>
                                            <td onClick={() => handleDelete(data.id, data.product_id)}>
                                                <MdDeleteForever className='text-danger fs-5 pointerClass' />
                                            </td>
                                            <td className='text-success fs-6 pointerClass' onClick={() => {
                                                setFormTable('Update');
                                                setGetProductId(data.id);
                                                updateList(data.id, data.product_id);
                                            }}>
                                                <FaPenToSquare />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <button className='btn btn-danger' onClick={() => {
                            setPrintReport(!printReport);
                        }}>View Report</button>
                    </div>

                    {/* report table  */}

                    <div className='tableList table-responsive mt-3 ' style={{ display: printReport ? 'block' : 'none' }}>
                        <div className='p-4' ref={componentRef}>
                            <h3 className='text-center text-danger '>Inward Report</h3><hr />
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Product_Name</th>
                                        <th scope="col">Price</th>
                                        <th scope="col">Products</th>
                                    </tr>

                                </thead>
                                <tbody>
                                    {sortBtn ? sortDataRecived.map((data, index) => {
                                        return (
                                            <tr key={index}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{data.date}</td>
                                                <td>{data.product_name}</td>
                                                <td>{data.price}</td>
                                                <td>{data.num_product}</td>
                                            </tr>
                                        );
                                    }) : inwardData.map((data, index) => {
                                        return (
                                            <tr key={index}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{data.date}</td>
                                                <td>{data.product_name}</td>
                                                <td>{data.price}</td>
                                                <td>{data.num_product}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            <span className='mx-2'><span className='fw-bold'>Date:</span> {new Date().toLocaleDateString()}</span><br />
                            <span className='mx-2'><span className='fw-bold'>Time:</span> {new Date().toLocaleTimeString()}</span>

                        </div>
                        <button className='btn btn-danger mx-2' onClick={handlePrint}>Print report</button>
                        <button className='btn btn-primary mx-2' onClick={() => {
                            setPrintReport(!printReport)
                        }}>View All Data</button>
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
})

export default Inward