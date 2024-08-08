import { Err } from '$lib/domain/errors';
import { Department, Stage } from '$lib/domain/value';
import { redirect } from '@sveltejs/kit';

// Ceremony store the ceremony information of a year
export interface Ceremony {
  year: number;
  departments: Department[];
  nominationStartAt: Date;
  votingStartAt: Date;
  awardStartAt: Date;
}

export function getStage(c: Ceremony, time: Date): Stage {
  if (time < c.nominationStartAt) {
    return Stage.Preparation;
  } else if (time < c.votingStartAt) {
    return Stage.Nomination;
  } else if (time < c.awardStartAt) {
    return Stage.Voting;
  } else {
    return Stage.Award;
  }
}

export function ensureStage(ceremony: Ceremony, stage: Stage, now: Date): void {
  const stageNow = getStage(ceremony, now);
  if (stageNow === stage) {
    // valid, do nothing
    return;
  }
  switch (stageNow) {
    case Stage.Nomination:
      return redirect(302, `/${ceremony.year}/nominations/${ceremony.departments[0]}`);
    case Stage.Voting:
      return redirect(302, `/${ceremony.year}/votes/${ceremony.departments[0]}`);
    case Stage.Award:
      return redirect(302, `/${ceremony.year}/awards`);
    default:
      return redirect(302, `/`);
  }
}

const timeFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Asia/Shanghai',
});

const formatTime = (d: Date): string => {
  return timeFormatter.format(d).replaceAll('/', '-');
};

export const dataString = (date: Date): string => `北京时间 ${formatTime(date)}`;

export const dataRangeString = (start: Date, end: Date): string =>
  `北京时间 ${formatTime(start)} 至 ${formatTime(end)}`;

const awardHighlightDuration = 1000 * 60 * 60 * 24 * 30; // 30 days

export function isCeremonyActive(c: Ceremony, time: Date): boolean {
  return time.getTime() - c.awardStartAt.getTime() < awardHighlightDuration;
}

export function parseDepartment(c: Ceremony, dept: string): Department {
  if (!c.departments.includes(dept as Department)) {
    throw Err.NotFound('department', dept);
  }
  return dept as Department;
}

export interface Work {
  id: number;
  year: number;
  department: Department;
  name: string;
  originName: string;
  aliases: string[];
  ranking?: number;
}

export function subNamesOfWork(w: Work): string[] {
  const subNames: string[] = [];
  if (w.originName !== w.name) {
    subNames.push(w.originName);
  }
  for (const alias of w.aliases) {
    subNames.push(alias);
  }
  return subNames;
}

export interface AwardRank {
  ranking: number;
  works: Work[];
}

export function newAwardRank(sortedWorks: Work[]): AwardRank[] {
  const rw: AwardRank[] = [];
  const addWork = (work: Work) => {
    for (const r of rw) {
      if (r.ranking == work.ranking) {
        r.works.push(work);
        return;
      }
    }
    if (work.ranking) {
      rw.push({ ranking: work.ranking, works: [work] });
    }
  };
  for (const work of sortedWorks) {
    addWork(work);
  }
  return rw;
}

export interface Voter {
  id: number;
  name: string;
  hasPassword: boolean;
}

// hashPassword hashes the password with salt and returns 16-bit string
export async function hashPassword(password: string, salt: string): Promise<string> {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + password));
  const bytes = new Uint8Array(hash);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// verifyPassword verifies the password with salt and hash
export async function verifyPassword(password: string, salt: string, hash: string): Promise<boolean> {
  return hash === (await hashPassword(password, salt));
}

export interface Vote {
  id: number;
  year: number;
  voterId: number;
  department: Department;
  rankings: Work[];
}
