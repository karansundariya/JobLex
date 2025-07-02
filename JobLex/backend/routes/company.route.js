const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated.js");
const { getCompany, getCompanyById, registerCompany, updateCompany, deleteCompany } = require("../controllers/company.controller.js");
const { multiUpload } = require("../middlewares/mutler.js");

const router = express.Router();

router.route("/register").post(isAuthenticated, multiUpload, registerCompany);
router.route("/get").get(isAuthenticated,getCompany);
router.route("/get/:id").get(isAuthenticated,getCompanyById);
router.route("/update/:id").put(isAuthenticated, multiUpload, updateCompany);
router.route("/:id").delete(isAuthenticated, deleteCompany);

module.exports = router;

