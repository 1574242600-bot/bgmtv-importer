
/**
 * 替换字符串中指定的子串
 * 
 * @name replace
 * @param source 原字符串
 * @param replaceObj Record<string, string> key 为需要被替换的子串， value 为用于替换掉子串的字符串
 * @param global boolen 是否全局匹配 默认 true
 * @return string 替换后的字符串
 */
function replace(source: string, replaceObj: Record<string, string>, global = true): string {
    const StrArr = Array.from(source.normalize());
    const keys = Object.keys(replaceObj);

    for (const key of keys) {
        const subStartIndexs = global
            ? indexOfAll(key, source)
            : [source.indexOf(key)];

        if (subStartIndexs === null) continue;

        for (const index of subStartIndexs) {
            StrArr.splice(
                index + 1,
                key.length - 1,
                ...Array(key.length - 1)
            );

            StrArr[index] = replaceObj[key];
        }
    }

    return StrArr.join('');
}

export function indexOfAll(str: string, source: string): number[] {
    const indexArr: number[] = [];

    let lastIndex = 0;

    while (lastIndex > -1) {
        const index = source.indexOf(str, lastIndex);
        if (index === -1) break;

        indexArr.push(index);
        lastIndex = index + str.length;
    }

    return indexArr.length === 0
        ? null
        : indexArr;
}

export default replace;