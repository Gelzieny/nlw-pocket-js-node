import type { InferInsertModel } from 'drizzle-orm'
import { goalCompletions } from '../../db/schema'
import { db } from '../../db'

export async function makeGoalCompletion(
  overrides: Partial<InferInsertModel<typeof goalCompletions>> &
    Pick<InferInsertModel<typeof goalCompletions>, 'goalId'>
) {
  const [result] = await db
    .insert(goalCompletions)
    .values(overrides)
    .returning()

  return result
}
