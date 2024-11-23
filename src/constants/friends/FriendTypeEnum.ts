enum FriendTypeEnum {
  REQUEST = 0,
  CONNECT = 1,
}

// Mở rộng enum với namespace để thêm phương thức
namespace FriendTypeEnum {
  // Phương thức trả về tất cả tên
  export function allNames(): { [key: number]: string } {
    return {
      [FriendTypeEnum.REQUEST]: 'yêu cầu',
      [FriendTypeEnum.CONNECT]: 'bạn bè',
    }
  }

  // Phương thức lấy tên dựa trên giá trị enum
  export function getNameByValue(value: FriendTypeEnum): string {
    const names = allNames()
    return names[value]
  }
}

export default FriendTypeEnum
