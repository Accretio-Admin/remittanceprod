const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { credentialsService } = require('../services');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');

const addCredential = catchAsync(async (req, res) => {
    const newCredential = await credentialsService.createCredential(req.body);
    res.status(httpStatus.CREATED).send(newCredential);
});
const getCredentials = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'role']);
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'filter']);
    const result = await credentialsService.queryCredentials(filter, options);
    res.send(result);
});
// Not in use atm
const getCredentialById = catchAsync(async (req, res) => {
    const credential = await credentialsService.getCredentialById(req.params.credentialId);
    if (!credential) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Credential not found');
    }
    res.send(credential);
});
const getCredentialAssignmentsByCredentialId = catchAsync(async (req, res) => {
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'filter']);
    const assignments = await credentialsService.getCredentialAssignmentsByCredentialId(req.params.credentialId, options);
    if (!assignments) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Assignments not found');
    }
    res.send(assignments);
});
const getUserAssignmentByCredentialId = catchAsync(async (req, res) => {
    const assignment = await credentialsService.getUserAssignmentByCredentialId(req.params.credentialId, req.params.userId);
    if (!assignment) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Assignment not found');
    }
    res.send(assignment);
});
const unassignCredential = catchAsync(async (req, res) => {
    const credential = await credentialsService.deleteCredentialAssignment(req.body.userId);
    res.send(credential);
});
const editCredentials = catchAsync(async (req, res) => {
    const credential = await credentialsService.editCredentialById(req.params.credentialId, req.body);
    res.send(credential);
});
const removeCredentials = catchAsync(async (req, res) => {
    const credential = await credentialsService.deleteCredential(req.params.credentialId, req.body);
    res.send(credential);
});
const assignCredential = catchAsync(async (req, res) => {
    const credential = await credentialsService.assignCredential(req.params.credentialId, req.body);
    res.send(credential);
});
module.exports = {
    addCredential,
    getCredentials,
    editCredentials,
    removeCredentials,
    getCredentialById,
    assignCredential,
    getCredentialAssignmentsByCredentialId,
    unassignCredential,
    getUserAssignmentByCredentialId
};
