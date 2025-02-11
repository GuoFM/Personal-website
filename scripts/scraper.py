import requests
import json
from datetime import datetime

def fetch_conference_data():
    url = "https://ccfddl.github.io/data/ccf-deadlines.json"
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        
        # 转换数据格式
        conferences = []
        for conf in data:
            # 确保日期格式正确
            try:
                abstract_date = datetime.strptime(conf['abstract_deadline'], '%Y-%m-%d %H:%M:%S') if conf.get('abstract_deadline') else None
                submission_date = datetime.strptime(conf['deadline'], '%Y-%m-%d %H:%M:%S')
                
                conferences.append({
                    'title': conf['name'],
                    'rank': conf['ccf_level'],
                    'category': conf['categories'][0] if conf.get('categories') else 'Computer Science',
                    'abstract_deadline': abstract_date.strftime('%Y-%m-%d %H:%M:%S') if abstract_date else None,
                    'submission_deadline': submission_date.strftime('%Y-%m-%d %H:%M:%S'),
                    'conference_date': conf.get('date', 'TBA'),
                    'location': conf.get('place', 'TBA'),
                    'website': conf.get('website', '#'),
                    'link': conf.get('link', '#')
                })
            except (ValueError, KeyError) as e:
                print(f"Error processing conference {conf.get('name')}: {e}")
                continue
        
        # 按截稿日期排序并过滤过期会议
        now = datetime.now()
        conferences = [
            conf for conf in conferences 
            if datetime.strptime(conf['submission_deadline'], '%Y-%m-%d %H:%M:%S') > now
        ]
        conferences.sort(key=lambda x: datetime.strptime(x['submission_deadline'], '%Y-%m-%d %H:%M:%S'))
        
        return conferences
    except Exception as e:
        print(f"Error fetching data: {e}")
        return []

def save_data(conferences):
    try:
        # 确保目录存在
        import os
        os.makedirs('public/data', exist_ok=True)
        
        with open('public/data/conferences.json', 'w', encoding='utf-8') as f:
            json.dump(conferences, f, ensure_ascii=False, indent=2)
            print(f"Successfully saved {len(conferences)} conferences")
    except Exception as e:
        print(f"Error saving data: {e}")

if __name__ == "__main__":
    conferences = fetch_conference_data()
    save_data(conferences) 