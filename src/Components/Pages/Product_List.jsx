import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdDeleteForever } from "react-icons/md";
import { FaPenToSquare } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Product_List() {
  const [productListData, setProductListData] = useState([]);
  const [formTable, setFormTable] = useState("Add");
  const [productList, setProductList] = useState({
    productName: "",
    productPrice: "",
    stocks: "",
  });
  const [getProductId, setGetProductId] = useState(-1);
  const [getProductList, setGetProductList] = useState({
    productName: "",
    price: "",
    stock: "",
  });
  const [productListValues, setProductListValues] = useState([]);
  const [updateCheckProduct, setUpdateCheckProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch initial data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Unified data fetching function
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://inventory-api-00rj.onrender.com/productList"
      );
      setProductListData(response.data);
      setProductListValues(response.data.map((data) => data.product_name));
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to fetch products", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    // Check if product exists
    if (productListValues.includes(productList.productName)) {
      toast.warn("Product already exists", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(
        "https://inventory-api-00rj.onrender.com/productListUp",
        productList
      );

      // Refresh data after successful addition
      await fetchData();

      // Reset form
      setProductList({
        productName: "",
        productPrice: "",
        stocks: "",
      });

      toast.success("Product added successfully!", {
        position: "top-right",
        autoClose: 4000,
        theme: "light",
      });
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

    // Check if changes were made
    if (
      updateCheckProduct.product_name === getProductList.productName &&
      updateCheckProduct.product_price === getProductList.price &&
      updateCheckProduct.stocks === getProductList.stock
    ) {
      toast.info("No changes detected", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
      });
      return;
    }

    try {
      setIsLoading(true);
      await axios.put(
        `https://inventory-api-00rj.onrender.com/listupdate/${getProductId}`,
        getProductList
      );

      // Refresh data after successful update
      await fetchData();

      // Reset form state
      setFormTable("Add");
      setProductList({
        productName: "",
        productPrice: "",
        stocks: "",
      });

      toast.success("Update successful!", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
      });
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

  const updateList = async (id) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://inventory-api-00rj.onrender.com/productList1/${id}`
      );
      const data = response.data[0];

      setGetProductList({
        productName: data?.product_name,
        price: data?.product_price,
        stock: data?.stocks,
      });
      setUpdateCheckProduct(data);
      setGetProductId(id);
      setFormTable("Update");
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

  // Render form based on current mode
  const renderForm = () => {
    switch (formTable) {
      case "Add":
        return (
          <>
            <h6 className="text-center fw-bold">Add Product</h6>
            <form
              className="row g-3 needs-validation"
              onSubmit={handleAddSubmit}
            >
              {/* Form fields same as before */}
              <div className="col-md-12">
                <label for="validationCustom01" className="form-label">
                  Product Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="validationCustom01"
                  placeholder="product name"
                  value={productList.productName}
                  onChange={(e) => {
                    setProductList({
                      ...productList,
                      productName: e.target.value,
                    });
                  }}
                  required
                />
                <div className="valid-feedback">Looks good!</div>
              </div>
              <div className="col-md-12">
                <label for="validationCustom02" className="form-label">
                  Price
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="validationCustom02"
                  placeholder="price"
                  value={productList.productPrice}
                  onChange={(e) => {
                    setProductList({
                      ...productList,
                      productPrice: e.target.value,
                    });
                  }}
                  required
                />
                <div className="valid-feedback">Looks good!</div>
              </div>
              <div className="col-md-12">
                <label for="validationCustom02" className="form-label">
                  Stock
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="validationCustom02"
                  placeholder="stocks"
                  value={productList.stocks}
                  onChange={(e) => {
                    setProductList({ ...productList, stocks: e.target.value });
                  }}
                  required
                />
                <div className="valid-feedback">Looks good!</div>
              </div>

              <div className="col-12">
                <button className="btn btn-primary" type="submit">
                  Add
                </button>
              </div>
            </form>
          </>
        );
      case "Update":
        return (
          <>
            <h6 className="text-center fw-bold">Update Product</h6>
            <form
              className="row g-3 needs-validation"
              onSubmit={handleProductUpdate}
            >
              {/* Form fields same as before */}
              <div className="col-md-12">
                <label for="validationCustom01" className="form-label">
                  Product Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="validationCustom01"
                  placeholder="product name"
                  value={getProductList.productName}
                  onChange={(e) =>
                    setGetProductList({
                      ...getProductList,
                      productName: e.target.value,
                    })
                  }
                  required
                />
                <div className="valid-feedback">Looks good!</div>
              </div>
              <div className="col-md-12">
                <label for="validationCustom02" className="form-label">
                  Price
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="validationCustom02"
                  placeholder="price"
                  value={getProductList.price}
                  onChange={(e) =>
                    setGetProductList({
                      ...getProductList,
                      price: e.target.value,
                    })
                  }
                  required
                />
                <div className="valid-feedback">Looks good!</div>
              </div>
              <div className="col-md-12">
                <label for="validationCustom02" className="form-label">
                  Stock
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="validationCustom02"
                  placeholder="stocks"
                  value={getProductList.stock}
                  onChange={(e) =>
                    setGetProductList({
                      ...getProductList,
                      stock: e.target.value,
                    })
                  }
                  required
                />
                <div class="valid-feedback">Looks good!</div>
              </div>
              <div className="col-12">
                <button className="btn btn-primary" type="submit">
                  Update
                </button>
              </div>
            </form>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="row mx-3 my-3">
        <h2>Product List</h2>
        <hr />

        {/* form  */}

        <div className="col-lg-4 col-sm-12 my-3 formList me-3 p-4">
          {renderForm()}
        </div>

        {/* TABLE */}

        <div className="col-lg-7 col-sm-12 my-3">
          <div className="tableList table-responsive">
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
                  return (
                    <tr>
                      <th scope="row">{index + 1}</th>
                      <td>{data.product_name}</td>
                      <td>{data.product_price}</td>
                      <td>{data.stocks}</td>
                      <td
                        className="text-success fs-6 pointerClass"
                        onClick={() => {
                          setFormTable("Update");
                          setGetProductId(data.product_id);
                          updateList(data.product_id);
                        }}
                      >
                        <FaPenToSquare />
                      </td>
                    </tr>
                  );
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
  );
}

export default Product_List;
