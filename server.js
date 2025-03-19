const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());

mongoose
  .connect(
    'mongodb+srv://ramsundhar:123456789qwerty@cluster0.mv8k9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
  )
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB not connected:', err));

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.get('/register', async (req, res) => {
  try {
    const allUsers = await User.find();
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
});
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ message: 'Registration Successful' });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Registration failed', details: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
