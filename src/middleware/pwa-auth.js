import { platformEndpoints } from '../platform-endpoints'
import { platformRequest } from './platform-request'

export default async function (req, res, next) {
  // favor authorization header over cookie
  let bearerToken = req.get('Authorization')
  if (!bearerToken) {
    bearerToken = req.cookies.pwa_jwt

    if (bearerToken) {
      bearerToken = `Bearer ${bearerToken}`
    }
  }

  if (!bearerToken) {
    res.status(401).end()

    return
  }

  res.locals.authHeader = { 'Authorization': bearerToken }

  try {
    await platformRequest.get(platformEndpoints.token)(req, res)

    return next()
  } catch (err) {
    res.status(401).end()
  }
}
