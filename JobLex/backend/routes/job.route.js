const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated.js");
const { getAdminJobs, getAllJobs, getJobById, postJob, deleteJob, updateJob } = require("../controllers/job.controller.js");

const router = express.Router();

router.route("/post").post(isAuthenticated, postJob);
router.route("/get").get(getAllJobs);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/get/:id").get(getJobById);
router.route("/:id").put(isAuthenticated, updateJob);
router.route("/:id").delete(isAuthenticated, deleteJob);

module.exports = router;

