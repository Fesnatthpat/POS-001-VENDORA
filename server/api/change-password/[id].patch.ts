import { defineEventHandler, readBody, createError, getHeader } from 'h3'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const body = await readBody(event)
  const { password } = body
  const authHeader = getHeader(event, 'Authorization')

  // 1. Check Admin Token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Missing or invalid token',
    })
  }

  // Note: In a real app, we would verify the token and check if the user is an Admin.
  // For now, we assume the token is valid if present, as specified in the requirements.
  // If we had a database or a way to verify the token, we would do it here.

  // 2. Validate Password Length
  if (!password || password.length < 6) {
    throw createError({
      statusCode: 400,
      statusMessage: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร',
    })
  }

  // 3. Perform Password Update
  // Since we are using an external API for the rest of the app, 
  // we might want to proxy this or update a local database.
  // Given the instruction, we will mock the success response for now,
  // or if there was a real database, we would update it here.
  
  console.log(`Updating password for staff ID: ${id}`)

  return {
    success: true,
    message: 'เปลี่ยนรหัสผ่านสำเร็จ',
    data: {
      id,
      updatedAt: new Date().toISOString()
    }
  }
})
