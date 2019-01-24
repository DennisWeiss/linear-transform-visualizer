particlesJS.load('particles-js', 'assets/particlesjs-config.json', function () {
    console.log('callback - particles.js config loaded');
})


const marginVertical = 20
const marginHorizontal = 20
let scale = 50
// const arrowHeadLength = 10
const coordinateColor = '#bbbbbb'
const axisColor = '#dddddd'
const transformedCoordinateColor = '#00ffff'
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

let matrix = [[1, 0], [0, 1]]


const updateDimensions = function () {
    parentDivWidth = document.getElementById('coordinate-system-div').offsetWidth
    parentDivHeight = document.getElementById('coordinate-system-div').offsetHeight

    coordinateSystem.width = parentDivWidth - 2 * marginHorizontal
    coordinateSystem.height = parentDivHeight - 2 * marginVertical

    resetCanvas()
    drawCoordinates()
    drawBaseVectors()
    setInfo()
}

const drawCoordinates = function () {
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

const drawTransformedCoordinates = function () {
    const xScale = Math.floor(coordinateSystem.width / (2 * scale))
    const yScale = Math.floor(coordinateSystem.height / (2 * scale))
    const origin = [Math.floor(coordinateSystem.width / 2), Math.floor(coordinateSystem.height / 2)]

    for (let i = -5 * xScale; i <= 5 * xScale; i++) {
        context.beginPath()
        const posVector = [i, 5 * yScale]
        const negVector = [i, -5 * yScale]
        const transformedPosVector = vectorTransform(matrix, posVector)
        const transformedNegVector = vectorTransform(matrix, negVector)
        context.strokeStyle = transformedCoordinateColor
        context.lineWidth = 1
        context.moveTo(origin[0] + scale * transformedPosVector[0], origin[1] - scale * transformedPosVector[1])
        context.lineTo(origin[0] + scale * transformedNegVector[0], origin[1] - scale * transformedNegVector[1])
        context.stroke()
    }

    for (let i = -5 * yScale; i <= 5 * yScale; i++) {
        context.beginPath()
        const posVector = [5 * xScale, i]
        const negVector = [-5 * xScale, i]
        const transformedPosVector = vectorTransform(matrix, posVector)
        const transformedNegVector = vectorTransform(matrix, negVector)
        context.strokeStyle = transformedCoordinateColor
        context.lineWidth = 1
        context.moveTo(origin[0] + scale * transformedPosVector[0], origin[1] - scale * transformedPosVector[1])
        context.lineTo(origin[0] + scale * transformedNegVector[0], origin[1] - scale * transformedNegVector[1])
        context.stroke()
    }
}

const drawBaseVectors = function () {
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

const resetCanvas = function () {
    context.clearRect(0, 0, coordinateSystem.width, coordinateSystem.height)
    matrixContext.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height)
    inverseMatrixContext.clearRect(0, 0, inverseMatrixCanvas.width, inverseMatrixCanvas.height)
}

const setIHat = function (event) {
    const origin = [Math.floor(coordinateSystem.width / 2), Math.floor(coordinateSystem.height / 2)]

    const x = (event.offsetX - origin[0]) / scale
    const y = -(event.offsetY - origin[1]) / scale

    matrix = [[x, y], matrix[1]]

    resetCanvas()
    drawCoordinates()
    drawBaseVectors()
    setInfo()
}

const setJHat = function (event) {
    const origin = [Math.floor(coordinateSystem.width / 2), Math.floor(coordinateSystem.height / 2)]

    const x = (event.offsetX - origin[0]) / scale
    const y = -(event.offsetY - origin[1]) / scale

    matrix = [matrix[0], [x, y]]

    resetCanvas()
    drawCoordinates()
    drawBaseVectors()
    setInfo()
}

const handleCoordinateSystemClick = function (event) {
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

const handleCoordinateSystemMousUp = function (event) {
    coordinateSystem.removeEventListener('mousemove', setIHat)
    coordinateSystem.removeEventListener('mousemove', setJHat)
}

const drawMatrix = function (matrixContext, matrix, name, inverse) {
    matrixContext.font = '30px Time New Roman'
    matrixContext.fillText(name + (inverse ? ' ' : '') + ' = ', 1, 70)

    if (inverse) {
        matrixContext.font = '20px Time New Roman'
        matrixContext.fillText('-1', 20, 50)
    }

    const offset = inverse ? 10 : 0

    matrixContext.beginPath()
    matrixContext.moveTo(65 + offset, 5)
    matrixContext.lineTo(60 + offset, 5)
    matrixContext.lineTo(60 + offset, 125)
    matrixContext.lineTo(65 + offset, 125)
    matrixContext.strokeStyle = '#000000'
    matrixContext.stroke()

    matrixContext.beginPath()
    matrixContext.moveTo(215 + offset, 5)
    matrixContext.lineTo(220 + offset, 5)
    matrixContext.lineTo(220 + offset, 125)
    matrixContext.lineTo(215 + offset, 125)
    matrixContext.strokeStyle = '#000000'
    matrixContext.stroke()

    matrixContext.font = '24px Time New Roman'
    matrixContext.fillText(round(matrix[0][0], 2), 75 + offset, 35)
    matrixContext.fillText(round(matrix[0][1], 2), 75 + offset, 105)
    matrixContext.fillText(round(matrix[1][0], 2), 155 + offset, 35)
    matrixContext.fillText(round(matrix[1][1], 2), 155 + offset, 105)
}

const setInfo = function () {
    drawMatrix(matrixContext, matrix, 'A', false)

    const determinant = matrix[0][0] * matrix[1][1] - matrix[1][0] * matrix[0][1]
    document.getElementById('det-div').innerText = 'det(A) = ' + round(determinant, 4)

    drawMatrix(inverseMatrixContext, matrixInverse(matrix), 'A', true)
}

const handleZoom = function (event) {
    event.preventDefault()
    scale *= 1 - Math.sign(event.deltaY) / 10
    scale = Math.max(4, scale)
    context.clearRect(0, 0, coordinateSystem.width, coordinateSystem.height)
    drawCoordinates()
    drawTransformedCoordinates()
    drawBaseVectors()
}

const round = function (number, digits) {
    return Math.round(Math.pow(10, digits) * number) / Math.pow(10, digits)
}


coordinateSystem.width = parentDivWidth - 2 * marginHorizontal
coordinateSystem.height = parentDivHeight - 2 * marginVertical

window.addEventListener('resize', updateDimensions)
coordinateSystem.addEventListener('mousedown', handleCoordinateSystemClick)
coordinateSystem.addEventListener('wheel', handleZoom)
window.addEventListener('mouseup', handleCoordinateSystemMousUp)


drawCoordinates()
drawBaseVectors()
setInfo()


//social buttons

const twitterButtons = document.getElementsByClassName('twitter-button')
const instagramButtons = document.getElementsByClassName('instagram-button')
const githubButtons = document.getElementsByClassName('github-button')

for (let i = 0; i < twitterButtons.length; i++) {
    twitterButtons[i].addEventListener('click', function () {
        window.open('https://twitter.com/DennisWeiss263', '_blank')
    })
}

for (let i = 0; i < instagramButtons.length; i++) {
    instagramButtons[i].addEventListener('click', function () {
        window.open('https://www.instagram.com/dennis263313', '_blank')
    })
}

for (let i = 0; i < githubButtons.length; i++) {
    githubButtons[i].addEventListener('click', function () {
        window.open('https://github.com/DennisWeiss', '_blank')
    })
}