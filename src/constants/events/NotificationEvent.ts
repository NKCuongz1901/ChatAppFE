function createEventName(name: string) {
  return {
    NEW: name + 'new',
  }
}

const NotificationEvent = createEventName('notifications:')

export default NotificationEvent
