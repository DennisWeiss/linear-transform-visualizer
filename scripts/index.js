
const marginVertical = 20
const marginHorizontal = 20
let scale = 50
// const arrowHeadLength = 10
const coordinateColor = '#aaaaaa'
const axisColor = '#000000'
const iHat = 'red'
const jHat = 'blue'

let parentDivWidth = document.getElementById('coordinate-system-div').offsetWidth
let parentDivHeight = document.getElementById('coordinate-system-div').offsetHeight

const coordinateSystem = document.getElementById('coordinate-system')
const context = coordinateSystem.getContext('2d')

const matrixCanvas = document.getElementById('matrix')
const matrixContext = matrixCanvas.getContext('2d')

const inverseMatrixCanvas = document.getElementById('inverse-matrix')
const inverseMatrixContext = inverseMatrixCanvas.getContext('2d')

let matrix = [[5, 2], [3, 4]]


const updateDimensions = () => {
    parentDivWidth = document.getElementById('coordinate-system-div').offsetWidth
    parentDivHeight = document.getElementById('coordinate-system-div').offsetHeight

    coordinateSystem.width = parentDivWidth - 2 * marginHorizontal
    coordinateSystem.height = parentDivHeight - 2 * marginVertical

    resetCanvas()
    drawCoordinates()
    drawBaseVectors()
    setInfo()
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

    drawTransformedCoordinates()
}

const drawTransformedCoordinates = () => {
    const xScale = Math.floor(coordinateSystem.width / (2 * scale))
    const yScale = Math.floor(coordinateSystem.height / (2 * scale))
    const origin = [Math.floor(coordinateSystem.width / 2), Math.floor(coordinateSystem.height / 2)]

    for (let i = -3 * xScale; i <= 3 * xScale; i++) {
        context.beginPath()
        const posVector = [i, 3 * yScale]
        const negVector = [i, -3 * yScale]
        const transformedPosVector = vectorTransform(matrix, posVector)
        const transformedNegVector = vectorTransform(matrix, negVector)
        context.strokeStyle = '#589EA5'
        context.lineWidth = i === 0 ? 3 : 1
        context.moveTo(origin[0] + scale * transformedPosVector[0], origin[1] + scale * transformedPosVector[1])
        context.lineTo(origin[0] + scale * transformedNegVector[0], origin[1] + scale * transformedNegVector[1])
        context.stroke()
    }

    for (let i = -3 * yScale; i <= 3 * yScale; i++) {
        context.beginPath()
        const posVector = [3 * xScale, i]
        const negVector = [-3 * xScale, i]
        const transformedPosVector = vectorTransform(matrix, posVector)
        const transformedNegVector = vectorTransform(matrix, negVector)
        context.strokeStyle = '#589EA5'
        context.lineWidth = i === 0 ? 3 : 1
        context.moveTo(origin[0] + scale * transformedPosVector[0], origin[1] + scale * transformedPosVector[1])
        context.lineTo(origin[0] + scale * transformedNegVector[0], origin[1] + scale * transformedNegVector[1])
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
    context.lineTo(origin[0] + matrix[0][0] * scale, origin[1] - matrix[0][1] * scale)
    context.stroke()

    //draw j hat
    context.beginPath()
    context.strokeStyle = jHat
    context.lineWidth = 5
    context.moveTo(origin[0], origin[1])
    context.lineTo(origin[0] + matrix[1][0] * scale, origin[1] - matrix[1][1] * scale)
    context.stroke()
}

const resetCanvas = () => {
    context.clearRect(0, 0, coordinateSystem.width, coordinateSystem.height)
    matrixContext.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height)
    inverseMatrixContext.clearRect(0, 0, inverseMatrixCanvas.width, inverseMatrixCanvas.height)
}

const setIHat = event => {
    const origin = [Math.floor(coordinateSystem.width / 2), Math.floor(coordinateSystem.height / 2)]

    const x = (event.offsetX - origin[0]) / scale
    const y = -(event.offsetY - origin[1]) / scale

    matrix = [[x, y], matrix[1]]

    resetCanvas()
    drawCoordinates()
    drawBaseVectors()
    setInfo()
}

