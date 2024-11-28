import { db } from '../../db'
import { goals } from '../../db/schema'
import type { InferInsertModel } from 'drizzle-orm'
import { fakerPT_BR as faker } from '@faker-js/faker'

export async function makeGoal(
  overrides: Partial<InferInsertModel<typeof goals>> &
    Pick<InferInsertModel<typeof goals>, 'userId'>
) {
  const [result] = await db
    .insert(goals)
    .values({
      title: faker.lorem.word(),
      desiredWeeklyFrequency: faker.number.int({ min: 1, max: 7 }),
      ...overrides,
    })
    .returning()

  return result
}
