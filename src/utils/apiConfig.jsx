export const getAuthConfig = () => {
    const storeToken = localStorage.getItem('storeToken');
    return {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${storeToken}`,
      },
    };
  };


  export const getUserConfig = () => {
    const Token = localStorage.getItem('token');
    return {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Token}`,
      },
    };
  };