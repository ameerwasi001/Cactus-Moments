export const OFFLINE = true
export const baseURL = OFFLINE ? `http://${window.location.host.split(':')[0]}:5000` : 'https://api.cactusmoments.com'
