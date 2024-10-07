import jwt from 'jsonwebtoken'
import { eq } from 'drizzle-orm'

export const authenticateToken = async (req, res, next) => {
  if (!process.env.JWT_ACCESS_SECRET) {
    throw new Error('Cannot create token')
  }

  const authHeader = req.headers['authorization']
  const accessToken = authHeader && authHeader.split(' ')[1]
  if (accessToken == null) return res.status(401).json({ message: 'Unauthorized' })

  try {
    const customer = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET)
    req.customer = customer
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  next()
}
