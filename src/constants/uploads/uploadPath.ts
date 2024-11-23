function createEventName(name: string) {
  return {
    AUTH: name + 'auth',
    MESSAGE_FILE: name + 'message_file',
    MESSAGE_IMAGE: name + 'message_image',
  }
}

const PathUploadFile = createEventName('/')

export default PathUploadFile
