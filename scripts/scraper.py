import requests
import yaml
import json
from datetime import datetime
import os
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

def fetch_conference_data():
    categories = ['NW', 'DS', 'SC', 'SE', 'DB', 'CT', 'CG', 'AI', 'HI', 'MX']
    
    print("Starting to fetch conference data...")
    conferences = []
    
    # 设置 requests session 和重试机制
    session = requests.Session()
    retry_strategy = Retry(
        total=3,
        backoff_factor=1,
        status_forcelist=[429, 500, 502, 503, 504],
    )
    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("https://", adapter)
    session.mount("http://", adapter)
    
    # 设置 GitHub API 认证
    headers = {}
    if 'GITHUB_TOKEN' in os.environ:
        headers = {
            'Authorization': f"Bearer {os.environ['GITHUB_TOKEN']}",
            'Accept': 'application/vnd.github.v3+json'
        }
    
    # 使用固定的参考日期
    reference_date = datetime(2024, 2, 11)
    current_year = reference_date.year
    
    for category in categories:
        try:
            api_url = f"https://api.github.com/repos/ccfddl/ccf-deadlines/contents/conference/{category}"
            response = session.get(api_url, headers=headers)
            response.raise_for_status()
            files = response.json()
            
            for file in files:
                if file['name'].endswith('.yml'):
                    try:
                        yaml_url = file['download_url']
                        yaml_response = session.get(yaml_url, headers=headers)
                        yaml_response.raise_for_status()
                        
                        conf_list = yaml.safe_load(yaml_response.text)
                        if not conf_list or not isinstance(conf_list, list):
                            continue
                        
                        conf_data = conf_list[0]
                        if not conf_data or 'confs' not in conf_data:
                            continue
                            
                        latest_conf = None
                        latest_year = 0
                        
                        for conf in conf_data['confs']:
                            year = conf.get('year', 0)
                            if year >= current_year and year > latest_year:
                                latest_year = year
                                latest_conf = conf
                        
                        if not latest_conf or 'timeline' not in latest_conf:
                            continue
                        
                        for timeline in latest_conf['timeline']:
                            deadline = timeline.get('deadline')
                            if not deadline or deadline == 'TBD':
                                continue
                                
                            try:
                                deadline_date = datetime.strptime(deadline, '%Y-%m-%d %H:%M:%S')
                                
                                if deadline_date.date() >= reference_date.date():
                                    timezone_str = latest_conf.get('timezone', 'UTC')
                                    
                                    conference = {
                                        'title': conf_data['title'],
                                        'description': conf_data.get('description', ''),
                                        'rank': conf_data['rank']['ccf'],
                                        'category': category,
                                        'submission_deadline': f"{deadline} {timezone_str}",
                                        'conference_date': latest_conf.get('date', 'TBA'),
                                        'location': latest_conf.get('place', 'TBA'),
                                        'website': latest_conf.get('link', '#'),
                                        'year': str(latest_year),
                                        'comment': timeline.get('comment', '')
                                    }
                                    
                                    conferences.append(conference)
                                    print(f"Added: {conf_data['title']} ({latest_year})")
                                    
                            except ValueError:
                                continue
                                
                    except Exception as e:
                        print(f"Error processing {file['name']}: {str(e)}")
                        continue
                        
        except Exception as e:
            print(f"Error processing category {category}: {str(e)}")
            continue
    
    if not conferences:
        print("No conferences were found!")
        return []
    
    conferences.sort(key=lambda x: datetime.strptime(x['submission_deadline'].split(' ')[0], '%Y-%m-%d'))
    print(f"\nTotal conferences found: {len(conferences)}")
    return conferences

def save_data(conferences):
    try:
        os.makedirs('public/data', exist_ok=True)
        file_path = os.path.join('public', 'data', 'conferences.json')
        
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(conferences, f, ensure_ascii=False, indent=2)
            print(f"Successfully saved {len(conferences)} conferences to {file_path}")
            
    except Exception as e:
        print(f"Error saving data: {str(e)}")

if __name__ == "__main__":
    print("Starting conference scraper...")
    conferences = fetch_conference_data()
    if conferences:
        save_data(conferences)
    else:
        print("No conference data was fetched.") 