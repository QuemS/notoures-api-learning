const express = require('express');

const router = express.Router();
const {
  deleteMe,
  updateMe,
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getImg,
} = require('../controllers/usersControllers');
const { signUp, login, fogotPassword, resetPassword, updatePassword, protect, activateUserEmail, protectActiveUser } = require('../controllers/authController');

router.route('/signup').post(signUp);
router.route('/login').post(protectActiveUser, login);
router.route('/activeEmail/:token').get(activateUserEmail);

router.route('/updatePassword').patch(protect, updatePassword);
router.route('/updateMe').patch(protect, updateMe);
router.route('/deleteMe').delete(protect, deleteMe);


router.route('/fogotPassword').post(protectActiveUser, fogotPassword);
router.route('/resetPassword/:token').patch(resetPassword);

router.route('/').get(getAllUsers).post(createUser);
router.route('/img/:name').get(getImg);
router.route('/:id').get(getUser).patch(updateUser).delete(protect, deleteUser);







module.exports = router;
