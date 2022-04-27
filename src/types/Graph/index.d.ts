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

export { Loc, DataPoint }
