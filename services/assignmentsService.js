const { User } = require('../models/user');
const { Assignment } = require('../models/assignments');
// const db = require('../models');


async function findId(pEmail){
    const aUser = await User.findOne({
      where: {
        email: pEmail,
      },
    });
    const Id = String(aUser.id); 
    return Id;
  }

async function findPwd(pEmail){
console.log("email is ->" + pEmail);
console.log("User is ->" + User);
    const aUser = await User.findOne({
      where: {
        email: pEmail,
      },
    });
    const Pwd = String(aUser.password);
    console.log(Pwd);
    return Pwd;
  }


  async function findAssignmentInfo(assignmentId) {
    try {
        const assignmentInfo = await Assignment.findOne({
            where: {
                id: assignmentId,
            },
        });
  
        return assignmentInfo;
    } catch (error) {
        console.error('Error finding assignment information:', error);
        throw error;
    }
  }
  
  async function updateAssignment(assignmentId, updatedData) {

    // console.log("updated", updatedData);

    try {
      
        const [affectedRows, [updatedAssignment]] = await Assignment.update(updatedData, {
            where: { id: assignmentId },
            returning: true, 
        });
        console.log("updated", updatedAssignment);
        // if (affectedRows > 0) {
        //     console.log('Assignment updated successfully:', updatedAssignment);
        //     return updatedAssignment;
        // } 

        if (affectedRows > 0) {
          if (Array.isArray(updatedAssignment)) {
              const updatedAssignment = updatedAssignment[0];
              console.log('Assignment updated successfully:', updatedAssignment);
              return updatedAssignment;
          }
      }

        else {
            console.log('Assignment not found or not updated');
            return null;
        }
    } catch (error) {
        console.error('Error updating assignment:', error);
        throw error; 
    }
  }
  
  
  async function deleteAssignmentById(assignmentId) {
    try {
        const deletedRows = await Assignment.destroy({
            where: { id: assignmentId },
        });
  
        if (deletedRows > 0) {
            console.log('Assignment deleted successfully');
            return true; 
        } else {
            console.log('Assignment not found or not deleted');
            return false; 
        }
    } catch (error) {
        console.error('Error deleting assignment:', error);
        throw error; 
    }
  }

  module.exports = {
    findId, findPwd, findAssignmentInfo, updateAssignment, deleteAssignmentById
  };