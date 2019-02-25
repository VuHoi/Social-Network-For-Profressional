import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { createConnection } from 'typeorm';
import { GraphQL } from './graphql';
import { GraphQLSchema } from 'graphql';
import { formatArgumentValidationError } from 'type-graphql';
import { databaseInitializer } from './initializers/database';

class App {
	public app: express.Application;
	public apolloServer: ApolloServer;

	constructor() {
		this.app = express();
		this.configGraphql().catch((err: Error) =>
			// tslint:disable-next-line
			console.log(`Cannot create Apollo Server ${err.message}`)
		);
		databaseInitializer();
		
	}

	private configGraphql = async (): Promise<void> => {
		const schema: GraphQLSchema = await new GraphQL().createSchema();
		this.apolloServer = new ApolloServer({
			schema,
			formatError: formatArgumentValidationError
		});
		this.apolloServer.applyMiddleware({ app: this.app });
	};
}

export default new App().app;
