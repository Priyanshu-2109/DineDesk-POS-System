const express = require("express");
const { body, param, query } = require("express-validator");
const {
  addItem,
  editItem,
  deleteItem,
  getItems,
  getItem,
} = require("../controllers/menuController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Validation rules for adding a menu item
const addItemValidation = [
  body("item_name")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Item name must be between 1 and 100 characters")
    .notEmpty()
    .withMessage("Item name is required"),

  body("category")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Category must be between 1 and 50 characters")
    .notEmpty()
    .withMessage("Category is required"),

  body("price")
    .isFloat({ min: 0, max: 999999 })
    .withMessage("Price must be a number between 0 and 999,999")
    .notEmpty()
    .withMessage("Price is required"),
];

// Validation rules for editing a menu item
const editItemValidation = [
  param("id").isMongoId().withMessage("Invalid menu item ID format"),

  body("item_name")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Item name must be between 1 and 100 characters"),

  body("category")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Category must be between 1 and 50 characters"),

  body("price")
    .optional()
    .isFloat({ min: 0, max: 999999 })
    .withMessage("Price must be a number between 0 and 999,999"),

  body("isAvailable")
    .optional()
    .isBoolean()
    .withMessage("isAvailable must be a boolean value"),
];

// Validation rules for deleting/getting a menu item by ID
const itemIdValidation = [
  param("id").isMongoId().withMessage("Invalid menu item ID format"),
];

// Validation rules for getting menu items with filters
const getItemsValidation = [
  query("category")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Category must be between 1 and 50 characters"),

  query("available")
    .optional()
    .isIn(["true", "false"])
    .withMessage("Available filter must be true or false"),
];

// All routes are protected (require authentication)
router.use(protect);

// Menu item management routes
router.get("/", getItemsValidation, getItems);
router.get("/:id", itemIdValidation, getItem);
router.post("/add-item", addItemValidation, addItem);
router.put("/:id", editItemValidation, editItem);
router.patch("/update-item/:id", editItemValidation, editItem);
router.delete("/:id", itemIdValidation, deleteItem);

module.exports = router;
