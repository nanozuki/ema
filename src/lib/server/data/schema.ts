import { index, integer, primaryKey, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';
import { Department } from '../../domain/value';

export const ceremony = sqliteTable('ceremony', {
  year: integer('year').notNull().primaryKey(),
  departments: text('departments', { mode: 'json' }).$type<Department[]>().notNull(),
  nominationStartAt: integer('nomination_start_at', { mode: 'timestamp_ms' }).notNull(),
  votingStartAt: integer('voting_start_at', { mode: 'timestamp_ms' }).notNull(),
  awardStartAt: integer('award_start_at', { mode: 'timestamp_ms' }).notNull(),
});

export const work = sqliteTable(
  'work',
  {
    id: integer('id').primaryKey(),
    year: integer('year')
      .notNull()
      .references(() => ceremony.year),
    department: text('department').$type<Department>().notNull(),
    name: text('name').notNull(),
    originName: text('origin_name'),
    aliases: text('aliases', { mode: 'json' }).$type<string[]>(),
    ranking: integer('ranking'),
  },
  (table) => {
    return {
      nameIdx: index('work_name_idx').on(table.year, table.department, table.name),
      originNameIdx: index('work_origin_name_idx').on(table.year, table.department, table.originName),
      aliasesIdx: index('work_aliases_idx').on(table.year, table.department, table.aliases),
    };
  },
);

export const voter = sqliteTable('voter', {
  id: integer('id').primaryKey(),
  name: text('name').notNull().unique(),
  passwordHash: text('password_hash'),
});

export const vote = sqliteTable(
  'vote',
  {
    id: integer('id').primaryKey(),
    year: integer('year')
      .notNull()
      .references(() => ceremony.year),
    voterId: integer('voter_id')
      .notNull()
      .references(() => voter.id),
    department: text('department').$type<Department>().notNull(),
  },
  (table) => {
    return {
      voterIdx: index('vote_voter_id_idx').on(table.voterId),
      yearDepartmentVoteIdx: unique('vote_year_department_voter_idx').on(table.year, table.department, table.voterId),
    };
  },
);

export const rankingInVote = sqliteTable(
  'ranking_in_vote',
  {
    voteId: integer('vote_id')
      .notNull()
      .references(() => vote.id),
    workId: integer('work_id')
      .notNull()
      .references(() => work.id),
    ranking: integer('ranking').notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.voteId, table.workId] }),
      workIdIdx: index('ranking_in_vote_work_id_idx').on(table.workId),
    };
  },
);
