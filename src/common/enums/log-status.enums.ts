export enum LogStatus {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}

export enum LogAction {
  LOGIN = 'Login',
  LOGOUT = 'Logout',
  REGISTER = 'Register',
  
  CREATE_FACTURA = 'Create Invoice',
  UPDATE_FACTURA = 'Update Invoice',
  DELETE_FACTURA = 'Delete Invoice',
  VIEW_FACTURA = 'View Invoice',
  
  CREATE_PRODUCTO = 'Create Product',
  UPDATE_PRODUCTO = 'Update Product',
  DELETE_PRODUCTO = 'Delete Product',

  CREATE_USER = 'Create User',
  UPDATE_USER = 'Update User',
  DELETE_USER = 'Delete User',
  VIEW_USER = 'View User',
  GET_ALL_USERS = 'Get All Users',

  CREATE_MARCA = 'Create Brand',
  UPDATE_MARCA = 'Update Brand',
  DELETE_MARCA = 'Delete Brand',
  VIEW_MARCA = 'View Brand',
  GET_ALL_MARCAS = 'Get All Brands',

  VIEW_PROVEEDOR = 'View Provider',
  GET_ALL_PROVEEDORES = 'Get All Providers',

  VIEW_CATEGORIA = 'View Category',
  GET_ALL_CATEGORIAS = 'Get All Categories',
}