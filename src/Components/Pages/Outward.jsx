import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useReactToPrint } from 'react-to-print';
import axios from 'axios';
import { MdDeleteForever } from "react-icons/md";
import { FaPenToSquare } from "react-icons/fa6";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import swal from 'sweetalert';

const Outward = React.forwardRef((props, ref) => {

    const [productListData, setProductListData] = useState([]);
    const [outwardData, setOutwardData] = useState([]);
    const [formTable, setFormTable] = useState('Add');
    const [outwardList, setOutwardList] = useState({
        product_id: '',
        date: '',
        productName: '',
        productPrice: '',
        numProduct: ''
    });
    const [ids, setIds] = useState({
        id: '',
        productId: ''
    })
    const [getProductId, setGetProductId] = useState(0);
    const [getProductList, setGetProductList] = useState({
        product_id: '',
        date: '',
        productName: '',
        productPrice: '',
        numProduct: ''
    });
    const [updateCheckProduct, setUpdateCheckProduct] = useState([]);
    const [availableStockShow, SetAvailableShow] = useState({});

    useEffect(() => {
        fetData();
        const setTime = () => {
            fetData();

        }
        const time = setInterval(setTime, 500);
        return () => {
            fetData();
            clearInterval(time);
        }

    }, []);

    function fetData() {
        axios.get('http://localhost:3008/outward')
            .then((res) => {
                setOutwardData(res.data);
            })
            .catch(err => console.log(err));

        axios.get('http://localhost:3008/productList')
            .then((res) => {
                setProductListData(res.data)
            })
            .catch(err => console.log(err));
    }



   

    useMemo(async () => {
       try{
        const response = await axios.get(`http://localhost:3008/productList1/${outwardList.product_id}`);
        SetAvailableShow(response.data[0]);
        // setPriceCalc(availableStockShow.price * )
       }catch(error){
        console.log(error);
       }
    }, [outwardList.product_id])


    const handleAddSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.get(`http://localhost:3008/productList1/${outwardList.product_id}`);
            const dataSets = response.data;

            if (outwardList.numProduct < dataSets[0].stocks) {
                await axios.post('http://localhost:3008/outwardListUp', outwardList);
                setOutwardList({
                    product_id: '',
                    date: '',
                    productName: '',
                    productPrice: '',
                    numProduct: ''
                });

                toast.success('Product Added successfully!');

                await axios.put(`http://localhost:3008/outward_listUpdate/${outwardList.product_id}`, outwardList);

            } else {
                toast.error("Product Count is greater than Stock Availablity");
            }


        } catch (error) {
            console.error('Error:', error);
        }
    };


    const handleProductUpdate = async (event) => {
        try {
            event.preventDefault();
            const outwardListResponse = await fetch(`http://localhost:3008/outwardList1/${ids.id}`);
            const outwardListDataAxios = await outwardListResponse.json();

            if (
                updateCheckProduct.product_name === getProductList.productName &&
                updateCheckProduct.price === getProductList.productPrice &&
                updateCheckProduct.num_product === getProductList.numProduct
            ) {
                toast.info('No changes detected');
            } else {
                await axios.put(`http://localhost:3008/outwardlist/${getProductId}`, getProductList);

                setFormTable('Add');
                setOutwardList({ date: '', productName: '', productPrice: '', numProduct: '' });

                toast.success('Update Successfully');



                if (outwardListDataAxios[0]?.num_product > getProductList.numProduct) {
                    const value = outwardListDataAxios[0]?.num_product - getProductList.numProduct;
                    await axios.put(`http://localhost:3008/inward_listUpdate/${ids.productId}`, { numProduct: value });

                } else if (outwardListDataAxios[0]?.num_product < getProductList.numProduct) {
                    const value = getProductList.numProduct - outwardListDataAxios[0]?.num_product;
                    await axios.put(`http://localhost:3008/outward_listUpdate/${ids.productId}`, { numProduct: value });

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
    // ........................................................




    //   ..........................................................
    const checkForm = () => {
        switch (formTable) {
            case 'Add':
                return (
                    <>
                        <h6 className='text-center fw-bold '>Adding Values </h6>
                        <form className="row g-3 needs-validation mt-2" onSubmit={handleAddSubmit}>
                            <div className="col-md-6">
                                <label for="validationCustom01" className="form-label">Date</label>
                                <input type="date" className="form-control" id="validationCustom01" placeholder='product name'
                                    value={outwardList.date} onChange={(e) => {
                                        setOutwardList({ ...outwardList, date: e.target.value })
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

                                        setOutwardList({ ...outwardList, productName, product_id: productId });
                                    }}>
                                    <option selected>select menu</option>
                                    {productListData.map((name, index) => {
                                        return <option value={`${name.product_name}|${name.product_id}`} >{name.product_name}</option>
                                    })}
                                </select>
                                <div className="valid-feedback">
                                    Looks good!
                                </div>
                            </div>
                            <div className="col-md-12">
                                <label for="validationCustom02" className="form-label">Num of Products-</label> <span className='text-danger' style={{fontSize:'13px'}}>Available Stocks:{availableStockShow.stocks}</span>
                                <input type="text" className="form-control" id="validationCustom02" placeholder='Num of Products'
                                    value={outwardList.numProduct} onChange={(e) => {
                                        setOutwardList({ ...outwardList, numProduct: e.target.value })
                                    }} required />
                                <div className="valid-feedback">
                                    Looks good!
                                </div>
                            </div>
                            <div className="col-md-12">
                                <label for="validationCustom02" className="form-label">Price</label>
                                <input type="text" className="form-control" id="validationCustom02" placeholder='price'
                                    value={ outwardList.numProduct ?  availableStockShow.product_price * parseInt(outwardList.numProduct):0 } onChange={(e) => {
                                        setOutwardList({ ...outwardList, productPrice: availableStockShow.product_price * parseInt(outwardList.numProduct) })
                                    }}
                                    required />
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
                                        return <option value={`${name.product_name}|${name.product_id}`} >{name.product_name}</option>
                                    })}
                                </select>
                            </div>                           
                            <div className="col-md-12">
                                <label for="validationCustom02" className="form-label">Stock</label>
                                <input type="text" className="form-control" id="validationCustom02" placeholder='stocks' value={getProductList.numProduct} onChange={e => setGetProductList({ ...getProductList, numProduct: e.target.value })} required />
                                <div className="valid-feedback">
                                    Looks good!
                                </div>
                            </div>
                            <div className="col-md-12">
                                <label for="validationCustom02" className="form-label">Price</label>
                                <input type="text" className="form-control" id="validationCustom02" placeholder='price' value={getProductList.productPrice} onChange={e => setGetProductList({ ...getProductList, productPrice: e.target.value })} required />
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
                break;
            default:
                return alert("Undefined Vales")
        }
    }


    const updateList = async (id, productId) => {
        try {
            const response = await fetch(`http://localhost:3008/outwardList1/${id}`);
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
    }
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

                const response = await fetch(`http://localhost:3008/outwardList1/${id}`);
                const outwardListData = await response.json();

                if (outwardListData && outwardListData.length > 0) {
                    const updatedStockDelete = { numProduct: outwardListData[0].num_product };

                    await axios.put(`http://localhost:3008/inward_listUpdate/${productId}`, updatedStockDelete);

                    console.log('Update successful');
                } else {
                    console.log('No data found for the given id.');
                }
                axios.delete('http://localhost:3008/outwarddelete/' + id)
                    .then(res => {
                        console.log(res);
                        toast.success('Deleted Successfully');
                    })
                    .catch(err => {
                        console.log(err);
                        toast.error("Somethings went's wrong!");
                    })
            } else {
                swal("Your imaginary file is safe!");
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("Something went wrong!");
        }
    }

    const [sortDatas, setSortDatas] = useState({
        startDate: '',
        endDate: '',
        productName: '',
    })

    const [sortBtn, setSortBtn] = useState(false);
    const [sortDataRecived, setDataRecived] = useState([]);
    const [sortBtnCol, setSortBtnCol] = useState(false)

    const [printReport, setPrintReport] = useState(false);

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Visitor Pass',
        onAfterPrint: () => console.log('Printed PDF successfully!'),
    });

    const handleSortBtn = async () => {
        if (sortDatas.startDate && sortDatas.endDate || sortDatas.productName) {
            try {
                const response = await axios.get('http://localhost:3008/outwardSorting', { params: sortDatas });
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

    return (
        <>
            <div className="row mx-3 my-3">
                <h2>Outward Details</h2>
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
                        <div className='col-lg-3 col-sm-12'>
                            <input type='date' className="form-control" onChange={(e) => { setSortDatas({ ...sortDatas, startDate: e.target.value }) }} />
                        </div>
                        <div className='col-lg-1 col-sm-12 my-1 text-center'><h5 className='mt-1'>to</h5></div>
                        <div className='col-lg-3 col-sm-12 my-1 '><input type='date' className="form-control" onChange={(e) => { setSortDatas({ ...sortDatas, endDate: e.target.value }) }} /></div>
                        <div className='col-lg-3 col-sm-12 my-1'><input type='text' placeholder='search by product name' className="form-control" onChange={(e) => { setSortDatas({ ...sortDatas, productName: e.target.value }) }} /></div>
                        <div className='col-lg-2 col-sm-12 my-1'> <button className='btn btn-primary' onClick={handleSortBtn}>{sortBtn ? 'Show All' : 'Search'}</button></div>


                    </div>
                    <div className='tableList table-responsive mt-3' style={{ display: printReport ? 'none' : 'block' }}>
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
                                }) : outwardData.map((data, index) => {
                                    return (<tr>
                                        <th scope="row">{index + 1}</th>
                                        <td>{new Date(data.date).toLocaleDateString()}</td>
                                        <td>{data.product_name}</td>
                                        <td>{data.price}</td>
                                        <td>{data.num_product}</td>
                                        <td onClick={() => {
                                            handleDelete(data.id, data.product_id);
                                        }}><MdDeleteForever className='text-danger fs-5 pointerClass' /></td>
                                        <td className='text-success fs-6 pointerClass' onClick={() => {
                                            setFormTable('Update');
                                            setGetProductId(data.id);
                                            updateList(data.id, data.product_id)
                                        }}><FaPenToSquare /></td>
                                    </tr>)
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
                            <h3 className='text-center text-danger '>Outward Report</h3><hr />
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
                                    }) : outwardData.map((data, index) => {
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

export default Outward