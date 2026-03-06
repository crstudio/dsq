/** 物品数据接口 */
export interface Item {
	ID: number;
	Type: number;
	Name: string;
	GridIndex: number;
	IconName: string;
}

/** 配方数据接口 */
export interface Recipe {
	Items: number[];
	ItemCounts: number[];
	Results: number[];
	ResultCounts: number[];
	Name: string;
	Factories?: number[];
	Type?: number;
}
