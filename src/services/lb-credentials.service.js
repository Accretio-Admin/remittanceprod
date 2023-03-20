const httpStatus = require('http-status');
const { LandbankCredentials, CredentialsAssignment } = require('../models');
const ApiError = require('../utils/ApiError');
const { userService } = require('../services');


const createCredential = async (credentialBody) => {
    if (await isCredentialTaken(credentialBody.username)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Credential already available.');
    }
    return LandbankCredentials.create(credentialBody);
};
const queryCredentials = async (filter, options) => {
    const credentials = await LandbankCredentials.paginate(filter, options);
    return credentials;
};
const isCredentialTaken = async (username) => {
    return LandbankCredentials.findOne({ username: username, deleted: false });
};

const editCredentialById = async (credentialId, updateBody) => {
    const credential = await getCredentialById(credentialId);
    if (!credential) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Credential not found');
    }
    Object.assign(credential, updateBody);
    await credential.save();
    return credential;
};
const deleteCredential = async (credentialId) => {
    const remove = { deleted: true };
    return await editCredentialById(credentialId, remove);
};
// not in use
const getCredentialById = async (id) => {
    return LandbankCredentials.findById(id);
};
const getCredentialAssignmentsByCredentialId = async (id, options) => {
    return CredentialsAssignment.paginate({credential: id}, options);
};

// Crdentials Assignments

const assignCredential = async (credentialId, assignBody) => {
    const user = await userService.getUserByEmail(assignBody.assignee);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    if (await isUserAssignedToAnyCredentials(user._id)) {
        await deleteCredentialAssignment(user._id);
    }
    const assignment = {
        assignee: user._id,
        credential: credentialId
    }
    return CredentialsAssignment.create(assignment);
};
const isUserAssignedToAnyCredentials = async (userId) => {
    const userhasAssignment = await CredentialsAssignment.findOne({ assignee: userId, deleted: false });
    // if (!userhasAssignment) {
    //     throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not allowed to create/inquire a transaction. Please contact administration.');
    // }
    return userhasAssignment;
};
const getUserAssignmentByCredentialId = async (credentialId, userId) => {
    return CredentialsAssignment.findOne({ assignee: userId, credential: credentialId, deleted: false });
};
const editCredentialAssignmentById = async (assignee, updateBody) => {
    const assignment = await getCredentialAssignmentById(assignee);
    if (!assignment) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Assignment not found');
    }
    Object.assign(assignment, updateBody);
    await assignment.save();
    return assignment;
};
const deleteCredentialAssignment = async (assigneeId) => {
    const remove = { deleted: true };
    return await editCredentialAssignmentById(assigneeId, remove);
};
const getCredentialAssignmentById = async (assignee) => {
    return CredentialsAssignment.findOne({assignee: assignee, deleted: false });
};

module.exports = {
    createCredential,
    queryCredentials,
    editCredentialById,
    deleteCredential,
    getCredentialById,
    assignCredential,
    getCredentialAssignmentsByCredentialId,
    isUserAssignedToAnyCredentials,
    deleteCredentialAssignment,
    getUserAssignmentByCredentialId

};
