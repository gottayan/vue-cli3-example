import fetch from '../../tools/axios'

export default {
  getLovebox (userRoleType, sort, category, page, cb) {
    let query = ''
    switch (userRoleType) {
      case 'VIPONLY': query = query + `&memberFilter=VIPONLY`; break
      case 'NOTVIP': query = query + '&normal_only=1'; break
      case 'MINE': query = query + '&my_box=1'; break
      case 'isTraceUser': query = query + '&is_trace_user=1'; break
    }
    const params = query +
      `${sort && `&sort=${sort}`}` +
      `${category && `&need_items_category_id=${category}`}`
    return fetch('get', `/love/provisions?page=${page}${params}`, {}, cb)
  },
  getLoveboxInfo (id, cb) {
    return fetch('get', `/love/provisions/${id}`, {}, cb)
  },
  getLoveboxThanks (id, cb) {
    return fetch('get', `/thanks?love_provision_id=${id}&type=love&perPge=100`, {}, cb)
  },
  getLoveboxOrderItems (id, cb) {
    return fetch('get', `/love/love_order_items?provision_id=${id}&perPge=100`, {}, cb)
  },
  addlovboxItem (id, quantity, cb) {
    const data = {
      provision_id: id,
      quantity
    }
    return fetch('post', '/love/cart/add_item', {data}, cb)
  },
  getLoveCart (cb) {
    return fetch('get', '/love/cart/items', {}, cb)
  },
  updateCount (rowId, quantity, cb) {
    const data = {
      row_id: rowId,
      quantity
    }
    return fetch('post', '/love/cart/update_count', {data}, cb)
  },
  settleLoveCart (consignee, cellphone, address, cb) {
    const data = {
      consignee,
      cellphone,
      address
    }
    return fetch('post', '/love/cart/settlement', {data}, cb)
  },
  getMyShopBoxs (page, cb) {
    return fetch('get', `/love/boxes?perPage=15&page=${page}`, {}, cb)
  },
  getMyLoveCollections (page, cb) {
    return fetch('get', `/love/collections?perPage=15&page=${page}`, {}, cb)
  },
  bookLoveCollections (params, cb) {
    return fetch('post', '/love/collections', {data: params}, cb)
  },
  removeItem (rowId, cb) {
    const data = {
      row_id: rowId
    }
    return fetch('post', '/love/cart/remove_item', {data}, cb)
  },
  contactCompany (data, cb) {
    return fetch('post', '/love/company/form', {data}, cb)
  },
  thanks (id, data, cb) {
    return fetch('post', `/love/love_order_items/${id}/thanks`, {data}, cb)
  },
  getTrackingInfo (sn, type = 'hct') {
    return fetch('get', `/delivery/detail?type=${type}&waybill=${sn}`, {})
  }
}
