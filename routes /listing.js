const express = require('express');
const router= express.Router();
const wrapAsync=require("../util/wrapAsync.js");
const { isLoggedIn , isOwner , validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer= require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

//Index Route and create route
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn , upload.single('listing[image]') , validateListing ,wrapAsync( listingController.createListing));


//New listing route
router.get("/new", isLoggedIn , listingController.renderNewForm);

//Listing Operations: view, update, and delete
router.route("/:id")
.get(wrapAsync( listingController.showListing))
.put(isLoggedIn , isOwner , upload.single('listing[image]') , validateListing, wrapAsync( listingController.updateListing))
.delete(isLoggedIn , isOwner ,wrapAsync( listingController.destroyListing));


//Edit listing route
router.get("/:id/edit", isLoggedIn , isOwner , wrapAsync( listingController.renderEditForm));

module.exports = router;
