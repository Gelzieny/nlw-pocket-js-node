import { client, db } from '.'
import { goalCompletions, goals, users } from './schema'
import dayjs from 'dayjs'

async function seed() {
  await db.delete(goalCompletions)
  await db.delete(goals)
  await db.delete(users)

  const [user] = await db.insert(users).values({
    name:"Gelzieny R. Martins",
    externalAccountId: 19843798,
    avatarUrl: "https://github.com/gelzieny.png"
  }).returning()

  const result = await db
    .insert(goals)
    .values([
      { userId: user.id, title: 'Acordar cedo', desiredWeeklyFrequency: 5 },
      { userId: user.id, title: 'Me exercitar', desiredWeeklyFrequency: 3 },
      { userId: user.id, title: 'Meditar', desiredWeeklyFrequency: 1 },
    ])
    .returning()

  const startOfWeek = dayjs().startOf('week')

  await db.insert(goalCompletions).values([
    { goalId: result[0].id, createdAt: startOfWeek.toDate() },
    { goalId: result[1].id, createdAt: startOfWeek.add(1, 'day').toDate() },
  ])
}

seed().finally(() => {
  client.end()
})
