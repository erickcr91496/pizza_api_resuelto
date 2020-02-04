const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
const { db } = require ("./database");
const { makeExecutableSchema} = require ("graphql-tools")
const {importSchema} = require("graphql-import")
const PORT = 3000;
const endPoint = '/pizza_api'
//const schema = null

let server = express();

const typeDefs = importSchema('./schema.graphql')
//const resolvers = {}
import resolvers from './resolvers';
const schema = makeExecutableSchema ({
    typeDefs,
    resolvers
})


server.use(endPoint,bodyParser.json(),graphqlExpress({
    schema
}));

server.use('/graphiql', graphiqlExpress({
    endpointURL : endPoint,
}));

server.listen(PORT,() => {
    console.log('GraphQl Api listen in http://localhost:'+ PORT +endPoint);
    console.log('GraphiQl listen in http://localhost:'+ PORT + '/graphiql');
});

console.log("holaaaaaaaa") 