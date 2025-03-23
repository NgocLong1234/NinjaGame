const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router()

//Dang ki tai khoan
router.post('/register', async (req, res) => {
    const {username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword});
    
    await newUser.save();
    res.json({ message: 'Da Tao Thanh Cong'});
});

//Dang Nhap
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if  (!user || !(await bcrypt.compare(password, user.password))) {
         return  res.status(400).json({ error: 'Thong Tin Khong Hop Le'});
    }

    const token = jwt.sign({ id: user._id}, 'secret_key', { expiresIn: '1h'});

});

module.exports = router;

