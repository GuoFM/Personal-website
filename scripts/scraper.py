import requests
import yaml
import json
from datetime import datetime
import os

def fetch_conference_data():
    # 使用正确的分类代码
    categories = {
        'DS': '计算机体系结构/并行与分布计算/存储系统',
        'NW': '计算机网络',
        'SC': '网络与信息安全',
        'SE': '软件工程/系统软件/程序设计语言',
        'DB': '数据库/数据挖掘/内容检索',
        'CT': '计算机科学理论',
        'CG': '计算机图形学与多媒体',
        'AI': '人工智能',
        'HI': '人机交互与普适计算',
        'MX': '交叉/综合/新兴'
    }
    
    print("Starting to fetch conference data...")
    conferences = []
    
    # 设置 GitHub API 认证
    headers = {}
    if 'GITHUB_TOKEN' in os.environ:
        headers = {
            'Authorization': f"Bearer {os.environ['GITHUB_TOKEN']}",
            'Accept': 'application/vnd.github.v3+json'
        }
    
    try:
        # 获取主数据文件
        api_url = "https://raw.githubusercontent.com/ccfddl/ccf-deadlines/main/data/ccf-deadlines.json"
        print(f"Fetching from: {api_url}")
        
        response = requests.get(api_url, headers=headers)
        response.raise_for_status()
        data = response.json()
        
        # 处理每个会议数据
        for conf in data:
            try:
                deadline = conf.get('deadline')
                if deadline and deadline != 'TBD':
                    # 获取分类中文名称
                    category_code = conf.get('type', 'MX')
                    category_name = categories.get(category_code, '其他')
                    
                    conference = {
                        'title': conf['name'],
                        'rank': conf.get('ccf_level', 'N/A'),
                        'category': category_name,
                        'category_code': category_code,
                        'abstract_deadline': conf.get('abstract_deadline'),
                        'submission_deadline': deadline,
                        'conference_date': conf.get('date', 'TBA'),
                        'location': conf.get('place', 'TBA'),
                        'website': conf.get('website', '#'),
                        'link': conf.get('link', '#')
                    }
                    conferences.append(conference)
                    print(f"Successfully processed conference: {conf['name']}")
                    
            except Exception as e:
                print(f"Error processing conference {conf.get('name', 'unknown')}: {str(e)}")
                continue
                
    except Exception as e:
        print(f"Error fetching data: {str(e)}")
        return []
    
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