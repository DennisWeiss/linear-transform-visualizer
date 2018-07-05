const vectorTransform = function (matrix, vector) {
    return [matrix[0][0] * vector[0] + matrix[1][0] * vector[1], matrix[0][1] * vector[0] + matrix[1][1] * vector[1]]
}

const matrixInverse = function (matrix) {
    return [[1 / matrix[0][0] - (matrix[1][0] * matrix[0][1]) / (matrix[0][0] * matrix[1][0] * matrix[0][1] - matrix[0][0] * matrix[0][0] * matrix[1][1]), matrix[0][1] / (matrix[1][0] * matrix[0][1] - matrix[0][0] * matrix[1][1])],
        [matrix[1][0] / (matrix[1][0] * matrix[0][1] - matrix[0][0] * matrix[1][1]), -matrix[0][0] / (matrix[1][0] * matrix[0][1] - matrix[0][0] * matrix[1][1])]]
}