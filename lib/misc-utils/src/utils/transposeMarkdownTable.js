/**
 * 对 markdown 表格进行转置输出。
 * - 不负责格式化。
 * - 不支持表格中存在字符 `|`
 * - 表格每行前后不能省略 `|` 符号。
 *
 * @param {string} markdownTable
 * @returns
 */
function transposeMarkdownTable(markdownTable) {
    // 将字符串表格，转化为二维数组
    const table = markdownTable
        .trim()
        .split('\n')
        .map(
            line => line
                .split('|')
                .map(v => v.trim())
                // [ '', '1', '2', '3', '' ]
                // console.log('|1|2|3|'.split('|'))
                // 所以需要去掉头和尾
                .filter((_, i, arr) => i !== 0 && i !== arr.length - 1)
        )

    // 删除分割线
    table.splice(1, 1)

    // 计算表格的行数和列数
    const numRows = table.length
    const numCols = table[0].length

    // 初始化转置后的表格数组，需要行列颠倒
    const transposedTable = Array.from({ length: numCols }, () => Array(numRows).fill())

    // 对原表格进行转置
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            transposedTable[j][i] = table[i][j]
        }
    }

    // 构建转置后的 markdown 字符串
    let transposedMarkdown = ''
    for (let i = 0; i < numCols; i++) {
        for (let j = 0; j < numRows; j++) {
            transposedMarkdown += '|' + transposedTable[i][j]
        }
        transposedMarkdown += '|\n'

        if (i === 0) {
            // 输出分割线
            for (let j = 0; j < numRows; j++) {
                transposedMarkdown += '|' + '--'
            }
            transposedMarkdown += '|\n'
        }
    }

    return transposedMarkdown
}

// 测试示例
const markdownTable = `
|                    | [\`in\`] | [\`for...in\`] | [\`propertyIsEnumerable()\`] | [\`propertyIsEnumerable()\`] | [\`Object.keys\`] <br> [\`Object.values\`] <br> [\`Object.entries\`] | [\`Object.getOwnPropertyNames\`] | [\`Object.getOwnPropertyDescriptors\`] | [\`Reflect.ownKeys\`] |
| :----------------: | :----: | :----------: | :------------------------: | :------------------------: | :------------------------------------------------------------: | :----------------------------: | :----------------------------------: | :-----------------: |
|  自身的可枚举属性  |   ✅   |      ✅      |             ✅             |             ✅             |                               ✅                               |               ✅               |                  ✅                  |         ✅          |
| 自身的不可枚举属性 |   ✅   |      ❌      |             ✅             |             ❌             |                               ❌                               |               ✅               |                  ✅                  |         ✅          |
|  自身的 Symbol 键  |   ✅   |      ❌      |             ✅             |             ✅             |                               ❌                               |               ❌               |                  ✅                  |         ✅          |
|  继承的可枚举属性  |   ✅   |      ✅      |             ❌             |             ❌             |                               ❌                               |               ❌               |                  ❌                  |         ❌          |
| 继承的不可枚举属性 |   ✅   |      ❌      |             ❌             |             ❌             |                               ❌                               |               ❌               |                  ❌                  |         ❌          |
|  继承的 Symbol 键  |   ✅   |      ❌      |             ❌             |             ❌             |                               ❌                               |               ❌               |                  ❌                  |         ❌          |

`

const transposedMarkdownTable = transposeMarkdownTable(markdownTable)
console.log(transposedMarkdownTable)
