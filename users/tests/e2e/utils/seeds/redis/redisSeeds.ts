import { Aes256Cbc } from "../../../../../src/application/crypto/simetric/aes/aes256Cbc/aes256cbc";
import { logger } from "../../../../../src/application/logger/logger";
import { Pokemon } from "../../../../../src/domain/entities/pokemon/types/pokemon";
import { appEnv } from "../../../../../src/global/utils/env/appEnv/appEnv";
import { getRedisClient } from "../../../../../src/infra/services/db/redis/redisService";
import { CustomRedisClient } from "../../../../../src/infra/services/db/redis/types/RedisClientTypes";

export class RedisSeeds {
  redisClientPromise: Promise<CustomRedisClient>
  redisRefreshToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzNiOWYxNGM2NTUxMTM5ZGJhMmY0MzMiLCJpYXQiOjE3MzIyMDQ3MzQsImV4cCI6MTc0Nzc1NjczNH0.uP2GjnU66H-AE6TrNQhOZGMia__00cB5n-F-v64OKMc"

  constructor(private logger: logger, private userId: string, public pokemons: Pokemon[]) {
    this.redisClientPromise = getRedisClient(logger)
  }
  async exec() {
    const redis = await this.redisClientPromise
    await redis.SELECT(Number(appEnv.redisTestDatabase))
    await this.clearDatabase()
    await redis.SET(`${appEnv.redisUserPokemonsListKey}:${this.userId}`, JSON.stringify(this.pokemons))
    const aes256Cbc = new Aes256Cbc(appEnv.refreshTokenAESSecret)
    const encryptedRefreshToken = aes256Cbc.encryptData(this.redisRefreshToken)
    await redis.SET(`${appEnv.redisUserRefreshTokenKey}:${this.userId}`, encryptedRefreshToken)
  }

  async clearDatabase() {
    const redis = await this.redisClientPromise
    await redis.FLUSHDB()
  }

  async finishDatabase() {
    const redis = await this.redisClientPromise
    await redis.SELECT(Number(appEnv.redisTestDatabase))
    await this.clearDatabase()
    await redis.disconnect()
    this.logger.debug("Redis database disconnected")
  }
}