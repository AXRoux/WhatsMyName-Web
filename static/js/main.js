document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('input');
    const output = document.getElementById('output');
    const loading = document.getElementById('loading');
    const results = document.getElementById('results');
    const resultsList = document.getElementById('resultsList');
    const reports = document.getElementById('reports');
    const htmlReportLink = document.getElementById('htmlReportLink');
    const excelReportLink = document.getElementById('excelReportLink');
    const pdfReportLink = document.getElementById('pdfReportLink');

    // Hide loading animation when the page initially loads
    loading.classList.add('hidden');

    function typeWriter(text, element, speed = 50) {
        let i = 0;
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    input.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
            const username = input.value.trim();
            if (username) {
                const commandLine = document.createElement('div');
                commandLine.innerHTML = `<span class="prompt">$</span> `;
                output.appendChild(commandLine);
                typeWriter(username, commandLine, 20);

                input.value = '';
                results.classList.add('hidden');
                reports.classList.add('hidden');
                resultsList.innerHTML = '';

                const searchLine = document.createElement('div');
                output.appendChild(searchLine);
                typeWriter('Conducting OSINT...', searchLine, 20);

                try {
                    // Show loading animation just before the fetch request
                    loading.classList.remove('hidden');

                    const response = await fetch('/search', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ username }),
                    });

                    const data = await response.json();

                    // Hide loading animation as soon as we get the response
                    loading.classList.add('hidden');

                    results.classList.remove('hidden');

                    if (data.found_sites.length > 0) {
                        data.found_sites.forEach(site => {
                            const li = document.createElement('li');
                            li.innerHTML = `<a href="${site.url}" target="_blank">${site.name}</a>`;
                            resultsList.appendChild(li);
                        });

                        reports.classList.remove('hidden');
                        htmlReportLink.href = `/static/${data.html_report}`;
                        excelReportLink.href = `/static/${data.excel_report}`;
                        pdfReportLink.href = `/static/${data.pdf_report}`;
                    } else {
                        resultsList.innerHTML = '<li>No sites found for this username.</li>';
                    }

                    const resultLine = document.createElement('div');
                    output.appendChild(resultLine);
                    typeWriter(`Search completed for ${username}`, resultLine, 20);
                } catch (error) {
                    console.error('Error:', error);
                    // Hide loading animation in case of an error
                    loading.classList.add('hidden');
                    const errorLine = document.createElement('div');
                    errorLine.classList.add('error');
                    output.appendChild(errorLine);
                    typeWriter('An error occurred during the search.', errorLine, 20);
                }
            }
        }
    });
});
