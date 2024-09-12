document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const input = document.getElementById('input');
    const output = document.getElementById('output');
    const loading = document.getElementById('loading');
    const results = document.getElementById('results');
    const resultsList = document.getElementById('resultsList');
    const reports = document.getElementById('reports');
    const htmlReportLink = document.getElementById('htmlReportLink');
    const excelReportLink = document.getElementById('excelReportLink');
    const pdfReportLink = document.getElementById('pdfReportLink');
    const csvReportLink = document.getElementById('csvReportLink');

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

    input.addEventListener('keydown', (e) => {
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

                loading.classList.remove('hidden');

                socket.emit('search', { username });
            }
        }
    });

    socket.on('site_found', (site) => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${site.url}" target="_blank">${site.name}</a>`;
        resultsList.appendChild(li);
        results.classList.remove('hidden');
    });

    socket.on('search_complete', (data) => {
        loading.classList.add('hidden');

        reports.classList.remove('hidden');
        htmlReportLink.href = `/static/${data.html_report}`;
        excelReportLink.href = `/static/${data.excel_report}`;
        pdfReportLink.href = `/static/${data.pdf_report}`;
        csvReportLink.href = `/static/${data.csv_report}`;

        const resultLine = document.createElement('div');
        output.appendChild(resultLine);
        typeWriter(`Search completed for ${input.value}`, resultLine, 20);
    });
});
