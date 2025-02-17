const Joi = require('joi');

const demoFields = {
    bike_model: Joi.string(),
    name: Joi.string(),
    sku: Joi.string(),
    base_selling_price: Joi.number().min(0),
    purchase_price: Joi.number().min(0),
    labour_charge: Joi.number().min(0),
    hsn: Joi.string(),
    gst: Joi.number().min(0).max(100),
    type: Joi.string(),
    remarks: Joi.string().optional(),
};

const demoCreateSchema = Joi.object({
    ...demoFields,
    bike_model: demoFields.bike_model.required(),
    name: demoFields.name.required(),
    sku: demoFields.sku.required(),
    base_selling_price: demoFields.base_selling_price.required(),
    purchase_price: demoFields.purchase_price.required(),
    hsn: demoFields.hsn.required(),
    gst: demoFields.gst.required(),
    type: demoFields.type.required(),
});

const demoUpdateSchema = Joi.object(demoFields).or(
    'bike_model',
    'name',
    'sku',
    'base_selling_price',
    'purchase_price',
    'labour_charge',
    'hsn',
    'gst',
    'type',
    'remarks'
);

const demoBulkCreateSchema = Joi.array().items(demoCreateSchema);

const demoIdParamSchema = Joi.object({
    id: Joi.number().required(),
});

module.exports = {
    demoBulkCreateSchema,
    demoCreateSchema,
    demoUpdateSchema,
    demoIdParamSchema,
};
