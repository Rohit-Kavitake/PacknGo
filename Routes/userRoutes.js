const express = require('express');
const userController = require('./../Controllers/userController');
const authController = require('./../Controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updatePassword', authController.protect, authController.updatePassword);
router.patch('/updateMyData', authController.protect, userController.updateMe);
router.delete('/deleteUser', authController.protect, userController.deleteUser);

router.route('/').get(userController.getUsers);

router
    .route('/:id')
    // .get(userController.getUser)
    // .patch(userController.updateUser)
    .delete(authController.protect, userController.deleteUser);

module.exports = router;
