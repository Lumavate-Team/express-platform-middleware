import { Router } from 'express'
import pwaAuth from '../middleware/pwa-auth'
import { platformEndpoints } from '../platform-endpoints'
import { platformRequest } from '../middleware/platform-request'

const router = Router()

router.get('/discover/health', function (req, res, next) {
  res.json('OK')
})

router.use('/instances', pwaAuth)

router.get('/instances/:instanceId/data',
  platformRequest.get(platformEndpoints.data),
  (req, res, next) => {
    res.json(res.locals.platformData)
  }
)

export default router
