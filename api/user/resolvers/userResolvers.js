const { GraphQLScalarType } = require('graphql');

const userResolvers = {
    RoleTypes: {
        ESTUDANTE: "ESTUDANTE",
        DOCENTE: "DOCENTE",
        COORDENACAO: "COORDENACAO",
    },
    DateTime: new GraphQLScalarType({
        name: 'DateTime',
        description: 'String in datetime format ISO-8601',
        serialize: (value) => value.toISOString(),
        parseValue: (value) => new Date(value),
        parseLiteral: (ast) => new Date(ast.value),
    }),

    Query: {
        users: (root, args, { dataSources }) => dataSources.usersAPI.getUsers(),
        getUserByID: (root, { id }, { dataSources }) => dataSources.usersAPI.getUserByID( id )
    },
    Mutation: {
        addUser: async (root, { user }, { dataSources }) => dataSources.usersAPI.addUser( user ),
        updUser: async (root, inputData, { dataSources }) => dataSources.usersAPI.updUser( inputData ),
        delUser: async (root, { id }, { dataSources }) => dataSources.usersAPI.delUser( id )
    }
};

module.exports = userResolvers;