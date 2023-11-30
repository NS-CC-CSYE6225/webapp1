const { findId, findAssignmentInfo, updateAssignment, deleteAssignmentById } = require("../services/assignmentsService");
const { Assignment } = require('../models/assignments');
const { Submit } = require('../models/submit');
const logger = require('../CloudWatch/logger').logger;
const statsdClient = require("../CloudWatch/statsd").statsdClient;
const process = require('process');
const env = 'development';
const config = require(__dirname + '/../config/config.json')[env];

const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });


async function createAssignment(req, res) {
  statsdClient.increment("createAssignment.count");
  const userToken = req.headers.authorization;
  const fields = Buffer.from(userToken.split(' ')[1], 'base64').toString().split(':');
  const username = fields[0];
  findId(username).then((id) => {
    const { name, points, num_of_attemps, deadline } = req.body;

    // Check for required fields
    if (!name || !points || !num_of_attemps || !deadline) {
      logger.error("ERROR: Required fields missing (HTTP Status: 400 BAD REQUEST)");
      return res.status(400).send('Required fields missing');
    }

    // Check for valid values (e.g., float, negative values)
    if (isNaN(parseFloat(points)) || points < 0) {
      logger.error("ERROR: Invalid value for 'points' (HTTP Status: 400 BAD REQUEST)");
      return res.status(400).send('Invalid value for "points"');
    }

    if (isNaN(parseInt(num_of_attemps)) || num_of_attemps < 0) {
      logger.error("ERROR: Invalid value for 'num_of_attemps' (HTTP Status: 400 BAD REQUEST)");
      return res.status(400).send('Invalid value for "num_of_attemps"');
    }

    const assignment = Assignment.create({
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
      logger.info("INFO: Created assignment (HTTP Status: 201 CREATED)");
      return res.status(201).json(response).send();
    });
  })
}

async function getAllAssignments(req, res) {
  statsdClient.increment("getAllAssignments.count");
  Assignment.findAll()
    .then((assignments) => {
      let response = [];
      for (let i = 0; i < assignments.length; i++) {
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
      logger.info("INFO: Fetched all assignments (HTTP Status: 200 OK)");
      return res.status(200).json(response).send();
    })
}

async function getAssignment(req, res) {
  statsdClient.increment("getAssignment.count");
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
    logger.info(`INFO: Fetched assignment with with ID: ${assignmentId} (HTTP Status: 200 OK)`);
    return res.status(200).json(response).send();
  })
}


async function updateAssignments(req, res) {
  statsdClient.increment("updateAssignments.count");
  try {
    const assignment_Id = req.params.id;
    const userToken = req.headers.authorization;
    const fields = Buffer.from(userToken.split(' ')[1], 'base64').toString().split(':');
    const username = fields[0];

    const id = await findId(username);
    const assignment = await findAssignmentInfo(assignment_Id);

    if (id === assignment.user_id) {
      const { name, points, num_of_attemps, deadline } = req.body;

      if (points !== undefined && (isNaN(parseFloat(points)) || points < 0)) {
        logger.error("ERROR: Invalid value for 'points' (HTTP Status: 400 BAD REQUEST)");
        return res.status(400).send('Invalid value for "points"');
      }

      if (num_of_attemps !== undefined && (isNaN(parseInt(num_of_attemps)) || num_of_attemps < 0)) {
        logger.error("ERROR: Invalid value for 'num_of_attemps' (HTTP Status: 400 BAD REQUEST)");
        return res.status(400).send('Invalid value for "num_of_attemps"');
      }

      const updatedData = {
        name: name,
        points: points,
        num_of_attemps: num_of_attemps,
        deadline: deadline
      };

      const [updatedCount] = await Assignment.update(updatedData, {
        where: { id: assignment_Id }
      });

      if (updatedCount > 0) {
        logger.info(`INFO: Updated assignment ID ${assignment_Id} (HTTP Status: 204 NO CONTENT)`);
        return res.status(204).send();
      } else {
        logger.error("ERROR: Assignment not found (HTTP Status: 404 NOT FOUND)");
        return res.status(404).send('Assignment not found or not updated');
      }
    } else {
      logger.error("ERROR: Unauthorized (HTTP Status: 401 UNAUTHORIZED)");
      return res.status(401).send('Unauthorized');
    }
  } catch (error) {
    console.error('Error in updateAssignments:', error);
    logger.error("ERROR: Failed to update assignment (HTTP Status: 400 BAD REQUEST)");
    return res.status(400).send('Bad Request');
  }
}


