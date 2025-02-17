const { StatusCodes } = require('http-status-codes');
const { AppError } = require('../../utils');
const { db } = require('../../config');

class CrudRepository {
    constructor(table) {
        if (!table) {
            throw new AppError(
                'Table name is required to initialize CrudRepository.',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }

        this.table = table;
        this.db = db.pool;
    }

    async query(query, values) {
        try {
            const [result] = await this.db.query(query, values);
            return result;
        } catch (error) {
            console.error(`Error executing query: ${error.message}`);
            throw new AppError('Failed to execute query.', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async create(data) {
        if (!data || Object.keys(data).length === 0) {
            throw new AppError('Data cannot be empty.', StatusCodes.BAD_REQUEST);
        }

        const fields = Object.keys(data);
        const query = `INSERT INTO ${this.table} (${fields.join(',')}) VALUES (${fields.map(() => '?').join(',')})`;

        try {
            const [result] = await this.db.query(query, Object.values(data));
            return result;
        } catch (error) {
            console.error(`Error creating record: ${error.message}`);

            if (error.code === 'ER_DUP_ENTRY') {
                throw new AppError('Duplicate entry. Record already exists.', StatusCodes.BAD_REQUEST);
            }

            if (error.code === 'ER_BAD_FIELD_ERROR') {
                throw new AppError('Invalid field name.', StatusCodes.BAD_REQUEST);
            }

            throw new AppError('Failed to create record.', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async bulkCreate(data) {
        if (!Array.isArray(data) || data.length === 0) {
            throw new AppError('Data must be a non-empty array.', StatusCodes.BAD_REQUEST);
        }

        const fields = Object.keys(data[0]);
        const query = `INSERT INTO ${this.table} (${fields.join(',')}) VALUES ?`;

        try {
            const [result] = await this.db.query(query, [data.map((item) => Object.values(item))]);
            return result;
        } catch (error) {
            console.error(`Error in bulkCreate: ${error.message}`);

            if (error.code === 'ER_DUP_ENTRY') {
                throw new AppError('Duplicate entry. Record already exists.', StatusCodes.BAD_REQUEST);
            }

            if (error.code === 'ER_BAD_FIELD_ERROR') {
                throw new AppError('Invalid field name.', StatusCodes.BAD_REQUEST);
            }

            throw new AppError('Failed to create multiple records.', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async findByPK(id, options = {}) {
        if (!id) {
            throw new AppError('Primary key (row_id) is required.', StatusCodes.BAD_REQUEST);
        }

        const { attributes = [] } = options;
        const query = `SELECT ${attributes.length > 0 ? attributes.join(',') : '*'} FROM ${this.table} WHERE row_id = ?`;

        try {
            const [result] = await this.db.query(query, [id]);
            return result?.[0] || null;
        } catch (error) {
            console.error(`Error finding record by PK: ${error.message}`);
            throw new AppError('Failed to find record.', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async find(options = {}) {
        const { attributes = [], where = {} } = options;

        const whereValues = Object.values(where);
        const whereClause = Object.keys(where)
            .map((key) => `${key} = ?`)
            .join(' AND ');

        let query = `SELECT ${attributes.length > 0 ? attributes.join(',') : '*'} FROM ${this.table}`;
        if (whereClause) {
            query += ` WHERE ${whereClause}`;
        }

        try {
            const [result] = await this.db.query(query, whereValues);
            return result?.[0] || null;
        } catch (error) {
            console.error(`Error finding record: ${error.message}`);
            throw new AppError('Failed to find record.', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async findAll(options = {}) {
        const { attributes = [], where = {}, limit, offset } = options;

        const whereValues = Object.values(where);
        const whereClause = Object.keys(where)
            .map((key) => `${key} = ?`)
            .join(' AND ');

        let query = `SELECT ${attributes.length > 0 ? attributes.join(',') : '*'} FROM ${this.table}`;
        if (whereClause) {
            query += ` WHERE ${whereClause}`;
        }
        if (limit) {
            query += ` LIMIT ${limit}`;
        }
        if (offset) {
            query += ` OFFSET ${offset}`;
        }

        try {
            const [result] = await this.db.query(query, whereValues);
            return result;
        } catch (error) {
            console.error(`Error finding records: ${error.message}`);
            throw new AppError('Failed to retrieve records.', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async findInTable(tableName, options = {}) {
        const { attributes = [], where = {}, limit, offset } = options;

        const whereValues = Object.values(where);
        const whereClause = Object.keys(where)
            .map((key) => `${key} = ?`)
            .join(' AND ');

        let query = `SELECT ${attributes.length > 0 ? attributes.join(',') : '*'} FROM ${tableName}`;
        if (whereClause) {
            query += ` WHERE ${whereClause}`;
        }
        if (limit) {
            query += ` LIMIT ${limit}`;
        }
        if (offset) {
            query += ` OFFSET ${offset}`;
        }

        try {
            const [result] = await this.db.query(query, whereValues);
            return result;
        } catch (error) {
            console.error(`Error finding records: ${error.message}`);
            throw new AppError('Failed to retrieve records.', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async update(id, data) {
        if (!id) {
            throw new AppError('Primary key (id) is required.', StatusCodes.BAD_REQUEST);
        }
        if (!data || Object.keys(data).length === 0) {
            throw new AppError('Data to update cannot be empty.', StatusCodes.BAD_REQUEST);
        }

        const fields = Object.keys(data)
            .map((key) => `${key} = ?`)
            .join(',');

        const query = `UPDATE ${this.table} SET ${fields} WHERE row_id = ?`;

        try {
            const [result] = await this.db.query(query, [...Object.values(data), id]);
            return result;
        } catch (error) {
            console.error(`Error updating record: ${error.message}`);
            throw new AppError('Failed to update record.', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async destroy(id) {
        if (!id) {
            throw new AppError('Primary key (id) is required.', StatusCodes.BAD_REQUEST);
        }

        const query = `DELETE FROM ${this.table} WHERE row_id = ?`;

        try {
            const [result] = await this.db.query(query, [id]);
            return result;
        } catch (error) {
            console.error(`Error deleting record: ${error.message}`);
            throw new AppError('Failed to delete record.', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = CrudRepository;
