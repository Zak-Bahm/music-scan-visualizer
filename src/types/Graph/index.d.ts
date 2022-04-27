interface Loc {
    x: number,
    y: number,
    xDev: number,
    yDev: number
}
interface DataPoint {
    location: Loc,
    genre: {
        id: number,
        name: string
    },
    info: {
        artist: string,
        title: string,
        file: string
    }
}
interface Tooltip {
    songTitle: string,
    genreName: string,
    artistName: string
}

export { Loc, DataPoint, Tooltip }
