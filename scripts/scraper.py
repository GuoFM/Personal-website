import requests
import yaml
import json
from datetime import datetime
import os

def fetch_conference_data():
    # 直接从 GitHub raw content 获取会议数据
    base_url = "https://raw.githubusercontent.com/ccfddl/ccf-deadlines/main/conference"
    categories = ['ai', 'architecture', 'security', 'software', 'theory', 'network']
    
    print("Starting to fetch conference data...")
    conferences = []
    
    for category in categories:
        print(f"Processing category: {category}")
        category_url = f"{base_url}/{category}"
        
        try:
            # 获取目录列表
            response = requests.get(f"https://api.github.com/repos/ccfddl/ccf-deadlines/contents/conference/{category}")
            response.raise_for_status()
            conf_files = response.json()
            
            for conf_file in conf_files:
                if conf_file['name'].endswith('.yml'):
                    try:
                        # 获取 YAML 文件内容
                        yaml_url = conf_file['download_url']
                        print(f"Fetching conference file: {yaml_url}")
                        yaml_response = requests.get(yaml_url)
                        yaml_response.raise_for_status()
                        
                        # 解析 YAML 数据
                        conf_data = yaml.safe_load(yaml_response.text)
                        
                        if 'confs' in conf_data and conf_data['confs']:
                            latest_conf = conf_data['confs'][-1]  # 获取最新一届会议
                            
                            if 'timeline' in latest_conf:
                                for timeline in latest_conf['timeline']:
                                    deadline = timeline.get('deadline')
                                    if deadline and deadline != 'TBD':
                                        # 处理时区
                                        timezone = latest_conf.get('timezone', 'UTC')
                                        
                                        # 添加时区信息
                                        if not deadline.endswith(timezone):
                                            deadline = f"{deadline} {timezone}"
                                        
                                        # 处理 abstract_deadline
                                        abstract_deadline = timeline.get('abstract_deadline')
                                        if abstract_deadline and abstract_deadline != 'TBD':
                                            if not abstract_deadline.endswith(timezone):
                                                abstract_deadline = f"{abstract_deadline} {timezone}"
                                        
                                        conference = {
                                            'title': conf_data['title'],
                                            'rank': conf_data['rank']['ccf'],
                                            'category': conf_data.get('sub', category.capitalize()),
                                            'abstract_deadline': abstract_deadline,
                                            'submission_deadline': deadline,
                                            'conference_date': latest_conf.get('date', 'TBA'),
                                            'location': latest_conf.get('place', 'TBA'),
                                            'website': latest_conf.get('link', '#'),
                                            'link': latest_conf.get('link', '#')
                                        }
                                        conferences.append(conference)
                                        print(f"Successfully processed conference: {conf_data['title']}")
                                        
                    except Exception as e:
                        print(f"Error processing conference file {conf_file['name']}: {e}")
                        continue
                        
        except Exception as e:
            print(f"Error processing category {category}: {e}")
            continue
    
    # 过滤过期会议并排序
    now = datetime.now()
    valid_conferences = []
    for conf in conferences:
        try:
            deadline = datetime.strptime(conf['submission_deadline'].split()[0], '%Y-%m-%d')
            if deadline > now:
                valid_conferences.append(conf)
        except ValueError as e:
            print(f"Error parsing deadline for {conf['title']}: {e}")
            continue
    
    valid_conferences.sort(key=lambda x: datetime.strptime(x['submission_deadline'].split()[0], '%Y-%m-%d'))
    
    print(f"Total valid conferences fetched: {len(valid_conferences)}")
    return valid_conferences

def save_data(conferences):
    try:
        # 确保目录存在
        os.makedirs('public/data', exist_ok=True)
        
        # 使用绝对路径
        script_dir = os.path.dirname(os.path.abspath(__file__))
        root_dir = os.path.dirname(script_dir)
        file_path = os.path.join(root_dir, 'public', 'data', 'conferences.json')
        
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(conferences, f, ensure_ascii=False, indent=2)
            print(f"Successfully saved {len(conferences)} conferences to {file_path}")
    except Exception as e:
        print(f"Error saving data: {e}")

if __name__ == "__main__":
    print("Starting conference data scraper...")
    conferences = fetch_conference_data()
    if conferences:
        save_data(conferences)
    else:
        print("No conference data was fetched.") 