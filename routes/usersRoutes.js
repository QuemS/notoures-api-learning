const express = require('express');

const router = express.Router();
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getImg,
} = require('../controllers/usersControllers');
const { signUp, login, fogotPassword, resetPassword } = require('../controllers/authController');

router.route('/signup').post(signUp);
router.route('/login').post(login);

router.route('/fogotPassword').post(fogotPassword);
router.route('/resetPassword/:token').post(resetPassword);

router.route('/').get(getAllUsers).post(createUser);
router.route('/img/:name').get(getImg);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
