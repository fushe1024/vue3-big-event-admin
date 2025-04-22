import axios from 'axios'

// 将图片 URL 转换为 File 对象
export const convertUrlToFile = async (imageUrl) => {
    // 发送 GET 请求获取图片数据
    const response = await axios.get(imageUrl, {
      responseType: 'blob',
    })

    // 从响应中获取 Blob 对象
    const blob = response.data

    // 从 URL 中提取文件名
    const fileName = imageUrl.split('/').pop()

    // 创建 File 对象
    return new File([blob], fileName, {
      type: blob.type,
    })
}
