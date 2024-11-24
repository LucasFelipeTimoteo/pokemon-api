import crypto from 'node:crypto';
import userFixture from '../../../../../src/global/fixtures/user/user.json';
import { pinoLogger } from "../../../../../src/infra/pino/pinoLogger";
import { UsersModel } from "../../../../../src/infra/services/db/mongoose/models/usersModel/usersModelMongoose";
import { MongooseService } from "../../../../../src/infra/services/db/mongoose/mongooseService";
import { usersSchemaMongoose } from '../../../../../src/infra/services/db/mongoose/schema/usersSchemaMongoose';
import { HashPasswordBcrypt } from '../../../../../src/infra/parsers/password/hashing/bcrypt/passwordHasherBcrypt';
import { appEnv } from '../../../../../src/global/utils/env/appEnv/appEnv';

export class MongooseSeeds {
  nonHashedUserPassword: string

  constructor(public defaultUser = userFixture, hashPassword = new HashPasswordBcrypt()) {
    this.nonHashedUserPassword = defaultUser.password
    const salt = hashPassword.genSaltSync(Number(appEnv.salt))
    defaultUser.password = hashPassword.hashSync(defaultUser.password, salt)
  }
  mongooseClient = new MongooseService(pinoLogger, "test_usersService").connect();
  mongooseSchema = usersSchemaMongoose

  async configCollectionAndGetModel() {
    const randomTestCollectionName = "user_" + crypto.randomBytes(5).toString('hex')
    const usersModel = UsersModel(randomTestCollectionName, this.mongooseSchema)
    await usersModel.create(this.defaultUser)

    return usersModel
  }

  async finishDatabase() {
    const client = await this.mongooseClient
    await client.connection.dropDatabase()
    await client.disconnect()
  }
}