import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategories } from "../../../store/actions/categoryActions";
import { addProduct } from "../../../store/actions/productActions";
import Products from "./GetProducts";
import { toast } from "react-toastify";

const ShopDashboard = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);
  const productAddState = useSelector((state) => state.productAdd);
  const [refresh , setrefresh] = useState(0)
  const { loading, error } = productAddState;

  const [productDetails, setProductDetails] = useState({
    name: "",
    description: "",
    price: 10,
    category: "",
    subcategory: "",
    stock: 1,
    images: [],
    discountPercentage: "",
    discountStartDate: "",
    discountEndDate: "",
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
  
    if (type === "file" && name === "images") {
      setProductDetails({ ...productDetails, images: files });
    } else {
      setProductDetails({ ...productDetails, [name]: value });
    }
  };
  
  const todayDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (productDetails.discountPercentage !== "" && productDetails.discountPercentage < 5) {
      toast.error("Discount percentage must be at least 5%");
      return;
    }

    if (productDetails.price !== "" && productDetails.price < 10) {
      toast.error("Product price must be at least 10");
      return;
    }

    const formData = new FormData();
    formData.append("name", productDetails.name);
    formData.append("description", productDetails.description);
    formData.append("price", productDetails.price);
    formData.append("category", productDetails.category);
    formData.append("subcategory", productDetails.subcategory);
    formData.append("stock", productDetails.stock);
    if (productDetails.discountPercentage === 0 || productDetails.discountPercentage === "") {
      formData.append("discountPercentage", "");
      formData.append("discountStartDate", "");
      formData.append("discountEndDate", "");
    } else {
      formData.append("discountPercentage", productDetails.discountPercentage);
      formData.append("discountStartDate", productDetails.discountStartDate);
      formData.append("discountEndDate", productDetails.discountEndDate);
    }
    
    
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }
    
    console.log("Images: ", productDetails.images);

    Array.from(productDetails.images).forEach((file) => {
      formData.append("images", file); 
    });
    
  
    dispatch(addProduct(formData)); 
    setrefresh(1)
    setProductDetails(
      {
        name: "",
        description: "",
        price: "",
        category: "",
        subcategory: "",
        stock: "",
        discountPercentage: "",
        discountStartDate: "",
        discountEndDate: "",
        images: []
      }
    )
  };

  return (
    <div className="space-y-6 p-6 bg-gray-100">

         <Products refresh={refresh} />
         
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-2xl font-semibold">Add New Product</h2>
        {/* Input Fields */}
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
            <label htmlFor="images" className="block text-sm font-medium">Images only (png , jpg , jpeg)</label>
            <input
              type="file"
              id="images"
              name="images"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              multiple
                accept="image/png, image/jpeg, image/jpg"
            />
          </div>

          {/* Display selected images */}
          <div>
            <h3 className="text-sm font-medium">Selected Images:</h3>
            <div className="flex space-x-2">
              {Array.from(productDetails.images).map((image, index) => (
                <img key={index} src={URL.createObjectURL(image)} alt={`Selected ${index}`} className="w-24 h-24 object-cover" />
              ))}
            </div>
          </div>

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
              max={todayDate}
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
    {categories?.length > 0 ? (
      categories.map((category) => (
        <option key={category._id} value={category._id}>
          {category.name}
        </option>
      ))
    ) : (
      <option disabled>No categories available</option>
    )}
  </select>
</div>

          {productDetails.category && categories?.length > 0 && (
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
        )) || <option disabled>No subcategories available</option>}
    </select>
  </div>
)}
        </div>

        {/* Display Loading or Error Messages */}

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {loading ? 'Loading' : 'Add Product'}
        </button>
      </form>
    </div>
    
)};

export default ShopDashboard;
