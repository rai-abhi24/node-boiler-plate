const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const demoService = require('../services');

const createDemo = async (req, res, next) => {
    try {
        const data = req.body;
        await demoService.createDemo(data);

        return res
                .status(StatusCodes.CREATED)
                .json({
                    code: StatusCodes.OK,
                    message: getReasonPhrase(StatusCodes.CREATED),
                });
    } catch (error) {
        next(error);
    }
};

const createDemosBulk = async (req, res, next) => {
    try {
        const data = req.body;
        await demoService.createDemosBulk(data);

        return res
                .status(StatusCodes.CREATED)
                .json({
                    code: StatusCodes.OK,
                    message: getReasonPhrase(StatusCodes.CREATED),
                });
    } catch (error) {
        next(error);
    }
};

const getAllDemos = async (_req, res, next) => {
    try {
        const result = await demoService.getAllDemos();

        return res
                .status(StatusCodes.OK)
                .json({
                    code: StatusCodes.OK,
                    message: getReasonPhrase(StatusCodes.OK),
                    data: result,
                });
    } catch (error) {
        next(error);
    }
};

const getDemoById = async (req, res, next) => {
    try {
        const { id }= req.params;
        const result = await demoService.getDemoById(id);

        return res
                .status(StatusCodes.OK)
                .json({
                    code: StatusCodes.OK,
                    message: getReasonPhrase(StatusCodes.OK),
                    data: result,
                });
    } catch (error) {
        next(error);
    }
};

const updateDemo = async (req, res, next) => {
    try {
        const { id }= req.params;
        const data = req.body;

        await demoService.updateDemo(id, data);

        return res
                .status(StatusCodes.OK)
                .json({
                    code: StatusCodes.OK,
                    message: getReasonPhrase(StatusCodes.OK),
                });
    } catch (error) {
        next(error);
    }
};

const deleteDemo = async (req, res, next) => {
    try {
        const { id }= req.params;

        await demoService.deleteDemo(id);

        return res
                .status(StatusCodes.OK)
                .json({
                    code: StatusCodes.OK,
                    message: getReasonPhrase(StatusCodes.OK),
                });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createDemo,
    createDemosBulk,
    getAllDemos,
    getDemoById,
    updateDemo,
    deleteDemo,
};