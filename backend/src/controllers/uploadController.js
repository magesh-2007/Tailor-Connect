import { sendSuccess, sendError } from '../utils/response.js'

export const uploadFile = (req, res) => {
  if (!req.file) {
    return sendError(res, 'No file uploaded or invalid file format.', 400)
  }

  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`

  return sendSuccess(
    res,
    'File uploaded successfully.',
    {
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    },
    201
  )
}
