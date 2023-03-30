import { baseURL } from './constants'

export const req = async (method, endpoint, body=null, onError=()=>{}) => {
    try {
        const res = await fetch(`${baseURL}${endpoint}`, {
            method, 
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: body ? JSON.stringify(body) : null
        })
        const data = await res.json()
        if(!data.success) onError()
        return data.data
    } catch(err) {
        onError()
        console.log(err)
    }
}

const refresh = async () => {
    const refreshToken = localStorage.getItem('kawan_refreshToken')
    if(!refreshToken) throw 'No Refresh Token Found'
    const data = await req('POST', `/user/refresh/${refreshToken}`, {
        device: {
            id: 'web',
            deviceToken: 'MockToken'
        }
    })
    console.log("Refresh Token", data)
    if(data.refreshToken) localStorage.setItem('kawan_refreshToken', data.refreshToken)
    localStorage.setItem('kawan_accessToken', data.accessToken)
    return data.accessToken
}

export const authReq = async (method, endpoint, body=null, count=0) => {
    try {
        const res = await fetch(`${baseURL}${endpoint}`, {
            method, 
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': localStorage.getItem('kawan_accessToken')
            },
            body: body ? JSON.stringify(body) : undefined
        })
        const data = await res.json()
        // if((data.message == "jwt expired" || data.message == "jwt malformed") && count < 2) {
        //     console.log("Attempting Refresh")
        //     await refresh()
        //     return await authReq(method, endpoint, body, count+1)
        // }
        return data.data
    } catch(err) {
        console.log("Hi!Hi!")
        // if(count < 2) {
        //     console.log("Attempting Refresh")
        //     await refresh()
        //     return await authReq(method, endpoint, body, count+1)
        // }
        console.log(err)
    }
}