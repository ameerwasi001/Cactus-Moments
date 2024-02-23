export const OFFLINE = false
export const baseURL = OFFLINE ? `http://${window.location.host.split(':')[0]}:5000` : 'https://devapi.cactusmoments.com'
