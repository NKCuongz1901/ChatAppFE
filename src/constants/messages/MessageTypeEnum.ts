enum MessageTypeEnum {
  TEXT = 0,
  IMAGE = 1,
  FILE = 2,
  EMOJI = 3,
}

// Mở rộng enum với namespace để thêm phương thức
namespace MessageTypeEnum {
  // Phương thức trả về tất cả tên
  export function allNames(): { [key: number]: string } {
    return {
      [MessageTypeEnum.TEXT]: 'tin nhắn',
      [MessageTypeEnum.IMAGE]: 'ảnh',
      [MessageTypeEnum.FILE]: 'tệp tin',
      [MessageTypeEnum.EMOJI]: 'nhãn dán',
    }
  }

  // Phương thức lấy tên dựa trên giá trị enum
  export function getNameByValue(value: MessageTypeEnum): string {
    const names = allNames()
    return names[value]
  }
}

export default MessageTypeEnum
