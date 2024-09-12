from flask import Flask, render_template, request, jsonify
from whatsmyname import check_site, generate_html_report, generate_excel_report, generate_pdf_report
import requests
import json
from concurrent.futures import ThreadPoolExecutor, as_completed

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search():
    username = request.json['username']
    
    # Fetch wmn-data from WhatsMyName repository
    response = requests.get("https://raw.githubusercontent.com/WebBreacher/WhatsMyName/main/wmn-data.json")
    data = response.json()
    sites = data["sites"]

    headers = {
        "Accept": "text/html, application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "accept-language": "en-US;q=0.9,en,q=0,8",
        "accept-encoding": "gzip, deflate",
        "user-Agent": "Mozilla/5.0 (Windows NT 10.0;Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
    }

    found_sites = []

    with ThreadPoolExecutor(max_workers=20) as executor:
        futures = {executor.submit(check_site, site, username, headers): site for site in sites}

        for future in as_completed(futures):
            try:
                result = future.result()
                if result:
                    site_name, uri_check = result
                    found_sites.append({"name": site_name, "url": uri_check})
            except:
                pass

    # Generate reports
    html_filename = generate_html_report(username, found_sites)
    excel_filename = generate_excel_report(username, found_sites)
    pdf_filename = generate_pdf_report(username, found_sites)

    return jsonify({
        "found_sites": found_sites,
        "html_report": html_filename,
        "excel_report": excel_filename,
        "pdf_report": pdf_filename
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