const setJHat = event => {
    const origin = [Math.floor(coordinateSystem.width / 2), Math.floor(coordinateSystem.height / 2)]

    const x = (event.offsetX - origin[0]) / scale
    const y = -(event.offsetY - origin[1]) / scale

    matrix = [matrix[0], [x, y]]

    resetCanvas()
    drawCoordinates()
    drawBaseVectors()
    setInfo()
}

const handleCoordinateSystemClick = event => {
    const origin = [Math.floor(coordinateSystem.width / 2), Math.floor(coordinateSystem.height / 2)]
    const x = event.offsetX
    const y = event.offsetY
    const iHat = [origin[0] + matrix[0][0] * scale, origin[1] - matrix[0][1] * scale]
    const jHat = [origin[0] + matrix[1][0] * scale, origin[1] - matrix[1][1] * scale]

    console.log(x, y, iHat, jHat)

    if ((x - iHat[0]) * (x - iHat[0]) + (y - iHat[1]) * (y - iHat[1]) < 8 * 8) {
        coordinateSystem.addEventListener('mousemove', setIHat)
    } else if ((x - jHat[0]) * (x - jHat[0]) + (y - jHat[1]) * (y - jHat[1]) < 8 * 8) {
        coordinateSystem.addEventListener('mousemove', setJHat)
    }
}

const handleCoordinateSystemMousUp = event => {
    coordinateSystem.removeEventListener('mousemove', setIHat)
    coordinateSystem.removeEventListener('mousemove', setJHat)
}

const drawMatrix = (matrixContext, matrix, name) => {
    matrixContext.font = '30px Time New Roman'
    matrixContext.fillText(`${name} =`, 1, 70)

    matrixContext.beginPath()
    matrixContext.moveTo(65, 5)
    matrixContext.lineTo(60, 5)
    matrixContext.lineTo(60, 125)
    matrixContext.lineTo(65, 125)
    matrixContext.strokeStyle = '#000000'
    matrixContext.stroke()

    matrixContext.beginPath()
    matrixContext.moveTo(215, 5)
    matrixContext.lineTo(220, 5)
    matrixContext.lineTo(220, 125)
    matrixContext.lineTo(215, 125)
    matrixContext.strokeStyle = '#000000'
    matrixContext.stroke()

    matrixContext.font = '24px Time New Roman'
    matrixContext.fillText(round(matrix[0][0], 2), 75, 35)
    matrixContext.fillText(round(matrix[0][1], 2), 75, 105)
    matrixContext.fillText(round(matrix[1][0], 2), 155, 35)
    matrixContext.fillText(round(matrix[1][1], 2), 155, 105)
}

const setInfo = () => {
    drawMatrix(matrixContext, matrix, 'A')

    const determinant = matrix[0][0] * matrix[1][1] - matrix[1][0] * matrix[0][1]
    document.getElementById('det-div').innerText = `det(A) = ${round(determinant, 4)}`

    drawMatrix(inverseMatrixContext, matrixInverse(matrix), 'B')
}

const handleZoom = event => {
    scale *= 1 - Math.sign(event.deltaY) / 10
    scale = Math.max(4, scale)
    context.clearRect(0, 0, coordinateSystem.width, coordinateSystem.height)
    drawCoordinates()
    drawBaseVectors()
    drawTransformedCoordinates()
}

const round = (number, digits) => Math.round(Math.pow(10, digits) * number) / Math.pow(10, digits)


coordinateSystem.width = parentDivWidth - 2 * marginHorizontal
coordinateSystem.height = parentDivHeight - 2 * marginVertical

window.addEventListener('resize', updateDimensions)
coordinateSystem.addEventListener('mousedown', handleCoordinateSystemClick)
coordinateSystem.addEventListener('wheel', handleZoom)
window.addEventListener('mouseup', handleCoordinateSystemMousUp)


drawCoordinates()
drawBaseVectors()
setInfo()

