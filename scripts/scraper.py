import requests
import yaml
import json
from datetime import datetime
import os

def fetch_conference_data():
    # 会议分类目录
    categories = ['NW', 'DS', 'SC', 'SE', 'DB', 'CT', 'CG', 'AI', 'HI', 'MX']
    
    print("Starting to fetch conference data...")
    conferences = []
    
    # 设置 GitHub API 认证
    headers = {}
    if 'GITHUB_TOKEN' in os.environ:
        headers = {
            'Authorization': f"Bearer {os.environ['GITHUB_TOKEN']}",
            'Accept': 'application/vnd.github.v3+json'
        }
    
    for category in categories:
        print(f"Processing category: {category}")
        try:
            # 获取分类目录下的文件列表
            api_url = f"https://api.github.com/repos/ccfddl/ccf-deadlines/contents/conference/{category}"
            print(f"Fetching from: {api_url}")
            
            response = requests.get(api_url, headers=headers)
            response.raise_for_status()
            files = response.json()
            
            # 处理每个会议的 YAML 文件
            for file in files:
                if file['name'].endswith('.yml'):
                    try:
                        # 获取 YAML 文件内容
                        yaml_url = file['download_url']
                        print(f"Fetching conference file: {yaml_url}")
                        
                        yaml_response = requests.get(yaml_url, headers=headers)
                        yaml_response.raise_for_status()
                        conf_data = yaml.safe_load(yaml_response.text)
                        
                        if conf_data and 'confs' in conf_data:
                            # 获取最新一届会议信息
                            latest_conf = conf_data['confs'][-1]
                            
                            if 'timeline' in latest_conf:
                                for timeline in latest_conf['timeline']:
                                    deadline = timeline.get('deadline')
                                    if deadline and deadline != 'TBD':
                                        # 处理时区
                                        timezone = latest_conf.get('timezone', 'UTC')
                                        
                                        # 添加时区信息
                                        if not deadline.endswith(timezone):
                                            deadline = f"{deadline} {timezone}"
                                        
                                        # 处理摘要截止日期
                                        abstract_deadline = timeline.get('abstract_deadline')
                                        if abstract_deadline and abstract_deadline != 'TBD':
                                            if not abstract_deadline.endswith(timezone):
                                                abstract_deadline = f"{abstract_deadline} {timezone}"
                                        
                                        conference = {
                                            'title': conf_data['title'],
                                            'description': conf_data.get('description', ''),
                                            'rank': conf_data['rank']['ccf'],
                                            'category': conf_data.get('sub', category),
                                            'abstract_deadline': abstract_deadline,
                                            'submission_deadline': deadline,
                                            'conference_date': latest_conf.get('date', 'TBA'),
                                            'location': latest_conf.get('place', 'TBA'),
                                            'website': latest_conf.get('link', '#'),
                                            'year': latest_conf.get('year', '')
                                        }
                                        conferences.append(conference)
                                        print(f"Successfully processed conference: {conf_data['title']}")
                                        
                    except Exception as e:
                        print(f"Error processing conference file {file['name']}: {str(e)}")
                        continue
                        
        except Exception as e:
            print(f"Error processing category {category}: {str(e)}")
            continue
    
    if not conferences:
        print("No conferences were found!")
        return []
    
    # 过滤过期会议并排序
    now = datetime.now()
    valid_conferences = []
    for conf in conferences:
        try:
            deadline = datetime.strptime(conf['submission_deadline'].split()[0], '%Y-%m-%d')
            if deadline > now:
                valid_conferences.append(conf)
        except ValueError as e:
            print(f"Error parsing deadline for {conf['title']}: {str(e)}")
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
            
        # 验证文件是否成功创建
        if os.path.exists(file_path):
            print(f"Verified: File exists at {file_path}")
            print(f"File size: {os.path.getsize(file_path)} bytes")
        else:
            print(f"Warning: File was not created at {file_path}")
            
    except Exception as e:
        print(f"Error saving data: {str(e)}")
        print(f"Current working directory: {os.getcwd()}")
        print(f"Directory contents: {os.listdir('.')}")

if __name__ == "__main__":
    print("Starting conference data scraper...")
    conferences = fetch_conference_data()
    if conferences:
        save_data(conferences)
    else:
        print("No conference data was fetched.") 