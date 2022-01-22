/**
 * 查找并返回重复的元素及其索引
 * 
 * @name findDuplicate
 * @param array T[] 
 * @param valueOf (value: T) => string 一个函数,参数是数组中的元素,返回字符串,用作判断元素是否重复的依据
 * @return Record<string, number[]> string 是 valueOf() 返回值, number[] 索引. 未找到重复的元素时,返回null
 */
export default function findDuplicate<T>(
    array: T[],
    valueOf: (value: T) => string,
): Record<string, number[]> {
    const firstIndex: Record<string, number> = {};

    const result = array.reduce<Record<string, number[]>>((duplicate, value, index) => {
        const key = valueOf(value);
        if (firstIndex[key] === undefined) {
            firstIndex[key] = index;
            return duplicate;
        }

        if (duplicate[key] === undefined) {
            duplicate[key] = [];
            duplicate[key].push(firstIndex[key]);
            duplicate[key].push(index);
            return duplicate;
        }

        //if (duplicate[key] instanceof Array)
        duplicate[key].push(index);

        return duplicate;
    }, {});

    return Object.keys(result).length === 0 ? null : result;
}