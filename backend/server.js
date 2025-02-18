import uuid4 from 'uuid4';
import express from 'express';
import cors from 'cors';
import path from "path";


let counter = 1;
const __dirname = path.resolve();
const app = express();
app.use(cors());
app.use(express.json());

const users = [
  { id: uuid4(), name: 'admin', username: 'admin', password: '12345', email: 'admin@gmail.com' },
  { id: uuid4(), name: 'milad', username: 'milad', password: 'abcde', email: 'milad@gmail.com' },
];
const data = [
  {
    id: counter++,
    Product_name: 'A12',
    Product_price: 1350,
    Inventory: '2',
    Supplier: 'Big Store',
    Category: 'Mobile',
  },
  {
    id: counter++,
    Product_name: 'Asus Vivobook',
    Product_price: 18000,
    Inventory: '2',
    Supplier: 'Laptop Stoke',
    Category: 'Laptop',
  },
];

///////////////////////////Login And Users
// Get Users
app.get('/api/users', (req, res) => {
   res.json(users);
});
// Post Users
app.post('/login', (req, res) => {
  const { id, username, password } = req.body;
  const user = users.find((u) => u.id === id && u.username === username && u.password === password);

  if (user) {
    res.json({ success: true, token: id });
  } else {
    res.status(401).json({ success: false, message: 'نام کاربری یا رمز عبور اشتباه است' });
  }
});
// Post New User In Login Page
app.post('/api/signup', (req, res) => {
  const { username, password, email,name } = req.body;
  const existingUser = users.find((u) => u.username === username);
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'این نام کاربری قبلاً ثبت شده است' });
  }
  const newUser = {
    id: uuid4(),
    name,
    username,
    password,
    email,
  };

  users.push(newUser);
  res.json({ success: true, user: newUser, token: newUser.id });
});
// Edit User Data
app.post('/api/changeUserData', (req, res) => {
  const newUserData = req.body;
  console.log(newUserData);
  const findUserSlected = users.find((p) => p.id === newUserData.id);

  if (findUserSlected) {
    Object.assign(findUserSlected, newUserData);

    res.json({
      success: true,
      message: 'Users updated successfully',
      updatedProduct: findUserSlected,
    });
  } else {
    res.status(404).json({ success: false, message: 'user not found' });
  }
});
///////////////////////////Product Data
// Get Data
app.get('/api/data', (req, res) => {
  res.json(data);
});
// Edit Data
app.post('/api/editProducts', (req, res) => {
  const newDataProduct = req.body;
  const findProductSlected = data.find((p) => p.id === newDataProduct.id);

  if (findProductSlected) {
    Object.assign(findProductSlected, newDataProduct);

    res.json({
      success: true,
      message: 'Product updated successfully',
      updatedProduct: findProductSlected,
    });
  } else {
    res.status(404).json({ success: false, message: 'Product not found' });
  }
});
// Delete Data
app.delete('/api/deleteProduct', (req, res) => {
  const { id } = req.body;
  const productIndex = data.findIndex((p) => p.id === id);
  console.log(data);
  if (productIndex !== -1) {
    const deletedProduct = data.splice(productIndex, 1)[0];

    res.json({ success: true, message: 'Product deleted successfully', deletedProduct });
  } else {
    res.status(404).json({ success: false, message: 'Product not found' });
  }
});
// Create Product
app.post('/api/createProduct', (req, res) => {
  const newDataProduct = req.body;
  console.log(newDataProduct);
  if (!newDataProduct.Product_name || !newDataProduct.Product_price || !newDataProduct.Inventory) {
    return res.status(400).json({ success: false, message: 'Please enter all Inputs' });
  }
  const newProduct = {
    id: data.length > 0 ? data[data.length - 1].id + 1 : 1, // ID جدید بر اساس آخرین آیتم
    Product_name: newDataProduct.Product_name,
    Product_price: newDataProduct.Product_price,
    Inventory: newDataProduct.Inventory,
    Supplier: newDataProduct.Supplier,
    Category: newDataProduct.Category,
  };
  data.push(newProduct);
  res
    .status(201)
    .json({ success: true, message: 'Product added Successfully', product: newProduct });
});

app.use(express.static(path.join(__dirname, 'public', 'dist', 'spa')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dist', 'spa', 'index.html'));
});

const PORT = process.env.PORT || 9001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
