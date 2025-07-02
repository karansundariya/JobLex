const express = require("express");
const { login, logout, register, updateProfile, markJobAsApplied, checkJobApplied, saveJob, getSavedJobs, unsaveJob, addTrackedKeyword, removeTrackedKeyword, getProfile, getUserStats } = require("../controllers/user.controller.js");
const isAuthenticated = require("../middlewares/isAuthenticated.js");
const { multiUpload } = require("../middlewares/mutler.js");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const updateLastActive = require("../middlewares/updateLastActive.js");

const router = express.Router();

router.route("/register").post(upload.single('file'), register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated, updateLastActive, multiUpload, updateProfile);
router.route("/job/:jobId/mark-applied").post(isAuthenticated, updateLastActive, markJobAsApplied);
router.route("/job/:jobId/check-applied").get(isAuthenticated, updateLastActive, checkJobApplied);
router.route("/job/:jobId/save").post(isAuthenticated, updateLastActive, saveJob);
router.route("/job/:jobId/unsave").post(isAuthenticated, updateLastActive, unsaveJob);
router.route("/saved-jobs").get(isAuthenticated, updateLastActive, getSavedJobs);
router.route("/track-keyword").post(isAuthenticated, updateLastActive, addTrackedKeyword);
router.route("/untrack-keyword").post(isAuthenticated, updateLastActive, removeTrackedKeyword);
router.route("/profile").get(isAuthenticated, updateLastActive, getProfile);
router.route("/stats").get((req, res, next) => { console.log("/api/v1/user/stats called"); next(); }, getUserStats);

module.exports = router;

