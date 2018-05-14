let i = 0

const nextId = () => {
    i += 1
    return `${Date.now()}_${i}`
}

export default nextId
