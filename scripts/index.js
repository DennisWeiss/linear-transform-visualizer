const marginVertical = 20
const marginHorizontal = 20
const scale = 50
// const arrowHeadLength = 10
const coordinateColor = '#aaaaaa'
const axisColor = '#000000'
const iHat = 'red'
const jHat = 'blue'

let windowWidth = window.innerWidth
let windowHeight = window.innerHeight

const coordinateSystem = document.getElementById('coordinate-system')
const context = coordinateSystem.getContext('2d')

let matrix = [[-3, 4], [3, -1]]

const updateDimensions = () => {
    windowWidth = window.innerWidth
    windowHeight = window.innerHeight

    coordinateSystem.width = window.innerWidth - 2 * marginHorizontal
    coordinateSystem.height = window.innerHeight - 2 * marginVertical

    drawCoordinates()
    drawBaseVectors()
}

const drawCoordinates = () => {
    let xScale = Math.floor(coordinateSystem.width / (2 * scale))
    for (let i = -xScale; i <= xScale; i++) {
        context.beginPath()
        let xPosition = Math.floor(coordinateSystem.width / 2 + scale * i)
        context.strokeStyle = i === 0 ? axisColor : coordinateColor
        context.lineWidth = i === 0 ? 3 : 1
        context.moveTo(xPosition, 0)
        context.lineTo(xPosition, coordinateSystem.height)
        context.stroke()
    }

    let yScale = Math.floor(coordinateSystem.height / (2 * scale))
    for (let i = -yScale; i <= yScale; i++) {
        context.beginPath()
        let yPosition = Math.floor(coordinateSystem.height / 2 + scale * i)
        context.strokeStyle = i === 0 ? axisColor : coordinateColor
        context.lineWidth = i === 0 ? 3 : 1
        context.moveTo(0, yPosition)
        context.lineTo(coordinateSystem.width, yPosition)
        context.stroke()
    }
}

const drawBaseVectors = () => {
    const origin = [Math.floor(coordinateSystem.width / 2), Math.floor(coordinateSystem.height / 2)]

    //draw i hat
    context.beginPath()
    context.strokeStyle = iHat
    context.lineWidth = 5
    context.moveTo(origin[0], origin[1])
    context.lineTo(origin[0] + matrix[0][0] * scale, origin[1] + matrix[0][1] * scale)
    // context.lineTo(arrowHeadLength * (-2 * matrix[0][0] / Math.sqrt(5) + -matrix[0][1] / Math.sqrt(5)) + origin[0] + matrix[0][0] * scale,
    //     arrowHeadLength * (matrix[0][0] / Math.sqrt(5) + -2 * matrix[0][1] /Math.sqrt(5)) + origin[1] + matrix[0][1] * scale)
    context.lineTo(origin[0] + matrix[0][0] * scale, origin[1] + matrix[0][1] * scale)
    // context.lineTo(arrowHeadLength * (-2 * matrix[0][0] / Math.sqrt(5) + matrix[0][1] / Math.sqrt(5)) + origin[0] + matrix[0][0] * scale,
    //     arrowHeadLength * (-matrix[0][0] / Math.sqrt(5) + -2 * matrix[0][1] /Math.sqrt(5)) + origin[1] + matrix[0][1] * scale)
    context.stroke()

    //draw j hat
    context.beginPath()
    context.strokeStyle = jHat
    context.lineWidth = 5
    context.moveTo(origin[0], origin[1])
    context.lineTo(origin[0] + matrix[1][0] * scale, origin[1] - matrix[1][1] * scale)
    context.stroke()
}

const setIHat = event => {
    console.log('event')
    const origin = [Math.floor(coordinateSystem.width / 2), Math.floor(coordinateSystem.height / 2)]

    const x = (event.offsetX - origin[0]) / scale
    const y = (event.offsetY - origin[1]) / scale

    matrix = [[x, y], matrix[1]]
    drawBaseVectors()
}

const handleCoordinateSystemClick = event => {
    const origin = [Math.floor(coordinateSystem.width / 2), Math.floor(coordinateSystem.height / 2)]
    const x = event.offsetX
    const y = event.offsetY
    const iHat = [origin[0] + matrix[0][0] * scale, origin[1] + matrix[0][1] * scale]
    const jHat = [origin[0] + matrix[0][0] * scale, origin[1] + matrix[0][1] * scale]

    console.log(x, y, iHat)

    if ((x - iHat[0]) * (x - iHat[0]) + (y - iHat[1]) * (y - iHat[1]) < scale * scale * 0.3 * 0.3) {
        console.log('yes')
        coordinateSystem.addEventListener('mousemove', setIHat)
    }
}

const handleCoordinateSystemMousUp = event => {
    coordinateSystem.removeEventListener('mousemove', setIHat)
}


coordinateSystem.width = window.innerWidth - 2 * marginHorizontal
coordinateSystem.height = window.innerHeight - 2 * marginVertical

window.addEventListener('resize', updateDimensions)
coordinateSystem.addEventListener('mousedown', handleCoordinateSystemClick)
coordinateSystem.addEventListener('mouseup', handleCoordinateSystemMousUp)


drawCoordinates()
drawBaseVectors()

