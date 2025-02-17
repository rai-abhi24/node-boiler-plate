const { StatusCodes } = require('http-status-codes');
const { AppError } = require('../../../utils');

const DemoRepository = require('../repositories');
const demoRepository = new DemoRepository();

const demoAttributes = [
    'row_id',
    'bike_model',
    'name',
    'sku',
    'hsn',
    'gst',
    'base_selling_price',
    'purchase_price',
    'labour_charge',
    'type',
    'remarks',
];

const NOT_DELETED = { is_deleted: 0 };

const handleError = (error) => {
    if (error instanceof AppError) {
        throw error;
    }

    if (error.code === 'ER_DUP_ENTRY') {
        throw new AppError('Duplicate entry. Spare part already exists.', StatusCodes.BAD_REQUEST);
    }

    throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
};

const createDemo = async (data) => {
    try {
        const demoData = createDemoBody(data);
        return await demoRepository.create(demoData);
    } catch (error) {
        handleError(error);
    }
};

const createDemosBulk = async (data) => {
    try {
        const demoData = data.map((item) => createDemoBody(item));
        return await demoRepository.bulkCreate(demoData);
    } catch (error) {
        handleError(error);
    }
};

const getAllDemos = async () => {
    try {
        return await demoRepository.findAll({ where: NOT_DELETED, attributes: demoAttributes });
    } catch (error) {
        handleError(error);
    }
};

const getDemoById = async (id) => {
    try {
        const demo = await demoRepository.find({
            where: { row_id: id, ...NOT_DELETED },
            attributes: demoAttributes,
        });

        if (!demo) {
            throw new AppError('Spare part not found', StatusCodes.NOT_FOUND);
        }

        return demo;
    } catch (error) {
        handleError(error);
    }
};

const updateDemo = async (id, data) => {
    try {
        const demo = await demoRepository.find({ where: { row_id: id, ...NOT_DELETED } });
        console.log(demo);

        if (!demo) {
            throw new AppError('Spare part not found', StatusCodes.NOT_FOUND);
        }

        return await demoRepository.update(id, data);
    } catch (error) {
        handleError(error);
    }
};

const deleteDemo = async (id) => {
    try {
        const demo = await demoRepository.find({ where: { row_id: id, ...NOT_DELETED } });
        console.log(demo);
        
        if (!demo) {
            throw new AppError('Spare part not found', StatusCodes.NOT_FOUND);
        }

        return await demoRepository.update(id, { is_deleted: 1, deleted_at: new Date() });
    } catch (error) {
        handleError(error);
    }
};

const createDemoBody = (data) => {
    const demoData = {
        bike_model: data.bike_model,
        name: data.name,
        sku: data.sku,
        hsn: data.hsn,
        gst: parseInt(data.gst),
        purchase_price: parseFloat(data.purchase_price),
        base_selling_price: parseFloat(data.base_selling_price),
        labour_charge: parseFloat(data.base_selling_price * 0.15),
        type: data.type || 'GOODS',
        remarks: data.remark || null,
    };

    return demoData;
};

module.exports = {
    createDemo,
    getAllDemos,
    getDemoById,
    updateDemo,
    deleteDemo,
    createDemosBulk,
};
