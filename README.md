# Bgmtv-importer
[![Test](https://github.com/1574242600/bangumi-importer/actions/workflows/test.yml/badge.svg?branch=dev)](https://github.com/1574242600/bangumi-importer/actions/workflows/test.yml)

一个 Bangumi.tv 条目观看进度导入器。

**目前 Bangumi.tv 正在建设新 API，在新 API 完成之前该脚本只会发布测试版本(因为新旧 API，脚本都有使用以及 CLI 可能会在新 API 完成后重写)**

## 使用
```shell
$ npx bgmtv-importer -h
```

### 导入

```shell
$ npx bgmtv-importer import -h
```

从 json 文件导入观看进度。

文件结构:

```json
[   
    {
        "id": "int  条目 id",
        "status": "string  可选  观看状态 请参考 Bangumi.tv 官方 API 文档，默认为 'wish'",
        "watchedEps": "int[]  可选  观看过的集数",
        "watchedVols": "int  可选   观看到的卷数"
    }, 

]
```

脚本会合并重复的数据，合并的规则为： 
| 属性 | 合并规则|
| --- | --- | 
|`status`| 按优先级:  `dropped` > `collect` > `on_hold` > `do` > `wish` |
|`watchedEps`| 取重复项中所有出现过的集数   |
|`watchedVols`| 取重复项中的最大值  |

#### 从站点生成 json 文件
- 屑站: 
    - [js 脚本](https://gist.github.com/1574242600/6093d1fec38a16355c8df17f084e55e9)


### 重新导入

```shell 
$ npx bgmtv-importer reimport -h
```

在导入期间发生错误时，脚本会在当前目录生成包含当前导入进度及条目观看进度数据的 json 文件。  
你可以通过它来继续导入。


文件结构：
```json
{
    "index": "int  发生错误时正在导入的条目的索引",
    "progressData": "同'导入'"
}
```