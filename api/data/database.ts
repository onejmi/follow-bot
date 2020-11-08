
//further complicate things with per channel
//this needs to be PER SERVER.
export const serverMap: Map<string, Map<string, Array<string>>> = new Map()
export const sessions: Map<string, string> = new Map()

export function follow(serverId: string, fromId: string, toId: string) {
    let followMap = serverMap.get(serverId)
    if(followMap == null) followMap = new Map()
    if(!followMap.has(toId)) {
        followMap.set(toId, [fromId])
        serverMap.set(serverId, followMap)
        return true
    }
    if(followMap.get(toId)?.includes(fromId)) {
        //unfollow
        const currFollowers = followMap.get(toId)
        if(currFollowers !== undefined) {
            followMap.set(toId, currFollowers.filter(id => id !== fromId))
            serverMap.set(serverId, followMap)
        }
        return false
    }

    followMap.get(toId)?.push(fromId)
    serverMap.set(serverId, followMap)
    return true
}