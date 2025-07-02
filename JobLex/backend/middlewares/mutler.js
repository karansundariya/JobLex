const multer = require("multer");

const storage = multer.memoryStorage();
const multiUpload = multer({storage}).fields([
  { name: 'file', maxCount: 1 },
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'logo', maxCount: 1 }
]);

module.exports = { multiUpload };