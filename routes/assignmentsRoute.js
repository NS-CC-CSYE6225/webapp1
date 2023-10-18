const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/assignmentMiddleware");
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(authenticateUser);
const { createAssignment, getAllAssignments, getAssignment, updateAssignments, deleteAssignment } = require("../controllers/assignmentsControllers");


// API routes for assignments

router.post('/', createAssignment);

router.get('/', getAllAssignments);

router.get('/:id', getAssignment);

router.put('/:id', updateAssignments);

router.delete('/:id', deleteAssignment);
  

module.exports = router;