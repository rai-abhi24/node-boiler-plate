const express = require('express');
const router = express.Router();

router.use('/demo', require('../../features/demo-feature/routes'));

module.exports = router;
