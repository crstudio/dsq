import json
import math
from collections import defaultdict

with open('recipes.json', 'r', encoding='utf-8') as f:
    recipes = json.load(f)

with open('Items.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

item_map = {item['ID']: item['Name'] for item in items}

recipe_map = {}
for recipe in recipes:
    for result_id in recipe['Results']:
        if result_id not in recipe_map:
            recipe_map[result_id] = recipe

def calc_materials(target_name, target_count=1):
    target_id = None
    for item in items:
        if item['Name'] == target_name:
            target_id = item['ID']
            break
    
    if target_id is None:
        print(f"未找到物品: {target_name}")
        return {}
    
    materials = defaultdict(int)
    stack = [(target_id, target_count, [])]
    
    while stack:
        current_id, count, path = stack.pop()
        current_name = item_map.get(current_id, f'ID:{current_id}')
        
        if current_id in path:
            materials[current_name] += count
            continue
        
        if current_id not in recipe_map:
            materials[current_name] += count
            continue
        
        recipe = recipe_map[current_id]
        
        if len(recipe['Items']) == 0:
            materials[current_name] += count
            continue
        
        result_count = recipe['ResultCounts'][0]
        ratio = count / result_count
        
        new_path = path + [current_id]
        
        for i, mat_id in enumerate(recipe['Items']):
            mat_count = math.ceil(recipe['ItemCounts'][i] * ratio)
            stack.append((mat_id, mat_count, new_path))
    
    return dict(materials)

materials = calc_materials('宇宙矩阵', 1)

print('=== 生产1个宇宙矩阵所需基础材料 ===')
for name, count in sorted(materials.items(), key=lambda x: -x[1]):
    print(f'{name}: {count}')
print(f'\n总计: {len(materials)} 种材料')
