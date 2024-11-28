import { env } from '../env'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import fastifyJwt from '@fastify/jwt'
import fastifyCors from '@fastify/cors'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { createGoalRoute } from './routes/create-goal'
import { getWeekSummaryRoute } from './routes/get-week-summary'
import { getPendingGoalsRoute } from './routes/get-pending-goals'
import { createCompletionRoute } from './routes/create-completion'
import { authenticateFromGithubRoute } from './routes/authenticate-from-github'
import { getProfileRoute } from './routes/get-profile'
import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: '*',
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'in.orbit',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(createGoalRoute)
app.register(getProfileRoute)
app.register(getWeekSummaryRoute)
app.register(getPendingGoalsRoute)
app.register(createCompletionRoute)
app.register(authenticateFromGithubRoute)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server running!')
  })

if (env.NODE_ENV === 'development') {
  const spec = './swagger.json'
  const specFile = resolve(__dirname, '../..', spec)

  app.ready(() => {
    const apiSpec = JSON.stringify(app.swagger() || {}, null, 2)

    writeFile(specFile, apiSpec).then(() => {
      console.log(`Swagger specification file write to ${spec}`)
    })
  })
}
