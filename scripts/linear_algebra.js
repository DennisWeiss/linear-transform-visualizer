const vectorTransform = (matrix, vector) => [matrix[0][0] * vector[0] + matrix[1][0] * vector[1], matrix[0][1] * vector[0] + matrix[1][1] * vector[1]]

const matrixInverse = matrix => [[1 / matrix[0][0] - (matrix[1][0] * matrix[0][1]) / (matrix[0][0] * matrix[1][0] * matrix[0][1] - matrix[0][0] * matrix[0][0] * matrix[1][1]), matrix[0][1] / (matrix[1][0] * matrix[0][1] - matrix[0][0] * matrix[1][1])],
    [matrix[1][0] / (matrix[1][0] * matrix[0][1] - matrix[0][0] * matrix[1][1]), -matrix[0][0] / (matrix[1][0] * matrix[0][1] - matrix[0][0] * matrix[1][1])]]