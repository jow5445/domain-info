# DNS Lookup Tool

A responsive DNS Lookup Tool built with HTML, CSS, and Vanilla JavaScript. The application allows users to look up different DNS record types, view simulated DNS information, copy lookup results, and store recent searches locally in the browser.

This project is ideal as a frontend template for a real DNS lookup service or for learning how DNS records work.

---

## Preview
<img width="3840" height="2160" alt="paint-sample-ss" src="https://cdn.hackclub.com/019f3f95-1bc0-7695-864a-4c222f7d0c49/TextToSpeechApp.png" />


## Features

- Lookup DNS records for any domain
- Supports multiple DNS record types:
  - A
  - AAAA
  - MX
  - CNAME
  - TXT
  - NS
  - SOA
  - PTR
- Copy lookup results to the clipboard
- Local lookup history
- Responsive layout for desktop and mobile
- Clean and simple interface
- No frameworks required

---

## Technologies

- HTML5
- CSS3
- JavaScript (ES6)
- Local Storage API
- Font Awesome

---

## Project Structure

```
dns-lookup-tool/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

---

## Getting Started

Clone the repository:

```bash
git clone https://github.com/jow5445/domain-info
```

Open the project folder:

```bash
cd dns-lookup-tool
```

Then open `index.html` in your web browser.

No installation or additional dependencies are required.

---

## Usage

1. Enter a domain name (for example, `example.com`).
2. Choose the DNS record type.
3. Click **Lookup**.
4. View the DNS records.
5. Copy the results if needed.
6. Access previous searches from the lookup history.

---

## Current Implementation

The current version generates simulated DNS records for demonstration purposes.

To use real DNS data, replace the simulated lookup function in `script.js` with a DNS API such as:

- Google DNS over HTTPS
- Cloudflare DNS over HTTPS
- A custom backend service

---

## Future Improvements

- Real DNS API integration
- WHOIS lookup
- DNS propagation checker
- Export results as JSON or CSV
- Dark mode
- DNSSEC support
- Response time statistics

---

## License

This project is licensed under the MIT License.

---

## Author

Jow

GitHub: https://github.com/jow5445