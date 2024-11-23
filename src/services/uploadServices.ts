import http from '@/utils/http'

const PREV_URL = '/uploads'
export const UploadKey = 'uploads'

const UploadServices = {
  uploadSingle: (path: string, file: File) => {
    console.log(file)

    const formData = new FormData()
    formData.append('path', path)
    formData.append('file', file)
    return http.post(PREV_URL + '/single', formData, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
  },

  deleteSingle: (path: string) => {
    return http.delete(PREV_URL + '/single', {
      data: {
        path: path,
      },
    })
  },
}

export default UploadServices