async function deleteAssignment(req, res) {
  statsdClient.increment("deleteAssignment.count");
  const assignmentId = req.params.id;
  findAssignmentInfo(assignmentId).then((assignment) => {
    const userToken = req.headers.authorization;
    const fields = Buffer.from(userToken.split(' ')[1], 'base64').toString().split(':');
    const username = fields[0];
    findId(username).then((id) => {
      if (id == assignment.user_id) {

        // Check for presence of body in DELETE request
        if (req.body && Object.keys(req.body).length > 0) {
          logger.error("ERROR: Body not allowed in DELETE request (HTTP Status: 400 BAD REQUEST)");
          return res.status(400).send('Body not allowed in DELETE request');
        }

        deleteAssignmentById(assignmentId).then(() => {
          logger.info(`INFO: Deleted assignment ID ${assignmentId}(HTTP Status: 204 NO CONTENT)`);
          return res.status(204).send();
        });
      } else {
        logger.error("ERROR: Unauthorized deletion attempt (HTTP Status: 401 UNAUTHORIZED)");
        return res.status(401).send('Unauthorized deletion attempt');
      }
    });

  })
}

async function submitAssignment(req, res) {
  statsdClient.increment("submitAssignment.count");
  try {
    const assignmentId = req.params.id;
    const userToken = req.headers.authorization;
    const fields = Buffer.from(userToken.split(' ')[1], 'base64').toString().split(':');
    const username = fields[0];
    const id = await findId(username);
    const assignment = await findAssignmentInfo(assignmentId);

    if (!assignment) {
      logger.error("ERROR: Assignment not found (HTTP Status: 404 NOT FOUND)");
      return res.status(404).send('Assignment not found');
    }

    // Check if the submission deadline has passed
    const currentDateTime = new Date();
    const deadlineDateTime = new Date(assignment.deadline);

    if (currentDateTime > deadlineDateTime) {
      logger.error("ERROR: Submission deadline has passed (HTTP Status: 400 BAD REQUEST)");
      return res.status(400).send('Submission deadline has passed');
    }

    // Check if the user has exceeded the maximum number of attempts
    const existingSubmissionsCount = await getSubmissionCountForAssignmentAndUser(assignmentId, id);
    const maxAttempts = assignment.num_of_attemps;

    if (existingSubmissionsCount >= maxAttempts) {
      logger.error("ERROR: User has exceeded the maximum number of attempts (HTTP Status: 400 BAD REQUEST)");
      return res.status(400).send('User has exceeded the maximum number of attempts');
    }

    const { submission_url } = req.body;


    const sns = new AWS.SNS();
    const snsMessage = {
      Message: JSON.stringify({
        userEmail: username,
        githubRepo: submission_url,
        releaseTag: "webapp",
      }),
      TopicArn: config.TOPIC_ARN,
    };

    await sns.publish(snsMessage).promise();

    const submission = await Submit.create({
            submission_url: submission_url,
            submission_date: new Date(),
            submission_updated: new Date(),
            assignment_id: assignmentId,
            user_id: id
          });

    logger.info(`INFO: Submitted assignment ID ${assignmentId} (HTTP Status: 201 CREATED)`);
    return res.status(201).json(submission).send();
  } catch (error) {
    console.error('Error in submitAssignment:', error);
    logger.error("ERROR: Failed to submit assignment (HTTP Status: 400 BAD REQUEST)");
    return res.status(400).send('Bad Request');
  }
}

// Add this function to get the submission count for a specific assignment and user
async function getSubmissionCountForAssignmentAndUser(assignmentId, userId) {
  try {
    const submissionCount = await Submit.count({
      where: {
        assignment_id: assignmentId,
        user_id: userId
      }
    });
    return submissionCount;
  } catch (error) {
    console.error('Error getting submission count:', error);
    throw error;
  }
}

// async function submitAssignment(req, res) {
//   statsdClient.increment("submitAssignment.count");
//   try {
//     const assignmentId = req.params.id;
//     const userToken = req.headers.authorization;
//     const fields = Buffer.from(userToken.split(' ')[1], 'base64').toString().split(':');
//     const username = fields[0];
//     const userId = await findId(username);

//     const { submission_url } = req.body;

//     if (!submission_url) {
//       logger.error("ERROR: Required field 'submission_url' missing (HTTP Status: 400 BAD REQUEST)");
//       return res.status(400).send('Required field "submission_url" missing');
//     }

//     const submission = await Submit.create({
//       submission_url: submission_url,
//       submission_date: new Date(),
//       submission_updated: new Date(),
//       assignment_id: assignmentId,
//     });

//     logger.info(`INFO: Assignment ID ${assignmentId} submitted successfully (HTTP Status: 201 CREATED)`);
//     return res.status(201).json(submission).send();
//   } catch (error) {
//     console.error('Error in submitAssignment:', error);
//     logger.error("ERROR: Failed to submit assignment (HTTP Status: 400 BAD REQUEST)");
//     return res.status(400).send('Bad Request');
//   }
// }

module.exports = {
  createAssignment, getAllAssignments, getAssignment, updateAssignments, deleteAssignment, submitAssignment, getSubmissionCountForAssignmentAndUser
};