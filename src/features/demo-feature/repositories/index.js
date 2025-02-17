const { TABLES } = require('../../../constants/enums');
const { CrudRepository } = require('../../../common/repositories');

class DemoRepository extends CrudRepository {
    constructor() {
        super(TABLES.DEMO);
    }
}

module.exports = DemoRepository;
