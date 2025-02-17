const express = require('express');
const router = express.Router();

const validator = require('../middlewares');
const controller = require('../controllers');

router.route('/').get(
    controller.getAllDemos
);

router.route('/:id').get(
    validator.validateIdParam,
    controller.getDemoById
);

router.route('/').post(
    validator.validateCreate,
    controller.createDemo
);

router.route('/bulk').post(
    validator.validateBulkCreate,
    controller.createDemosBulk
);

router.route('/:id').put(
    validator.validateIdParam,
    validator.validateUpdate, 
    controller.updateDemo
);

router.route('/:id').delete(
    validator.validateIdParam,
    controller.deleteDemo
);

module.exports = router;
