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
    const eyeIcon = document.getElementById('eye-icon');

    loading.classList.add('hidden');

    let isExecutingCommand = false;

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

    function clearTerminal() {
        output.innerHTML = '';
        results.classList.add('hidden');
        reports.classList.add('hidden');
        resultsList.innerHTML = '';
        htmlReportLink.href = '#';
        excelReportLink.href = '#';
        pdfReportLink.href = '#';
    }

    function executeCommand(command) {
        isExecutingCommand = true;

        const commandLine = document.createElement('div');
        commandLine.innerHTML = `<span class="prompt">$</span> `;
        output.appendChild(commandLine);
        typeWriter(command, commandLine, 20);

        input.value = '';
        results.classList.add('hidden');
        reports.classList.add('hidden');
        resultsList.innerHTML = '';

        htmlReportLink.href = '#';
        excelReportLink.href = '#';
        pdfReportLink.href = '#';

        if (command === 'help') {
            const helpLine = document.createElement('div');
            output.appendChild(helpLine);
            typeWriter('Available commands: clear, help, [username]', helpLine, 20);
            isExecutingCommand = false;
        } else if (command === 'clear') {
            clearTerminal();
            isExecutingCommand = false;
        } else {
            const searchLine = document.createElement('div');
            output.appendChild(searchLine);
            typeWriter('Conducting OSINT...', searchLine, 20);

            loading.classList.remove('hidden');

            socket.emit('search', { username: command });
        }
    }

    function showExecutionBlockedMessage() {
        const messageLine = document.createElement('div');
        messageLine.classList.add('error-message');
        output.appendChild(messageLine);
        typeWriter('Command execution blocked. Please wait for the current command to finish.', messageLine, 20);
    }

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const command = input.value.trim().toLowerCase();
            if (command && !isExecutingCommand) {
                executeCommand(command);
            } else if (isExecutingCommand) {
                showExecutionBlockedMessage();
            }
        }
    });

    eyeIcon.addEventListener('click', () => {
        if (input.type === 'password') {
            input.type = 'text';
            eyeIcon.classList.remove('fa-eye-slash');
            eyeIcon.classList.add('fa-eye');
        } else {
            input.type = 'password';
            eyeIcon.classList.remove('fa-eye');
            eyeIcon.classList.add('fa-eye-slash');
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

        const resultLine = document.createElement('div');
        output.appendChild(resultLine);
        const sitesFound = resultsList.children.length;
        typeWriter(`Search Completed. Found ${sitesFound} site${sitesFound !== 1 ? 's' : ''}.`, resultLine, 20);

        isExecutingCommand = false;
    });

    socket.on('error', (error) => {
        const errorLine = document.createElement('div');
        output.appendChild(errorLine);
        typeWriter(`Error: ${error.message}`, errorLine, 20);
        isExecutingCommand = false;
    });
});
