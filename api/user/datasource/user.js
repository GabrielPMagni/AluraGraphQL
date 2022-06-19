const { RESTDataSource } = require('apollo-datasource-rest');

class UsersAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'http://localhost:3000';
        this.customResponse = {
            code: 200,
            message: 'OK'
        }
    }

    async getUsers() {
        const users = await this.get('/users');
        this.customResponse.code = 200;
        this.customResponse.message = 'Fetch successfully';
        return {
            ...this.customResponse,
            users: users.map(async user => ({
                id: user.id,
                nome: user.nome,
                email: user.email,
                ativo: user.ativo,
                role: await this.get(`/roles/${user.role}`)
            }))
        };
    }

    async getUserByID(id) {
        const user = await this.get(`/users/${id}`);
        user.role = await this.get(`/roles/${user.role}`)
        this.customResponse.code = 200;
        this.customResponse.message = 'Fetch successfully';
        return ({
            ...this.customResponse,
            user: {
                user
            }
        });
    }

    async addUser(user) {
        const users = await this.get('/users');
        user.id = users.length + 1;
        const role = await this.get(`roles?type=${user.role}`);
        await this.post('users', { ...user, role: role[0].id });
        this.customResponse.code = 201;
        this.customResponse.message = 'Created successfully';
        return ({
            ...this.customResponse,
            user: {
                ...user,
                role: role[0]
            }
        })
    }

    async updUser(inputData) {
        const role = await this.get(`roles?type=${inputData.user.role}`);
        this.customResponse.code = 200;
        this.customResponse.message = 'Updated successfully';
        const userEdit = {
            ...this.customResponse,
            user: {
                ...inputData.user,
                role: role[0]
             }
        };
        await this.put(`/users/${inputData.id}`, { ...userEdit, role: role[0].id });
        return userEdit;
    }

    async delUser(id) {
        await this.delete(`/users/${id}`);
        this.customResponse.code = 204;
        this.customResponse.message = 'Deleted successfully';
        return { ...this.customResponse };

    }
}

module.exports = UsersAPI;