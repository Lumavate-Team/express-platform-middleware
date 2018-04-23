import axios from 'axios'
import { signUrl } from '@lumavate/request-signer'

const resolveParams = (req, path) => {
  const parts = path.split('/').map((part) => {
    if (part && part.startsWith(':')) {
      const key = part.substring(1)

      if (req.params[key]) {
        return req.params[key]
      }
    }

    return part
  })

  return parts.join('/')
}

const makeSignedRequest = function ({ route, method = 'get', shapeData, payload } = {}) {
  return async (req, res, next) => {
    const resolvedPath = resolveParams(req, route)

    const signedPath = await signUrl({
      method: method,
      path: resolvedPath,
      body: payload
    })

    const config = {
      method: method,
      url: `${process.env.BASE_URL}${signedPath}`,
      headers: res.locals.authHeader
    }

    if (payload) {
      config.data = payload
    }

    const axRes = await axios(config)
    const data = res.locals.platformData = shapeData
      ? shapeData(axRes)
      : axRes.data.payload.data

    if (next) {
      return next()
    }

    return data
  }
}

export const platformRequest = {
  get (route, shapeData) {
    return makeSignedRequest({ route, shapeData })
  },
  post (route, payload, shapeData) {
    const method = 'post'

    return makeSignedRequest({ route, method, shapeData, payload })
  }
}
