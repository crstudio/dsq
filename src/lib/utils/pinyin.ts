const pinyinMap: Record<string, string> = {
	'铁矿': 'tiekuang', '铜矿': 'tongkuang', '硅石': 'guishi', '钛石': 'taishi',
	'石矿': 'shikuang', '煤矿': 'meikuang', '金红石': 'jinHongshi', '氢': 'qing',
	'重氢': 'zhongqing', '超重氢': 'chaozhongqing', '氦': 'hai', '氦3': 'hai3',
	'水': 'shui', '原油': 'yuanyou', '冰': 'bing', '可燃冰': 'ranbing',
	'氢燃料棒': 'qingranliaoban', '重氢燃料棒': 'zhongqingranliaoban', '超重氢燃料棒': 'chaozhongqingranliaoban',
	'铁块': 'tiekuai', '铜块': 'tongkuai', '硅块': 'guikuiai', '钛块': 'taikuai',
	'石块': 'shikuai', '煤块': 'meikuai', '高纯硅块': 'gaochunguikuai',
	'钢材': 'gangcai', '钛合金': 'taihejin', '磁铁': 'citie', '铜线圈': 'tongxianquan',
	'电路板': 'dianluban', '电动机': 'diandongji', '电缆': 'dianlan', '玻璃': 'boli',
	'石墨': 'shimo', '金刚石': 'jingangshi', '氟化物': 'fuwuhua', '氢氧化物': 'qingyangwuhua',
	'硫酸': 'liusuan', '硝酸': 'xiaosuan', '盐酸': 'yansuan', '磷酸': 'linsuan',
	'粒子容器': 'lizirongqi', '量子芯片': 'liangzixinpian', '位面过滤器': 'weimianlvqi',
	'推进器': 'tuijinqi', '能量核心': 'nenglianghexin', '引力波发射器': 'yinylibofaqi',
	'引力能量核心': 'yinenglianghexin', '空间仓储': 'kongjianshangcu', '空间传送器': 'kongjianchuanqi',
	'曲面反射镜': 'qumianfanshejing', '轨道拦截器': 'guodao lanzhiqi', '轨道熔炉': 'guodaoronglu',
	'分化器': 'fenhuaqi', '邮递机': 'you diji', '物流配送机': 'wuliupeisongji',
	'星际物流运输站': 'xingjiwuliuyunshuzhan', '行星内物流运输站': 'xingxingneiwuliuyunshuzhan',
	'轨道采集器': 'guidaocaijiqi', '抽油站': 'chouyouzhan', '油气精炼厂': 'youqijinglianchang',
	'作业机器': 'zuoyejiqi', '自动机': 'zidongji', '电弧炉': 'dianhulu',
	'组装机': 'zuzhuangji', '制造台': 'zhizaotai', '精炼厂': 'jinglianchang',
	'研究台': 'yanjiutai', '传输轨道': 'chuanshuguiji', '分馏塔': 'fenliuta',
	'电磁轨道': 'dianciguidao', '粒子对撞机': 'lizuiduizhuangji', '太阳帆': 'taiyangfan',
	'聚变发电厂': 'jubianfadianchang', '人造恒星': 'renzaohengxing', '戴森球': 'daisenqiu',
	'戴森壳': 'daisenqiao', '能量枢纽': 'nengliangshuniu', '矩阵': 'juzhen',
	'结构矩阵': 'jiegoujuzhen', '宇宙矩阵': 'yuzhoujuzhen', '星际矩阵': 'xingjijuzhen',
	'光子矩阵': 'guangzijuzhen', '引力矩阵': 'yinlijuzhen', '时空矩阵': 'shikongjuzhen',
	'临界光子': 'linjieguangzi', '简并态物质': 'jianbiantaiwuzhi', '宇宙漆': 'yu Zhouqi',
	'光栅': 'guangshan', '棱镜': 'lengjing', '晶体cpu': 'jingticpu', '处理器': 'chu liqi',
	'晶圆': 'jingyuan', '超级磁场发生器': 'chaojicichangfashengqi', '磁场发生器': 'cichangfashengqi',
	'电容': 'dianrong', '电线圈': 'dianxianquan', '铁芯': 'tiexin', '马达': 'mada',
	'电磁制动器': 'diancizhidongqi', '蒸汽轮机': 'zhengqilunji', '火力发电厂': 'huolifadianchang',
	'风力发电机': 'fenglifadianji', '光伏电站': 'guangfudianzhan', '地热发电站': 'dianrefadianzhan',
	'核聚变发电': 'hejubianfadian', '托卡马克装置': 'tuokamakezhuangzhi',
	'地基': 'diji', '生产枢纽': 'shengchanshuniu', '储液罐': 'chuyeguan',
	'小型储液罐': 'xiaoxingchuyeguan', '中型储液罐': 'zhongxingchuyeguan', '大型储液罐': 'daxingchuyeguan',
	'蓄电器': 'xudianqi', '电池': 'dianchi', '锂电池': 'lidianchi', '氢电池': 'qingdianchi',
	'能量磁盘': 'nengliangcipan', '质子交换膜': 'zhizijiaohuanmo', '电解槽': 'dianjiecao',
	'分离塔': 'fenglita', '换热器': 'huanreqi', '蒸汽发生器': 'zhengqifashengqi',
	'加压泵': 'jiayabeng', '化工园': 'huagongyuan', '单体': 'danti', '聚合物': 'juhewu',
	'塑料': 'suliao', '有机玻璃': 'youjiboli', '石墨烯': 'shimoxi', '碳纳米管': 'taninamiguan',
	'硅烷': 'guiwan', '硅脂': 'guizhi', '液氢': 'yiqing', '液氦': 'yehai',
	'红石': 'hongshi', '红石粉': 'hongshifen', '红石块': 'hongshikuai',
	'硝石': 'xiaoshi', '硫磺': 'liuhuang', '萤石': 'yingshi'
};

export function getPinyin(name: string): string {
	return pinyinMap[name] || '';
}

export function getPinyinFirstLetters(name: string): string {
	const pinyin = pinyinMap[name] || '';
	return pinyin
		.split('')
		.map((char) => char.toUpperCase())
		.join('');
}
