import request from './request'

export function queryOrderPage(data) {
    return request({
      url: '/demo',
      method: 'post',
      data
    })
  }