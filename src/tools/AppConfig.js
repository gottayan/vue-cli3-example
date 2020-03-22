// const domainOld = 'old.give543.com';
const domainStage = 'api.give543.com'
const devServer = 'give543-api.shengxintech.com'
export const domain = /m\.give543\.com/.test(window.location.href) ? domainStage : devServer
