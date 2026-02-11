const Project = require("../models/project");
const mongoose = require("mongoose");

async function addProject(req) {
  try {
    const { projectName,lpoDate, projectStartDate, projectEndDate, acceptanceDate } = req.body;
    if (!projectName) {
      throw new Error("Please fill out all required fields");
    }

    const lastProject = await Project.findOne({}, {}, { sort: { projectId: -1 } });

    let newId;
    if (!lastProject) {
      newId = 10000; // starting ID
    } else {
      const lastIdNumber = parseInt(lastProject.projectId.replace(/project-/i, ""), 10);
      newId = lastIdNumber + 1;
    }

    const projectData = {
      ...req.body,
      organisationRefId: req.user.organisationId,
      projectId: `project-${newId}`
    };

    const newProject = new Project(projectData);
    const savedProject = await newProject.save();

    return { status: 100, message: "success", result: savedProject };
  } catch (err) {
    return { status: 105, result: null, errorDetails: err.message };
  }
}

async function updateProject(req) {
  try {
    const { id } = req.query

    const updatedProject = await Project.findOneAndUpdate(
      { _id: id },
      req.body,
      { new: true }
    );

    if (!updatedProject) {
      return { status: 105, result: null, errorDetails: "Project not found" };
    }

    return { status: 100, message: "Project updated successfully", result: updatedProject };
  } catch (err) {
    return { status: 105, result: null, errorDetails: err.message };
  }
}


async function getAllProjects(req) {
  try {
    let { page = 1, limit = 10 ,showDeleted } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    if(showDeleted=="false"){
        const projects = await Project.find({organisationRefId: req.user.organisationId,isActive:true})
          .populate({
            path: "clientRefId",
            select: "clientName",
          })
          .sort({ projectId: 1 })          
          .skip((page - 1) * limit)
          .limit(limit);

        return {
          status: 100,
          message: "success",
          result: projects
        };
      }else{
          const projects = await Project.find({organisationRefId: req.user.organisationId,isActive:false})
            .populate({
              path: "clientRefId",
              select: "clientName",
            })
            .sort({ projectId: 1 })          
            .skip((page - 1) * limit)
            .limit(limit);

          return {
            status: 100,
            message: "success",
            result: projects
          };
      }
  } catch (err) {
    return {
      status: 105,
      result: null,
      errorDetails: err.message,
    };
  }
}

async function getProjectsByClient(req) {
  try {
    let { page = 1, limit = 10 , clientId } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);


    const projects = await Project.find({ clientRefId: clientId,organisationRefId: req.user.organisationId, isActive: true })
      .sort({ projectName: 1 })      
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      status: 100,
      message: "success",
      result: projects
    };
  } catch (err) {
    return {
      status: 105,
      result: null,
      errorDetails: err.message,
    };
  }
}

async function getProjectById(req) {
  try {
    let { projectId } = req.query;
    const projects = await Project.find({_id:projectId})
    .populate({
      path: "clientRefId",
      select: "clientName",
    })

    return {
      status: 100,
      message: "success",
      result: projects
    };
  } catch (err) {
    return {
      status: 105,
      result: null,
      errorDetails: err.message,
    };
  }
}

async function deleteProject(req) {
  try {
    const projectId = req.params.id;

    const project = await Project.findById(projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    project.isActive = !project.isActive;
    const result = await project.save();

    return {
      status: 100,
      message: "success",
      result: result
    };
  } catch (error) {
    return { status: 105, result: null, errorDetails: error.message };
  }
}

module.exports={
    addProject,
    getAllProjects,
    updateProject,
    getProjectsByClient,
    getProjectById,
    deleteProject
}