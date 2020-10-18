
//further complicate things with per channel
//this needs to be PER SERVER.
export const followMap: Map<string, Array<string>> = new Map()

export function follow(fromId: string, toId: string) {
    // followMap[toId].push(fromId)
    if(!followMap.has(toId)) {
        followMap.set(toId, [fromId])
        return true
    }
    if(followMap.get(toId)?.includes(fromId)) {
        //unfollow
        const currFollowers = followMap.get(toId)
        if(currFollowers !== undefined) {
            followMap.set(toId, currFollowers.filter(id => id !== fromId))
        }
        return false
    }

    followMap.get(toId)?.push(fromId)
    return true
}