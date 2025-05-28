import React, { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { MdDeleteForever } from "react-icons/md";
import { FaPenToSquare } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";

const Outward = React.forwardRef((props, ref) => {
  const [productListData, setProductListData] = useState([]);
  const [outwardData, setOutwardData] = useState([]);
  const [formTable, setFormTable] = useState("Add");
  const [outwardList, setOutwardList] = useState({
    product_id: "",
    date: "",
    productName: "",
    productPrice: "",
    numProduct: "",
  });
  const [ids, setIds] = useState({ id: "", productId: "" });
  const [getProductList, setGetProductList] = useState({
    product_id: "",
    date: "",
    productName: "",
    productPrice: "",
    numProduct: "",
  });
  const [updateCheckProduct, setUpdateCheckProduct] = useState({});
  const [availableStockShow, setAvailableStockShow] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [sortDatas, setSortDatas] = useState({
    startDate: "",
    endDate: "",
    productName: "",
  });
  const [sortBtn, setSortBtn] = useState(false);
  const [sortDataRecived, setDataRecived] = useState([]);
  const [sortBtnCol, setSortBtnCol] = useState(false);
  const [printReport, setPrintReport] = useState(false);
  const componentRef = useRef();

  // Unified data fetching
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [outwardRes, productRes] = await Promise.all([
        axios.get("https://inventory-api-00rj.onrender.com/outward"),
        axios.get("https://inventory-api-00rj.onrender.com/productList"),
      ]);
      setOutwardData(outwardRes.data);
      setProductListData(productRes.data);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to fetch data", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableStock = async (productId) => {
    try {
      const response = await axios.get(
        `https://inventory-api-00rj.onrender.com/productList1/${productId}`
      );
      if (response.data && response.data.length > 0) {
        setAvailableStockShow(response.data[0]);
      }
    } catch (error) {
      console.error("Stock fetch error:", error);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Fetch current stock
      const stockResponse = await axios.get(
        `https://inventory-api-00rj.onrender.com/productList1/${outwardList.product_id}`
      );
      const currentStock = stockResponse.data[0]?.stocks || 0;

      // Validate stock
      if (parseInt(outwardList.numProduct) > currentStock) {
        toast.error("Product quantity exceeds available stock");
        return;
      }

      // Add new outward record
      await axios.post(
        "https://inventory-api-00rj.onrender.com/outwardListUp",
        outwardList
      );

      // Update product stock
      await axios.put(
        `https://inventory-api-00rj.onrender.com/outward_listUpdate/${outwardList.product_id}`,
        { numProduct: outwardList.numProduct }
      );

      // Refresh data and reset form
      await fetchData();
      setOutwardList({
        product_id: "",
        date: "",
        productName: "",
        productPrice: "",
        numProduct: "",
      });

      toast.success("Product added successfully!");
    } catch (error) {
      console.error("Add error:", error);
      toast.error("Failed to add product", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductUpdate = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      // Check if changes were made
      if (
        updateCheckProduct.product_name === getProductList.productName &&
        updateCheckProduct.price === getProductList.productPrice &&
        updateCheckProduct.num_product === getProductList.numProduct
      ) {
        toast.info("No changes detected", {
          position: "top-right",
          autoClose: 5000,
        });
        return;
      }

      // Get current outward data
      const response = await axios.get(
        `https://inventory-api-00rj.onrender.com/outwardList1/${ids.id}`
      );
      const currentData = response.data[0];

      // Update outward record
      await axios.put(
        `https://inventory-api-00rj.onrender.com/outwardlist/${ids.id}`,
        getProductList
      );

      // Calculate stock difference
      const oldQty = currentData?.num_product || 0;
      const newQty = getProductList.numProduct;

      if (oldQty > newQty) {
        const difference = oldQty - newQty;
        await axios.put(
          `https://inventory-api-00rj.onrender.com/inward_listUpdate/${ids.productId}`,
          { numProduct: difference }
        );
      } else if (oldQty < newQty) {
        const difference = newQty - oldQty;
        await axios.put(
          `https://inventory-api-00rj.onrender.com/outward_listUpdate/${ids.productId}`,
          { numProduct: difference }
        );
      }

      // Refresh data and reset form
      await fetchData();
      setFormTable("Add");
      setOutwardList({
        product_id: "",
        date: "",
        productName: "",
        productPrice: "",
        numProduct: "",
      });

      toast.success("Update successful!");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update product", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    } catch (error) {
      console.error(`Date formatting error: ${error.message}`);
      return "";
    }
  };

  const updateList = async (id, productId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://inventory-api-00rj.onrender.com/outwardList1/${id}`
      );
      const data = response.data[0];

      if (data) {
        setGetProductList({
          product_id: data.product_id,
          date: data.date,
          productName: data.product_name,
          productPrice: data.price,
          numProduct: data.num_product,
        });
        setUpdateCheckProduct(data);
        setIds({ id, productId });
        setFormTable("Update");
      }
    } catch (error) {
      console.error("Update list error:", error);
      toast.error("Failed to fetch product details", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
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
        setIsLoading(true);

        // Get current outward data
        const response = await axios.get(
          `https://inventory-api-00rj.onrender.com/outwardList1/${id}`
        );
        const data = response.data[0];

        if (data) {
          // Adjust product stock
          await axios.put(
            `https://inventory-api-00rj.onrender.com/inward_listUpdate/${productId}`,
            { numProduct: data.num_product }
          );

          // Delete the record
          await axios.delete(
            `https://inventory-api-00rj.onrender.com/outwarddelete/${id}`
          );

          // Refresh data
          await fetchData();
          swal("Data has been deleted!", { icon: "success" });
        }
      } else {
        swal("Your data is safe!");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete record");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortBtn = async () => {
    if (!sortDatas.startDate && !sortDatas.endDate && !sortDatas.productName) {
      swal("Please enter at least one search criteria", { icon: "warning" });
      setSortBtnCol(true);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://inventory-api-00rj.onrender.com/outwardSorting",
        {
          params: sortDatas,
        }
      );
      setDataRecived(response.data);
      setSortBtn(true);
      setSortBtnCol(false);
    } catch (err) {
      console.error("Sort error:", err);
      toast.error("Failed to sort data");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Outward Report",
  });

  const renderForm = () => {
    const price = outwardList.numProduct
      ? availableStockShow.product_price * parseInt(outwardList.numProduct)
      : 0;

    return formTable === "Add" ? (
      <>
        <h6 className="text-center fw-bold">Adding Values</h6>
        <form
          className="row g-3 needs-validation mt-2"
          onSubmit={handleAddSubmit}
        >
          <div className="col-md-6">
            <label className="form-label">Date *</label>
            <input
              type="date"
              className="form-control"
              value={outwardList.date}
              onChange={(e) =>
                setOutwardList({
                  ...outwardList,
                  date: e.target.value,
                })
              }
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Product Name *</label>
            <select
              className="form-select"
              value={
                outwardList.product_id
                  ? `${outwardList.productName}|${outwardList.product_id}`
                  : ""
              }
              onChange={(e) => {
                const [productName, productId] = e.target.value.split("|");
                setOutwardList({
                  ...outwardList,
                  productName,
                  product_id: productId,
                });
                fetchAvailableStock(productId);
              }}
              required
            >
              <option value="">Select Product</option>
              {productListData.map((product, index) => (
                <option
                  key={index}
                  value={`${product.product_name}|${product.product_id}`}
                >
                  {product.product_name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-12">
            <label className="form-label">
              Quantity *{" "}
              <span className="text-danger ms-2" style={{ fontSize: "0.8rem" }}>
                Available: {availableStockShow.stocks || 0}
              </span>
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="Quantity"
              value={outwardList.numProduct}
              onChange={(e) => {
                const numProduct = e.target.value;
                const price =
                  numProduct && availableStockShow.product_price
                    ? availableStockShow.product_price * parseInt(numProduct)
                    : 0;

                setOutwardList({
                  ...outwardList,
                  numProduct,
                  productPrice: price,
                });
              }}
              min="1"
              required
            />
          </div>
          <div className="col-md-12">
            <label className="form-label">Price</label>
            <input
              type="text"
              className="form-control"
              placeholder="price"
              value={outwardList.productPrice || 0}
              readOnly
              required
            />
          </div>
          <div className="col-12">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </>
    ) : (
      <>
        <h6 className="text-center fw-bold">Updating Values</h6>
        <form
          className="row g-3 needs-validation mt-2"
          onSubmit={handleProductUpdate}
        >
          <div className="col-md-6">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              value={formatDateForInput(getProductList.date)}
              onChange={(e) =>
                setGetProductList({ ...getProductList, date: e.target.value })
              }
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Product Name</label>
            <select
              className="form-select"
              value={
                getProductList.product_id
                  ? `${getProductList.productName}|${getProductList.product_id}`
                  : ""
              }
              onChange={(e) => {
                const [productName, productId] = e.target.value.split("|");
                setGetProductList({
                  ...getProductList,
                  productName,
                  product_id: productId,
                });
              }}
            >
              <option
                value={
                  getProductList.product_id
                    ? `${getProductList.productName}|${getProductList.product_id}`
                    : ""
                }
              >
                {getProductList.productName}
              </option>
              {productListData.map((product, index) => (
                <option
                  key={index}
                  value={`${product.product_name}|${product.product_id}`}
                >
                  {product.product_name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-12">
            <label className="form-label">Quantity</label>
            <input
              type="number"
              className="form-control"
              value={getProductList.numProduct}
              onChange={(e) =>
                setGetProductList({
                  ...getProductList,
                  numProduct: e.target.value,
                })
              }
              min="1"
              required
            />
          </div>
          <div className="col-md-12">
            <label className="form-label">Price</label>
            <input
              type="text"
              className="form-control"
              value={getProductList.productPrice}
              onChange={(e) =>
                setGetProductList({
                  ...getProductList,
                  productPrice: e.target.value,
                })
              }
              required
            />
          </div>
          <div className="col-12">
            <button
              className="btn btn-primary me-2"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => setFormTable("Add")}
            >
              Cancel
            </button>
          </div>
        </form>
      </>
    );
  };

  const renderTable = () => {
    const data = sortBtn ? sortDataRecived : outwardData;

    return (
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Date</th>
            <th scope="col">Product Name</th>
            <th scope="col">Price</th>
            <th scope="col">Quantity</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{new Date(item.date).toLocaleDateString()}</td>
              <td>{item.product_name}</td>
              <td>{item.price}</td>
              <td>{item.num_product}</td>
              <td>
                <MdDeleteForever
                  className="text-danger fs-5 pointerClass me-2"
                  onClick={() => handleDelete(item.id, item.product_id)}
                />
                <FaPenToSquare
                  className="text-success fs-6 pointerClass"
                  onClick={() => {
                    setFormTable("Update");
                    updateList(item.id, item.product_id);
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderReport = () => {
    const data = sortBtn ? sortDataRecived : outwardData;
    const currentDate = new Date();

    return (
      <div className="p-4" ref={componentRef}>
        <h3 className="text-center text-danger">Outward Report</h3>
        <hr />
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Date</th>
              <th scope="col">Product Name</th>
              <th scope="col">Price</th>
              <th scope="col">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{new Date(item.date).toLocaleDateString()}</td>
                <td>{item.product_name}</td>
                <td>{item.price}</td>
                <td>{item.num_product}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4">
          <span className="fw-bold">Date: </span>
          {currentDate.toLocaleDateString()}
          <br />
          <span className="fw-bold">Time: </span>
          {currentDate.toLocaleTimeString()}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="row mx-3 my-3">
        <h2>Outward Details</h2>
        <hr />

        {isLoading && (
          <div className="text-center my-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        <div className="col-lg-4 col-sm-12 my-3 formList me-3 p-4">
          {renderForm()}
        </div>

        <div className="col-lg-7 col-sm-12 my-3">
          <div className={sortBtnCol ? "row input_color" : "row"}>
            <h5>Filter Records:</h5>
            <hr />
            <div className="col-lg-3 col-sm-6 my-1">
              <input
                type="date"
                className="form-control"
                onChange={(e) =>
                  setSortDatas({ ...sortDatas, startDate: e.target.value })
                }
              />
            </div>
            <div className="col-lg-1 col-sm-3 my-1 text-center">
              <h5 className="mt-1">to</h5>
            </div>
            <div className="col-lg-3 col-sm-6 my-1">
              <input
                type="date"
                className="form-control"
                onChange={(e) =>
                  setSortDatas({ ...sortDatas, endDate: e.target.value })
                }
              />
            </div>
            <div className="col-lg-3 col-sm-6 my-1">
              <input
                type="text"
                placeholder="Search by product name"
                className="form-control"
                onChange={(e) =>
                  setSortDatas({ ...sortDatas, productName: e.target.value })
                }
              />
            </div>
            <div className="col-lg-2 col-sm-6 my-1">
              <button
                className="btn btn-primary w-100"
                onClick={handleSortBtn}
                disabled={isLoading}
              >
                {sortBtn ? "Show All" : "Search"}
              </button>
            </div>
          </div>

          <div className="tableList table-responsive mt-3">
            {printReport ? renderReport() : renderTable()}

            <div className="mt-3">
              {printReport ? (
                <>
                  <button className="btn btn-danger mx-2" onClick={handlePrint}>
                    Print Report
                  </button>
                  <button
                    className="btn btn-primary mx-2"
                    onClick={() => setPrintReport(false)}
                  >
                    View Data
                  </button>
                </>
              ) : (
                <button
                  className="btn btn-danger"
                  onClick={() => setPrintReport(true)}
                >
                  View Report
                </button>
              )}
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
  );
});

export default Outward;
