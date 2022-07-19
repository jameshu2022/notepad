var express = require('express');
var router = express.Router();

var user_controller = require("../controllers/userController");
var { authenticateToken } = require("../middleware/authenticateToken.js");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json( {msg : "hi homie"} );
});

router.post("/users/login", user_controller.user_login_post);
router.post("/users/logout", user_controller.user_logout_post);

router.get("/users/create", user_controller.user_create_get);
router.post("/users/create", user_controller.user_create_post);

router.get("/users/:id/delete", authenticateToken, user_controller.user_delete_get);
router.post("/users/:id/delete", authenticateToken, user_controller.user_delete_post);

router.get("/users/:id/update", user_controller.user_update_get);
router.post("/users/:id/update", user_controller.user_update_post);

router.post("/users/:id/updatenotepad", authenticateToken, user_controller.user_notepad_update_post);

router.get("/users/:id/notepad", user_controller.user_notepad_get);

router.get("/users/:id", user_controller.user_detail);

router.get("/users", user_controller.user_list);

router.get("/tinyapi", user_controller.user_apikey_get);



module.exports = router;
