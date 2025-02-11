import requests
import yaml
import json
from datetime import datetime
import os

def fetch_conference_data():
    # 获取会议目录列表
    api_url = "https://api.github.com/repos/ccfddl/ccf-deadlines/contents/conference"
    print(f"Fetching data from GitHub API: {api_url}")
    headers = {}
    if 'GITHUB_TOKEN' in os.environ:
        headers['Authorization'] = f"token {os.environ['GITHUB_TOKEN']}"
    
    try:
        response = requests.get(api_url, headers=headers)
        response.raise_for_status()
        categories = response.json()
        
        conferences = []
        for category in categories:
            if category['type'] == 'dir':
                # 获取每个分类下的会议文件
                category_url = category['url']
                conf_response = requests.get(category_url)
                conf_response.raise_for_status()
                conf_files = conf_response.json()
                
                for conf_file in conf_files:
                    if conf_file['name'].endswith('.yml'):
                        # 获取会议 YAML 文件内容
                        yaml_content = requests.get(conf_file['download_url']).text
                        conf_data = yaml.safe_load(yaml_content)
                        
                        # 处理会议数据
                        try:
                            latest_conf = conf_data['confs'][-1]  # 获取最新一届会议
                            
                            # 处理截稿日期
                            if 'timeline' in latest_conf:
                                for timeline in latest_conf['timeline']:
                                    try:
                                        deadline = timeline.get('deadline')
                                        if deadline and deadline != 'TBD':
                                            # 处理时区
                                            timezone = latest_conf.get('timezone', 'UTC')
                                            
                                            # 添加时区信息
                                            if not deadline.endswith(timezone):
                                                deadline = f"{deadline} {timezone}"
                                            
                                            # 同样处理 abstract_deadline
                                            abstract_deadline = timeline.get('abstract_deadline')
                                            if abstract_deadline and abstract_deadline != 'TBD':
                                                if not abstract_deadline.endswith(timezone):
                                                    abstract_deadline = f"{abstract_deadline} {timezone}"
                                            
                                            conferences.append({
                                                'title': conf_data['title'],
                                                'rank': conf_data['rank']['ccf'],
                                                'category': conf_data['sub'],
                                                'abstract_deadline': abstract_deadline,
                                                'submission_deadline': deadline,
                                                'conference_date': latest_conf.get('date', 'TBA'),
                                                'location': latest_conf.get('place', 'TBA'),
                                                'website': latest_conf.get('link', '#'),
                                                'link': latest_conf.get('link', '#')
                                            })
                                            print(f"Successfully processed conference: {conf_data['title']}")
                                    except Exception as e:
                                        print(f"Error processing timeline for {conf_data['title']}: {e}")
                                        continue
                        except (KeyError, IndexError) as e:
                            print(f"Error processing conference file {conf_file['name']}: {e}")
                            continue
        
        # 过滤过期会议并排序
        now = datetime.now()
        valid_conferences = []
        for conf in conferences:
            try:
                deadline = datetime.strptime(conf['submission_deadline'], '%Y-%m-%d %H:%M:%S')
                if deadline > now:
                    valid_conferences.append(conf)
            except ValueError:
                continue
        
        valid_conferences.sort(key=lambda x: datetime.strptime(x['submission_deadline'], '%Y-%m-%d %H:%M:%S'))
        
        print(f"Total valid conferences fetched: {len(valid_conferences)}")
        return valid_conferences
        
    except Exception as e:
        print(f"Error fetching data: {e}")
        return []

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