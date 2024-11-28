import type { InferSelectModel } from 'drizzle-orm'
import { goalCompletions } from '../../src/db/schema'
import { db } from '../../src/db'

export async function makeGoalCompletion(
  override: Partial<InferSelectModel<typeof goalCompletions>> &
    Pick<InferSelectModel<typeof goalCompletions>, 'goalId'>
) {
  const [row] = await db.insert(goalCompletions).values(override).returning()

  return row
}
