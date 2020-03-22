const { href } = window.location
if (href.indexOf('give543.com') !== -1) {
  module.exports = {
    server: '//api.give543.com',
    reqlApi: '/api',
    facebookAppID: '281409512031484',
    googleClientID: '102978352106-mipjlpsqq3rvd4068c8ncpbfc60kj0tg.apps.googleusercontent.com',
    host: '//api.give543.com/',
    frontEndUrl: '//www.give543.com/',
    queryShipFami: 'http://www.famiport.com.tw/distribution_search.asp?page=4'
  }
} else {
  module.exports = {
    server: 'https://give543-api.shengxintech.com',
    reqlApi: '/api',
    facebookAppID: '281409512031484',
    googleClientID: '102978352106-mipjlpsqq3rvd4068c8ncpbfc60kj0tg.apps.googleusercontent.com',
    frontEndUrl: '//give543.shengxintech.com/',
    host: 'http://give543.shengxintech.com',
    queryShipFami: 'http://www.famiport.com.tw/distribution_search.asp?page=4'
  }
}
