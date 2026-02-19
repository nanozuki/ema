import type { Work } from '$lib/domain/entity';
import { Err } from '$lib/domain/errors';
import { Department } from '$lib/domain/value';
import { z } from 'zod';

enum BangumiEnum {
  Book = 1,
  Anime = 2,
  Music = 3,
  Game = 4,
  Real = 6,
}

type SearchSubjectsRequest = {
  keyword: string;
  filter?: {
    type?: BangumiSubjectType[];
  };
};

const bangumiSubjectTypeSchema = z.enum(BangumiEnum);
type BangumiSubjectType = z.infer<typeof bangumiSubjectTypeSchema>;
function mapDepartmentToBangumiSubjectType(department: Department): BangumiSubjectType {
  switch (department) {
    case Department.Anime:
    case Department.TVAnime:
    case Department.NonTVAnime:
      return BangumiEnum.Anime;
    case Department.Manga:
    case Department.Novel:
    case Department.MangaAndNovel:
      return BangumiEnum.Book;
    case Department.Game:
      return BangumiEnum.Game;
    case Department.Music:
      return BangumiEnum.Music;
    default:
      throw new Error(`Unsupported department: ${department}`);
  }
}

const subjectSchema = z.looseObject({
  date: z.string().nullish(),
  platform: z.string().nullish(),
  images: z
    .looseObject({
      small: z.string().nullish(),
      grid: z.string().nullish(),
      large: z.string().nullish(),
      medium: z.string().nullish(),
      common: z.string().nullish(),
    })
    .nullish(),
  image: z.string().nullish(),
  name: z.string(),
  name_cn: z.string(),
  infobox: z.array(
    z.looseObject({
      key: z.string(),
      value: z.string().or(
        z.array(
          z.looseObject({
            v: z.string(),
          }),
        ),
      ),
    }),
  ),
  id: z.number(),
  total_episodes: z.number().nullish(),
  meta_tags: z.array(z.string()).nullish(),
  type: bangumiSubjectTypeSchema,
});

type Subject = z.infer<typeof subjectSchema>;

const searchSubjectsResponseSchema = z.object({
  data: z.array(subjectSchema),
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
});

type SearchSubjectsResponse = z.infer<typeof searchSubjectsResponseSchema>;

const apiUrl = 'https://api.bgm.tv/v0/search/subjects';
const userAgent = 'nanozuki/ema (https://github.com/nanozuki/ema)';

async function callSearchSubjects(
  request: SearchSubjectsRequest,
  limit = 5,
  offset = 0,
): Promise<SearchSubjectsResponse> {
  const url = new URL(apiUrl);
  url.searchParams.set('limit', limit.toString());
  url.searchParams.set('offset', offset.toString());
  return await Err.catch(
    async () => {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'User-Agent': userAgent,
        },
        body: JSON.stringify(request),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Bangumi search failed (${res.status}): ${text}`);
      }
      const responseJson = await res.json();
      const result = searchSubjectsResponseSchema.safeParse(responseJson);
      if (!result.success) {
        console.error('Failed to parse search subject response', {
          keyword: request.keyword,
          responseJson,
          error: result.error,
        });
        throw Err.Internal(`call bangumi api, searchSubjects(${request.keyword}), parse response failed`, result.error);
      }
      return result.data;
    },
    (err) => Err.Internal('search bangumi subjects', err),
  );
}

async function callGetSubject(id: number): Promise<Subject> {
  const url = `https://api.bgm.tv/v0/subjects/${id}`;
  console.log('callGetSubject', { id, url });
  return await Err.catch(
    async () => {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'User-Agent': userAgent,
        },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Bangumi get subject failed (${res.status}): ${text}`);
      }
      const responseJson = await res.json();
      const result = subjectSchema.safeParse(responseJson);
      if (!result.success) {
        console.error('Failed to parse bangumi subject response', { id, responseJson, error: result.error });
        throw Err.Internal(`call bangumi api, getSubject(${id}), parse response failed`, result.error);
      }
      return result.data;
    },
    (err) => Err.Internal('get bangumi subject', err),
  );
}

export type BangumiSubject = Omit<Work, 'id' | 'year' | 'department'> & {
  bangumiId: number;
  tags: string[];
  date?: string;
  image?: string;
};

function convertSubjectToBangumiSubject(item: Subject): BangumiSubject {
  const tagSet = new Set<string>();
  if (item.platform) {
    tagSet.add(item.platform);
  }
  if (item.total_episodes && item.total_episodes > 1) {
    tagSet.add(`${item.total_episodes}话`);
  }
  if (item.meta_tags) {
    item.meta_tags.forEach((tag) => tagSet.add(tag));
  }
  return {
    bangumiId: item.id,
    name: item.name_cn,
    originName: item.name,
    aliases: item.infobox
      .filter((info) => info.key === '别名')
      .flatMap((info) => (typeof info.value === 'string' ? [info.value] : info.value.map((item) => item.v)))
      .filter((alias) => alias !== item.name_cn && alias !== item.name),
    tags: Array.from(tagSet),
    date: item.date ?? undefined,
    image: item.image ?? item.images?.medium ?? undefined,
  };
}

export async function searchBangumiSubjects(keyword: string, department: Department): Promise<BangumiSubject[]> {
  const bgmType = mapDepartmentToBangumiSubjectType(department);
  const request: SearchSubjectsRequest = {
    keyword,
    filter: {
      type: [bgmType],
    },
  };
  const response = await callSearchSubjects(request, 7);
  return response.data.map(convertSubjectToBangumiSubject);
}

export async function getBangumiSubject(id: number): Promise<BangumiSubject> {
  const item = await callGetSubject(id);
  return convertSubjectToBangumiSubject(item);
}
