require('../utils/MongooseUtil');
const Models = require('./Models');

const CustomerDAO = {
	async selectByUsernameOrEmail(username, email) {
		const query = { $or: [{ username: username }, { email: email }] };
		const customer = await Models.Customer.findOne(query);
		return customer;
	},
	async insert(customer) {
		const mongoose = require('mongoose');
		customer._id = new mongoose.Types.ObjectId();
		const result = await Models.Customer.create(customer);
		return result;
	},
    async selectByUsernameAndPassword(username, password) {
        const query = { username: username, password: password };
        const customer = await Models.Customer.findOne(query);
        return customer;
    },
    async selectAll() {
        const query = {};
        const customers = await Models.Customer.find(query).exec();
        return customers;
    },
    async selectByID(_id) {
        const customer = await Models.Customer.findById(_id).exec();
        return customer;
    }
};

module.exports = CustomerDAO;
