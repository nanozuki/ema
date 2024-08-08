import { calculator } from '$lib/server/calculate';
import {
  CeremonyRepositoryImpl,
  VoteRepositoryImpl,
  VoterRepositoryImpl,
  WorkRepositoryImpl,
} from '$lib/server/data/repository';
import { Service } from '$lib/server/service';
import { drizzle } from 'drizzle-orm/d1';

export function getLocalService(platform: App.Platform): Service {
  const dbClient = drizzle(platform.env.EMA_DB, { logger: true });
  const ceremony = new CeremonyRepositoryImpl(dbClient);
  const work = new WorkRepositoryImpl(dbClient);
  const voter = new VoterRepositoryImpl(dbClient);
  const vote = new VoteRepositoryImpl(dbClient);
  return new Service(ceremony, work, voter, vote, calculator);
}
