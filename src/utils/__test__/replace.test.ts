import replace from '../replace';

test('替换字符串中指定的子串, 只匹配一次', () => {
    const received = replace('hello world hello world', {
        'hello': 'hi',
        'world': 'earth'
    }, false);

    expect(received).toBe('hi earth hello world');
});

test('替换字符串中指定的子串, 全局匹配', () => {
    const received = replace('hello world hello world', {
        'hello': 'hi',
        'world': 'earth'
    });

    expect(received).toBe('hi earth hi earth');
});

test('未匹配到指定的子串，返回原字符串', () => {
    const received = replace('hello world', {
        '1': 'hi',
        '2': 'earth'
    });

    expect(received).toBe('hello world');
});