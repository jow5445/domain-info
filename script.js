document.addEventListener('DOMContentLoaded', function () {

    const domainInput = document.getElementById('domain-input');
    const lookupBtn = document.getElementById('lookup-btn');
    const recordTypes = document.querySelectorAll('.record-type');
    const resultsContainer = document.getElementById('results-container');
    const resultsBody = document.getElementById('results-body');
    const errorMessage = document.getElementById('error-message');
    const loader = document.querySelector('.loader');
    const copyResultsBtn = document.getElementById('copy-results');
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history');

    let currentRecordType = 'A';

    let lookupHistory = JSON.parse(localStorage.getItem('dnsLookupHistory')) || [];
    renderHistory();

    lookupBtn.addEventListener('click', performLookup);
    domainInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') performLookup();
    });

    recordTypes.forEach(type => {
        type.addEventListener('click', function () {
            recordTypes.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentRecordType = this.dataset.type;

            // If there's already a domain in the input, perform lookup
            if (domainInput.value.trim()) {
                performLookup();
            }
        });
    });

    copyResultsBtn.addEventListener('click', copyResultsToClipboard);
    clearHistoryBtn.addEventListener('click', clearHistory);

    function performLookup() {
        const domain = domainInput.value.trim();

        if (!domain) {
            showError('Please enter a domain name');
            return;
        }

        if (!isValidDomain(domain)) {
            showError('Please enter a valid domain name');
            return;
        }

        loader.style.display = 'block';
        resultsContainer.style.display = 'none';
        errorMessage.style.display = 'none';

        setTimeout(() => {
            try {
                const results = simulateDnsLookup(domain, currentRecordType);
                displayResults(results);
                addToHistory(domain, currentRecordType);
            } catch (error) {
                showError(error.message);
            } finally {
                loader.style.display = 'none';
            }
        }, 800);
    }

    function simulateDnsLookup(domain, type) {

        const randomIP = () => `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
        const randomIPv6 = () => {
            const segments = [];
            for (let i = 0; i < 8; i++) {
                segments.push(Math.floor(Math.random() * 65535).toString(16));
            }
            return segments.join(':');
        };

        const results = [];
        const now = new Date();

        switch (type) {
            case 'A':
                results.push({
                    type: 'A',
                    name: domain,
                    value: randomIP(),
                    ttl: '3600'
                });
                results.push({
                    type: 'A',
                    name: domain,
                    value: randomIP(),
                    ttl: '3600'
                });
                break;
            case 'AAAA':
                results.push({
                    type: 'AAAA',
                    name: domain,
                    value: randomIPv6(),
                    ttl: '3600'
                });
                break;
            case 'MX':
                results.push({
                    type: 'MX',
                    name: domain,
                    value: `10 mail.${domain}`,
                    ttl: '14400'
                });
                results.push({
                    type: 'MX',
                    name: domain,
                    value: `20 backup.${domain}`,
                    ttl: '14400'
                });
                break;
            case 'CNAME':
                results.push({
                    type: 'CNAME',
                    name: `www.${domain}`,
                    value: domain,
                    ttl: '86400'
                });
                break;
            case 'TXT':
                results.push({
                    type: 'TXT',
                    name: domain,
                    value: '"v=spf1 include:_spf.google.com ~all"',
                    ttl: '3600'
                });
                results.push({
                    type: 'TXT',
                    name: domain,
                    value: '"google-site-verification=ABC123XYZ"',
                    ttl: '3600'
                });
                break;
            case 'NS':
                results.push({
                    type: 'NS',
                    name: domain,
                    value: `ns1.${domain}`,
                    ttl: '172800'
                });
                results.push({
                    type: 'NS',
                    name: domain,
                    value: `ns2.${domain}`,
                    ttl: '172800'
                });
                break;
            case 'SOA':
                results.push({
                    type: 'SOA',
                    name: domain,
                    value: `ns1.${domain} hostmaster.${domain} ${now.getFullYear()}010100 3600 1800 604800 86400`,
                    ttl: '3600'
                });
                break;
            case 'PTR':
                results.push({
                    type: 'PTR',
                    name: '1.0.0.10.in-addr.arpa',
                    value: domain,
                    ttl: '3600'
                });
                break;
            default:
                throw new Error(`Unsupported record type: ${type}`);
        }

        updateDomainInfo(domain);

        return results;
    }

    function updateDomainInfo(domain) {

        const registrars = ['GoDaddy', 'Namecheap', 'Google Domains', 'Cloudflare', 'Name.com'];
        const isps = ['Cloudflare', 'Amazon AWS', 'Google Cloud', 'Microsoft Azure', 'DigitalOcean'];
        const locations = ['New York, US', 'London, UK', 'Tokyo, JP', 'Sydney, AU', 'Frankfurt, DE'];

        const now = new Date();
        const createdDate = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
        const expiresDate = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());

        document.getElementById('domain-registrar').textContent = `Registrar: ${registrars[Math.floor(Math.random() * registrars.length)]}`;
        document.getElementById('domain-created').textContent = `Created: ${createdDate.toLocaleDateString()}`;
        document.getElementById('domain-expires').textContent = `Expires: ${expiresDate.toLocaleDateString()}`;

        document.getElementById('server-ip').textContent = `IP: ${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
        document.getElementById('server-location').textContent = `Location: ${locations[Math.floor(Math.random() * locations.length)]}`;
        document.getElementById('server-isp').textContent = `ISP: ${isps[Math.floor(Math.random() * isps.length)]}`;
    }

    function displayResults(results) {
        resultsBody.innerHTML = '';

        results.forEach(result => {
            const row = document.createElement('tr');

            const typeCell = document.createElement('td');
            typeCell.textContent = result.type;
            row.appendChild(typeCell);

            const nameCell = document.createElement('td');
            nameCell.textContent = result.name;
            row.appendChild(nameCell);

            const valueCell = document.createElement('td');
            valueCell.textContent = result.value;
            row.appendChild(valueCell);

            const ttlCell = document.createElement('td');
            ttlCell.textContent = result.ttl;
            row.appendChild(ttlCell);

            resultsBody.appendChild(row);
        });

        resultsContainer.style.display = 'block';
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        loader.style.display = 'none';
    }

    function isValidDomain(domain) {
        return /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(domain);
    }

    function copyResultsToClipboard() {
        const table = document.getElementById('result-table');
        let textToCopy = 'DNS Lookup Results\n\n';

        const headers = table.querySelectorAll('th');
        textToCopy += Array.from(headers).map(header => header.textContent).join('\t') + '\n';

        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            textToCopy += Array.from(cells).map(cell => cell.textContent).join('\t') + '\n';
        });

        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = copyResultsBtn.innerHTML;
            copyResultsBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyResultsBtn.innerHTML = originalText;
            }, 2000);
        });
    }

    function addToHistory(domain, type) {
        const existingIndex = lookupHistory.findIndex(
            item => item.domain === domain && item.type === type
        );

        if (existingIndex !== -1) {
            lookupHistory.splice(existingIndex, 1);
        }

        lookupHistory.unshift({
            domain,
            type,
            timestamp: new Date().toISOString()
        });

        if (lookupHistory.length > 10) {
            lookupHistory = lookupHistory.slice(0, 10);
        }

        localStorage.setItem('dnsLookupHistory', JSON.stringify(lookupHistory));

        renderHistory();
    }

    function renderHistory() {
        if (lookupHistory.length === 0) {
            historyList.innerHTML = '<li class="empty-history">No lookup history yet</li>';
            return;
        }

        historyList.innerHTML = '';

        lookupHistory.forEach(item => {
            const historyItem = document.createElement('li');
            historyItem.className = 'history-item';

            const domainSpan = document.createElement('span');
            domainSpan.className = 'domain';
            domainSpan.textContent = `${item.domain} (${item.type})`;

            const timeSpan = document.createElement('span');
            timeSpan.className = 'time';
            timeSpan.textContent = new Date(item.timestamp).toLocaleString();

            historyItem.appendChild(domainSpan);
            historyItem.appendChild(timeSpan);

            historyItem.addEventListener('click', () => {
                domainInput.value = item.domain;
                recordTypes.forEach(t => {
                    t.classList.toggle('active', t.dataset.type === item.type);
                });
                currentRecordType = item.type;
                performLookup();
            });

            historyList.appendChild(historyItem);
        });
    }

    function clearHistory() {
        if (confirm('Are you sure you want to clear your lookup history?')) {
            lookupHistory = [];
            localStorage.removeItem('dnsLookupHistory');
            renderHistory();
        }
    }
});