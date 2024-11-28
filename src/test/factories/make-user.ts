import { fakerPT_BR as faker } from '@faker-js/faker'
import type { InferInsertModel } from 'drizzle-orm'
import { users } from '../../db/schema'
import { db } from '../../db'

export async function makeUser(
  overrides: Partial<InferInsertModel<typeof users>> = {}
) {
  const [result] = await db
    .insert(users)
    .values({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      externalAccountId: faker.number.int({ min: 0, max: 1_000_000 }),
      avatarUrl: faker.image.avatarGitHub(),
      ...overrides,
    })
    .returning()

  return result
}
