import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStoreProducts, updateProduct, deleteProduct } from "../../../store/actions/productActions";
import { getAllCategories } from "../../../store/actions/categoryActions";
import Slider from "react-slick";
import sliderSettings from "../../sliders/sliderSettings";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaEllipsisV, FaTrashAlt, FaEdit } from "react-icons/fa";
import Loader from "../../layout/Loader";


const Products = ({ refresh }) => {
  const dispatch = useDispatch();

  // Fetching store-specific products
  const { loading, stores, error } = useSelector((state) => state.storeProducts);
  const { error: updateError } = useSelector((state) => state.productUpdate);
  const { categories } = useSelector((state) => state.categories);

  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showOptions, setShowOptions] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [productDetails, setProductDetails] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    subcategory: "",
    stock: 0,
    images: [],
    discountPercentage: 0,
    discountStartDate: "",
    discountEndDate: "",
  });

  useEffect(() => {
    dispatch(getStoreProducts(`page=${currentPage}`));
    dispatch(getAllCategories());
  }, [dispatch, currentPage, refresh]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEditClick = (product) => {
    setProductDetails(product);
    setIsModalOpen(true);
  };

  const handleFormSubmit = () => {
    dispatch(updateProduct(productDetails._id, productDetails));
    dispatch(getStoreProducts(`page=${currentPage}`));
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setProductDetails((prevDetails) => ({
        ...prevDetails,
        images: [...prevDetails.images, ...Array.from(files)],
      }));
    } else {
      setProductDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    }
  };

  const handleDeleteClick = (productId) => {
    setSelectedProduct(productId);
  };

  const confirmDelete = () => {
    dispatch(deleteProduct(selectedProduct));
    setSelectedProduct(null);
    dispatch(getStoreProducts(`page=${currentPage}`));
    dispatch(getAllCategories());
  };

  const filteredProducts = stores.products?.filter((product) =>
    product._id.toString().includes(searchQuery) ||
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <div className="container mx-auto sm:p-4">
      <h1 className="text-2xl font-bold text-center my-4">Store Products</h1>
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Search by ID or Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-max p-2 border border-blue-300 rounded-md outline-none"
        />
      </div>
      {loading ? (
        <p className="text-center">Loading store products...</p>
      ) : error ? (
        <p className="flex justify-center items-center"><Loader /></p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredProducts?.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product._id} className="relative p-4 border rounded shadow hover:shadow-lg transition">
                <FaEllipsisV
                  className="absolute top-2 right-2 text-gray-600 cursor-pointer border"
                  onClick={() =>
                    setShowOptions(showOptions === product._id ? null : product._id)
                  }
                />

                {showOptions === product._id && (
                  <div className="absolute top-7 right-0 z-50 bg-white shadow-lg border rounded overflow-hidden border-blue-300">
                    <button
                      className="block w-full text-left text-red-500 px-2 py-2 hover:bg-gray-100"
                      onClick={() => handleDeleteClick(product._id)}
                    >
                      <FaTrashAlt />
                    </button>
                    <button
                      className="block w-full text-left text-blue-500 px-2 py-2 hover:bg-gray-100"
                      onClick={() => handleEditClick(product)}
                    >
                      <FaEdit />
                    </button>
                  </div>
                )}

                {product.images && product.images.length > 1 ? (
                  <Slider {...sliderSettings}>
                    {product.images.map((image, idx) => (
                      image?.url ? (
                        <div key={idx}>
                          <img
                            src={`${import.meta.env.VITE_APP}/${image.url.replace(/\\/g, '/')}`}
                            alt={`Image ${idx + 1}`}
                            className="w-full h-48 object-cover mb-4"
                          />
                        </div>
                      ) : (
                        <p key={idx}>Image not available</p>
                      )
                    ))}
                  </Slider>
                ) : (
                  product.images?.[0]?.url ? (
                    <img
                      src={`${import.meta.env.VITE_APP}/${product.images[0].url.replace(/\\/g, '/')}`}
                      alt={product.name}
                      className="w-full h-48 object-cover mb-4"
                    />
                  ) : (
                    <p>Image not available</p>
                  )
                )}

                <h2 className="text-xl font-semibold">{product.name}</h2>
                <p className="text-gray-600">
                  {product.description.length > 20
                    ? product.description.substring(0, 20) + "..."
                    : product.description}
                </p>
                <p className="text-gray-500">{product.address}</p>
              </div>
            ))
          ) : (
            <p className="text-center col-span-4 text-gray-500">No products available</p>
          )}
        </div>

      )}

      {/* Modal for editing product */}
      {isModalOpen && (
        <div className="fixed inset-0 top-0 flex items-center justify-center bg-gray-500 bg-opacity-50 overflow-y-scroll">
          <div className="relative bg-white p-6 rounded shadow-lg w-full md:w-1/2 mt-[400px] md:mt-36">
            <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Product Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium">Product Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={productDetails.name}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium">Description</label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    value={productDetails.description}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                {/* Price */}
                <div>
                  <label htmlFor="price" className="block text-sm font-medium">Price</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={productDetails.price}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                {/* Stock */}
                <div>
                  <label htmlFor="stock" className="block text-sm font-medium">Stock</label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={productDetails.stock}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                {/* Images */}
                <div>
                  <label htmlFor="images" className="block text-sm font-medium">Images</label>
                  <input
                    type="file"
                    id="images"
                    name="images"
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    multiple
                  />
                </div>

                {/* Display selected images */}
                <br />
                <div>
                  <h3 className="text-sm font-medium">Selected Images:</h3>
                  <div className="flex space-x-2">
                    {Array.isArray(productDetails.images) && productDetails.images.length > 0 ? (
                      productDetails.images.map((image, index) => {
                        const imageUrl =
                          image instanceof File
                            ? URL.createObjectURL(image)
                            : `${import.meta.env.VITE_APP}/${image?.url.replace(/\\/g, '/')}`;

                        return (
                          <img
                            key={index}
                            src={imageUrl}
                            alt={`Selected ${index}`}
                            className="w-24 h-24 object-cover"
                          />
                        );
                      })
                    ) : (
                      <p>No images selected</p>
                    )}
                  </div>
                </div>


                <br />

                {/* Discount Percentage */}
                <div>
                  <label htmlFor="discountPercentage" className="block text-sm font-medium">Discount Percentage</label>
                  <input
                    type="number"
                    id="discountPercentage"
                    name="discountPercentage"
                    value={productDetails.discountPercentage}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                {/* Discount Start Date */}
                <div>
                  <label htmlFor="discountStartDate" className="block text-sm font-medium">Discount Start Date</label>
                  <input
                    type="date"
                    id="discountStartDate"
                    name="discountStartDate"
                    value={productDetails.discountStartDate}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                {/* Discount End Date */}
                <div>
                  <label htmlFor="discountEndDate" className="block text-sm font-medium">Discount End Date</label>
                  <input
                    type="date"
                    id="discountEndDate"
                    name="discountEndDate"
                    value={productDetails.discountEndDate}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                {/* Category and Subcategory */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={productDetails.category}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {productDetails.category && (
                  <div>
                    <label htmlFor="subcategory" className="block text-sm font-medium">Subcategory</label>
                    <select
                      id="subcategory"
                      name="subcategory"
                      value={productDetails.subcategory}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      required
                    >
                      <option value="">Select Subcategory</option>
                      {categories
                        .find((category) => category._id === productDetails.category)
                        ?.subcategories.map((subcategory) => (
                          <option key={subcategory._id} value={subcategory._id}>
                            {subcategory.name}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleFormSubmit}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
              >
                Update Product
              </button>
            </form>
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-6 top-1 mt-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* delete product modal  */}

      {selectedProduct && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50">
          <div className="bg-white p-5 rounded shadow-md">
            <p>Are you sure you want to delete this product?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-gray-400 px-4 py-2 rounded"
                onClick={() => setSelectedProduct(null)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={confirmDelete}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded bg-gray-300 disabled:bg-gray-500"
        >
          Prev
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 border rounded mx-1 bg-blue-500 text-white"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Products;
