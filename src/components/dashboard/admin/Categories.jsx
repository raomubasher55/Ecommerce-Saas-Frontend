import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addCategory,
  getAllCategories,
  deleteCategory,
  addSubCategory,
  updateCategory,
  updateSubCategory,
} from '../../../store/actions/categoryActions';

export default function Categories() {
  const dispatch = useDispatch();
  const { error, categories } = useSelector((state) => state.categories);

  const [formData, setFormData] = useState({
    name: '',
  });

  const [subCategoryData, setSubCategoryData] = useState({
    name: '',
    description: '',
    mainCategoryId: '',
    id:''
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubCategory, setEditingSubCategory] = useState(null);

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  const handleCategoryChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubCategoryChange = (e) => {
    setSubCategoryData({ ...subCategoryData, [e.target.name]: e.target.value });
  };

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    if (editingCategory) {
      dispatch(updateCategory(editingCategory._id, formData));
      setEditingCategory(null); 
    } else {
      dispatch(addCategory(formData));
    }
    setFormData({ name: '' });
  };

  // Handle delete category
  const handleDelete = (id) => {
    dispatch(deleteCategory(id));
  };

  // Handle edit category
  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name });
  };

  const handleEditSubCategory = (subCategory, categoryId) => {
    console.log(subCategory, 'checked', categoryId);
    setEditingSubCategory(subCategory);
    setSubCategoryData({
      name: subCategory.name,
      description: subCategory.description,
      mainCategoryId: categoryId,
      id: subCategory._id, 
    });
  };
  

  const handleSubCategorySubmit = (e) => {
    e.preventDefault();
    if (editingSubCategory) {
      dispatch(updateSubCategory(subCategoryData.mainCategoryId, subCategoryData)); 
      setEditingSubCategory(null); 
    } else {
      dispatch(addSubCategory(subCategoryData));
    }
    setSubCategoryData({ name: '', description: '', mainCategoryId: '', id: '' });
  };
  


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          {editingCategory ? 'Update Category' : 'Add Category'}
        </h2>
        <form onSubmit={handleCategorySubmit} className="mb-6">
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Category Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleCategoryChange}
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter category name"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            {editingCategory ? 'Update Category' : 'Add Category'}
          </button>
        </form>

        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          {editingSubCategory ? 'Update Subcategory' : 'Add Subcategory'}
        </h2>
        <form onSubmit={handleSubCategorySubmit}>
          <div className="mb-4">
            <label
              htmlFor="subCategoryName"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Subcategory Name
            </label>
            <input
              type="text"
              id="subCategoryName"
              name="name"
              value={subCategoryData.name}
              onChange={handleSubCategoryChange}
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter subcategory name"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={subCategoryData.description}
              onChange={handleSubCategoryChange}
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter subcategory description"
              rows="3"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              htmlFor="mainCategoryId"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Select Main Category
            </label>
            <select
              id="mainCategoryId"
              name="mainCategoryId"
              value={subCategoryData.mainCategoryId}
              onChange={handleSubCategoryChange}
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:ring-blue-300"
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
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200"
          >
            {editingSubCategory ? 'Update Subcategory' : 'Add Subcategory'}
          </button>
        </form>

        <div className="mt-8">
          <h3 className="text-xl font-bold text-gray-800">All Categories</h3>
          <ul className="mt-4 space-y-4">
            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map((category) => (
                <li key={category._id} className="p-4 bg-gray-100 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">{category.name}</span>
                    <div className="flex">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="text-blue-500 hover:text-blue-700 ml-2 text-xl font-bold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category._id)}
                        className="text-red-500 hover:text-red-700 ml-2 text-xl font-bold"
                      >
                        &#8211;
                      </button>
                    </div>
                  </div>
                  {category.subcategories &&
                    Array.isArray(category.subcategories) &&
                    category.subcategories.length > 0 && (
                      <ul className="mt-4 ml-4 pl-4 border-l border-gray-300">
                        {category.subcategories.map((subCategory) => (
                          <div key={subCategory._id} className="shadow-lg p-4 rounded-lg">
                          <li className="text-gray-700">
                            - {subCategory.name}
                            <button
                              onClick={() => handleEditSubCategory(subCategory, category._id)}
                              className="text-blue-500 hover:text-blue-700 ml-2 text-sm"
                            >
                              Edit
                            </button>
                            </li>
                            <li className='text-[15px] mt-1 mb-3'>{subCategory.description}</li>
                            </div>
                        ))}
                      </ul>

                    )}
                </li>
              ))
            ) : (
              <p>No categories available</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
