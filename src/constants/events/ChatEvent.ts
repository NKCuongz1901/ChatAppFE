function createEventName(name: string) {
  return {
    CREATE_GROUP: name + 'group.create',
    ADD_TO_GROUP: name + 'group.add',
    REMOVE_FROM_GROUP: name + 'group.remove',
    OUT_FROM_GROUP: name + 'group.out',
  }
}

const ChatEvent = createEventName('chats:')

export default ChatEvent
