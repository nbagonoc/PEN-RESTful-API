const express = require("express");
const router = express.Router();
const validator = require("validator");
const isEmpty = require("../../utils/isEmpty");
const db = require("../../config/db");

// MODELS
const Item = require("../../models/Item");

// GET | api/items
// display all the items
router.get("/", (req, res) => {
  db.query("SELECT * FROM items")
    .then(items => {
      if (isEmpty(items.rows)) {
        return res.json({ message: "no items found" });
      } else {
        return res.json(items.rows);
      }
    })
    .catch(ex => {
      return res
        .status(500)
        .json({ success: false, message: "something went wrong" });
    });
});

// GET | api/items/:id
// get a single item
router.get("/:id", (req, res) => {
  db.query("SELECT * FROM items WHERE id = $1", [req.params.id])
    .then(item => {
      if (isEmpty(item.rows)) {
        res.status(404).json({ message: "item not found" });
      } else {
        res.json(item.rows);
      }
    })
    .catch(ex => {
      return res
        .status(500)
        .json({ success: false, message: "something went wrong" });
    });
});

// POST | api/items
// creates an item
router.post("/", (req, res) => {
  const { errors, isValid } = validateCreateItem(req.body);

  // check if data sent was ""
  function validateCreateItem(data) {
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : "";
    data.weight = !isEmpty(data.weight) ? data.weight : "";
    data.size = !isEmpty(data.size) ? data.size : "";

    // validate using validator
    if (validator.isEmpty(data.name)) {
      errors.name = "Name is required";
    }
    if (validator.isEmpty(data.weight)) {
      errors.weight = "Weight is required";
    }
    if (validator.isEmpty(data.size)) {
      errors.size = "Size is required";
    }
    return {
      errors,
      isValid: isEmpty(errors)
    };
  }
  if (!isValid) {
    // data sent has errors, show errors
    return res.status(400).json(errors);
  } else {
    // save item
    const { name, weight, size } = req.body;
    db.query("INSERT INTO items (name, weight, size) VALUES ($1, $2, $3)", [
      name,
      weight,
      size
    ])
      .then(() => {
        return res.json({
          success: true,
          message: "successfully created item"
        });
      })
      .catch(ex => {
        return res
          .status(500)
          .json({ success: false, message: "something went wrong" });
      });
  }
});

// PUT | api/items/:id
// edit/update an item
router.put("/:id", (req, res) => {
  const { errors, isValid } = validateUpdateItem(req.body);

  // update travent validation
  function validateUpdateItem(data) {
    let errors = {};

    // check if data sent was ""
    data.name = !isEmpty(data.name) ? data.name : "";
    data.weight = !isEmpty(data.weight) ? data.weight : "";
    data.size = !isEmpty(data.size) ? data.size : "";

    // validate using validator
    if (validator.isEmpty(data.name)) {
      errors.name = "Name is required";
    }
    if (validator.isEmpty(data.weight)) {
      errors.weight = "Weight is required";
    }
    if (validator.isEmpty(data.size)) {
      errors.size = "Size is required";
    }
    return {
      errors,
      isValid: isEmpty(errors)
    };
  }
  if (!isValid) {
    return res.status(400).json(errors);
  } else {
    db.query("UPDATE items SET name=$1, weight=$2, size=$3 Where id=($4)", [
      req.body.name,
      req.body.weight,
      req.body.size,
      req.params.id
    ])
      .then(updated => {
        if (updated.rowCount == 0) {
          return res.status(404).json({ message: "item not found" });
        } else {
          return res.json({
            success: true,
            message: "successfully updated item"
          });
        }
      })
      .catch(ex => {
        return res
          .status(500)
          .json({ success: false, message: "something went wrong" });
      });
  }
});

// DELETE | api/items/:id
// Delete an item
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM items WHERE id=($1)", [req.params.id])
    .then(removed => {
      if (removed.rowCount == 0) {
        return res.status(404).json({ message: "item not found" });
      } else {
        return res.json({
          success: true,
          message: "successfully removed item"
        });
      }
    })
    .catch(ex => {
      return res
        .status(500)
        .json({ success: false, message: "something went wrong" });
    });
});

module.exports = router;
