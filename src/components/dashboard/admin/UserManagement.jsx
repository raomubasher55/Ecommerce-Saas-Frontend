import { useEffect, useState } from 'react';
import { FaSearch, FaUserEdit, FaTrashAlt, FaBan, FaCheckCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, filterUsers, deleteUser, updateUserRole } from '../../../store/actions/AlluserActions';

const UserManagement = () => {
  const dispatch = useDispatch();
  const { filteredUsers,search, role, loading, error } = useSelector((state) => state.users);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [updateError, setUpdateError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleSearch = (e) => {
    dispatch(filterUsers(e.target.value, role));
  };

  const filterByRole = (role) => {
    dispatch(filterUsers(search, role));
  };

  // const handleBlockUnblock = (id) => {
  //   dispatch(toggleBlock(id));
  // };

  const handleDelete = async () => {
    try {
      await dispatch(deleteUser(selectedUser._id));
      setShowDeleteModal(false);
    } catch (err) {
      console.log(err)
      setDeleteError(err.message || 'An error occurred while deleting the user');
    }
  };

  const handleUpdateRole = async () => {
    if (selectedUser && newRole) {
      try {
        await dispatch(updateUserRole(selectedUser._id, newRole));
        setShowModal(false);
      } catch (err) {
        setUpdateError(err.message || 'An error occurred while updating the role');
      }
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="w-full h-screen overflow-hidden relative">
      <div className="absolute inset-0 overflow-auto p-6 bg-gray-100">
        <h1 className="text-3xl font-bold text-[#4222C4] mb-6">User Management</h1>

        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center border rounded-lg px-4 py-2">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={handleSearch}
              className="outline-none bg-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => filterByRole('All')} className="px-4 py-2 bg-[#4222C4] text-white rounded-lg">All Users</button>
            <button onClick={() => filterByRole('admin')} className="px-4 py-2 bg-[#4222C4] text-white rounded-lg">Admins</button>
            <button onClick={() => filterByRole('user')} className="px-4 py-2 bg-[#4222C4] text-white rounded-lg">Customers</button>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 overflow-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-600">
                <th className="pb-2">Name</th>
                <th className="pb-2">Email</th>
                <th className="pb-2">Role</th>
                <th className="pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user , index) => (
                <tr key={index} className="border-t">
                  <td className="py-2 text-gray-800">{user.name}</td>
                  <td className="py-2 text-gray-600">{user.email}</td>
                  <td className="py-2 text-gray-600">{user.role}</td>
                  <td className="py-2 space-x-4">

                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowModal(true);
                      }}
                      className="text-yellow-500 hover:text-yellow-700"
                    >
                      <FaUserEdit />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex space-x-2 mt-6">
          {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`px-3 py-2 rounded-lg ${currentPage === index + 1 ? 'bg-[#4222C4] text-white' : 'bg-gray-200'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>


        {/* Modal for updating user role */}
        {showModal && (
          <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 px-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg">
              <h2 className="text-lg sm:text-xl font-bold mb-4">
                Update Role for {selectedUser.name}
              </h2>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="mb-4 w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
                <option value="user">User</option>
              </select>
              {updateError && (
                <div className="text-red-500 text-sm mb-4">{updateError}</div>
              )}
              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <button
                  onClick={handleUpdateRole}
                  className="px-4 py-2 bg-[#4222C4] text-white rounded-lg"
                >
                  Update Role
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}


        {/* Modal for delete confirmation */}
        {showDeleteModal && (
          <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 px-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg">
              <h2 className="text-lg sm:text-xl font-bold mb-4">
                Are you sure you want to delete {selectedUser.name}?
              </h2>
              {deleteError && (
                <div className="text-red-500 text-sm mb-4">{deleteError}</div>
              )}
              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}


      </div>
    </div>

  );
};

export default UserManagement;
