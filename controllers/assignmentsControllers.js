const { findId, findAssignmentInfo, updateAssignment, deleteAssignmentById } = require("../services/assignmentsService");
const { Assignment } = require('../models/assignments');

    // Create a new assignment
    // router.post('/v1/assignments', authenticateUser, async (req, res) => {
      async function createAssignment(req, res){
        const userToken = req.headers.authorization;
        const fields = Buffer.from(userToken.split(' ')[1], 'base64').toString().split(':');
        const username = fields[0];
        findId(username).then((id) => {
          const { name, points, num_of_attemps, deadline} = req.body;
          const assignment =  Assignment.create({
            name: name,
            points: points,
            num_of_attemps: num_of_attemps,
            deadline: deadline,
            user_id: id
          }).then((newAssignment) => {
            const response = {
              "id": newAssignment.id,
              "name": name,
              "points": points,
              "num_of_attemps": num_of_attemps,
              "deadline": deadline,
              "assignment_created": newAssignment.assignment_created,
              "assignment_updated": newAssignment.assignment_updated
            };
      
            return res.status(201).json(response).send();
          });
        })
      }
      // });
  
  
  // GET all assignments
  // router.get('/v1/assignments', async (req, res) => {
    async function getAllAssignments(req, res){
      Assignment.findAll()
      .then((assignments) =>{
          let response = [];
          for(let i=0; i<assignments.length; i++){
            const assignment = {
              "id": assignments[i].id,
              "name": assignments[i].name,
              "points": assignments[i].points,
              "num_of_attemps": assignments[i].num_of_attemps,
              "deadline": assignments[i].deadline,
              "assignment_created": assignments[i].assignment_created,
              "assignment_updated": assignments[i].assignment_updated
            }
            response.push(assignment);
          }
          return res.status(200).json(response).send();
      })
    }
  // });
  
  //Get particular Assignment
  // router.get('/v1/assignments/:id', authenticateUser, (req,res) => {
      
  async function getAssignment(req, res){
      const assignmentId = req.params.id;
      findAssignmentInfo(assignmentId).then((assignment) => {
        let response = [
          {
            "id": assignment.id,
            "name": assignment.name,
            "points": assignment.points,
            "num_of_attemps": assignment.num_of_attemps,
            "deadline": assignment.deadline,
            "assignment_created": assignment.assignment_created,
            "assignment_updated": assignment.assignment_updated
          }
        ]
        return res.status(200).json(response).send();
      })
    }
    // });
  
  
  //Update Assignment
  // router.put('/v1/assignments/:id', authenticateUser, (req,res) => {
      
  async function updateAssignments(req, res){
      const assignment_Id = req.params.id;
      findAssignmentInfo(assignment_Id).then((assignment) => {
        const userToken = req.headers.authorization;
        const fields = Buffer.from(userToken.split(' ')[1], 'base64').toString().split(':');
        const username = fields[0];
        findId(username).then((id) => {
          if (id == assignment.user_id){
            const { name, points, num_of_attemps, deadline} = req.body;
            const updatedData = {
              name: name,
              points: points,
              num_of_attemps: num_of_attemps,
              deadline: deadline
            };
            updateAssignment(assignment_Id, updatedData).then(() => {
              return res.status(204).send();
            });
          }
        });
    
      })
    }
    // });
  
    //Delete Assignment
    // router.delete('/v1/assignments/:id', authenticateUser, (req,res) => {
      
    async function deleteAssignment(req, res){  
      const assignmentId = req.params.id;
      findAssignmentInfo(assignmentId).then((assignment) => {
        const userToken = req.headers.authorization;
        const fields = Buffer.from(userToken.split(' ')[1], 'base64').toString().split(':');
        const username = fields[0];
        findId(username).then((id) => {
          if (id == assignment.user_id){
            
            deleteAssignmentById(assignmentId).then(() => {
              return res.status(204).send();
            });
          }
        });
    
      })
    }
    // });
  
  
    module.exports = {
      createAssignment, getAllAssignments, getAssignment, updateAssignments, deleteAssignment
    };