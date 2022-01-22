import findDuplicate from '../findDuplicate';

test('找到重复项, 返回其索引信息',() => {
    const received = findDuplicate([1,2,2,3], (v) => v + '');
    expect(received).toMatchSnapshot();
});

test('未找到重复项, 返回null',() => {
    const received = findDuplicate([1,2,3], (v) => v + '');
    expect(received).toBe(null);
});
