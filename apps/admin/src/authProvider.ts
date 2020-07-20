export const authProvider = {
  login: ({ username, password }: { username: string; password: string; }) =>  {
    const request = new Request('http://localhost:3000/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: username, password }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    return fetch(request)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(({ data }) => {
        localStorage.setItem('admin_token', data);
      });
  },
  logout: () => {
    localStorage.removeItem('admin_token');
    return Promise.resolve();
  },
  checkAuth: () => localStorage.getItem('admin_token')
    ? Promise.resolve()
    : Promise.reject(),
  checkError: (error: { status: number; }) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem('admin_token');
      return Promise.reject();
    }

    return Promise.resolve();
  },
  getPermissions: () => Promise.resolve(),
};
