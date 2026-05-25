# Ghana Tax Filing Assistant

A guided, step-by-step web app that helps Ghanaian taxpayers calculate their tax liability, prepare their documents, and file their returns on GRA's official portal — built for the 2024 filing season.


##  Overview

Filing taxes in Ghana is mandatory, but for many people — salaried workers, freelancers, and small business owners alike — the process is confusing, intimidating, and poorly understood. The Ghana Tax Filing Assistant solves this by walking users through their entire tax situation in plain English, calculating exactly what they owe, and handing them off to GRA's portal ready to file.

No backend. No accounts. No data sent anywhere. Everything runs in the browser.



##  Features

- **Taxpayer Classification** — Identifies whether the user is employed, self-employed, a business owner, or has rental/investment income
- **Guided Income Entry** — Shows only the relevant income fields based on the user's situation
- **Relief & Deductions Calculator** — Applies personal, child education, marriage, old age, and disability reliefs under Ghana's Income Tax Act
- **2024 GRA Tax Band Calculator** — Accurately calculates tax liability using the latest PAYE bands and shows balance due or refund owed
- **Personalized Document Checklist** — Generates a tailored list of documents the user needs to gather before filing
- **Step-by-Step Filing Guide** — Walks the user through GRA's taxpayersportal.com with their key figures formatted and ready to enter
- **Fully Client-Side** — No data is stored or transmitted; everything stays on the user's device



##  Tech Stack Used

| Layer | Technology |
|---|---|
| Framework | React |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Icons | Lucide React |
| Language | JavaScript (ES6+) |
| Backend | None — fully client-side |



##  Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/theodanielsjr101/Ghana-Tax-Filing-Assistant.git

# Navigate into the project
cd ghana-tax-filing-assistant

# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.



##  App Flow

```
Step 1 → Taxpayer Type
Step 2 → Personal Details
Step 3 → Income Sources
Step 4 → Reliefs & Deductions
Step 5 → Tax Calculation
Step 6 → Document Checklist
Step 7 → Filing Guide → taxpayersportal.com
```



##  Contributing

All contributions are welcome! Here's what you need to know:

**You'll need to be comfortable with:**
- React (hooks, component state)
- JavaScript (ES6+)
- Tailwind CSS

Good first issues to tackle:
-  Adding a **Twi / Pidgin language toggle** for accessibility for all comfortable with local languages
-  Improving mobile responsiveness
-  Updating tax bands when GRA releases new figures

**To contribute:**
1. Fork the repository
2. Create a new branch
3. Make your changes
4. Open a pull request with a clear description of what you changed and why



##  Disclaimer

This tool is for **guidance only**. Tax figures and reliefs are based on publicly available GRA information for the 2024 filing year. Always verify your figures with a licensed tax practitioner or the Ghana Revenue Authority directly before submitting your return.

**Official GRA Filing Portal:** [taxpayersportal.com](https://taxpayersportal.com)
**GRA Helpline:** 0800 900 110




##  Developed By

**Theo Daniels**
University of Ghana

---

*Taxes are the lifeblood of the nation. By filing your tax returns honestly and on time, you are helping build a better Ghana for us all. — GRA*


# Screenshots

## Taxpayer Type
The first screen asks users to identify their income situation by selecting from five categories: Salaried/Employed, Self-Employed/Freelancer, Business Owner/Director, Rental Income, or Investment Income. Multiple selections are supported, and the app uses these choices to customize every subsequent step showing only the income fields, reliefs, and documents relevant to the user's specific tax situation.

<img width="1901" height="987" alt="Screenshot (125)" src="https://github.com/user-attachments/assets/6ad5c295-05df-47d7-9e70-663d7cd48287" />


## Personal Taxpayer Details
Users enter their identification and tax jurisdiction details, including their full name, Tax Reference Identifier (Ghana Card PIN or TIN), tax year being assessed, region of residence, and local GRA Taxpayer Service Centre. A prominent privacy notice reassures users that all data is processed entirely within their browser nothing is stored, cached, or transmitted to any external server. Once a name is entered, it appears in the app header and persists throughout the rest of the journey.

<img width="1901" height="984" alt="Screenshot (126)" src="https://github.com/user-attachments/assets/602faf48-66ae-4fe3-a64f-06948f551f13" />



## Income Sources
Users declare their annual income in Ghanaian Cedis (GH¢) based on the taxpayer types selected in Step 1. Salaried employees enter their annual gross salary and total PAYE tax already deducted by their employer (from their P9 form). Users with multiple income streams can add additional sources. Self-Employed/Freelancer, Rental Income, or Investment Income each revealing its own relevant input fields. All figures are entered on a yearly basis.

<img width="1906" height="982" alt="Screenshot (127)" src="https://github.com/user-attachments/assets/67ad23e4-0b7d-4749-905c-4d62e873fe97" />



## Reliefs & Deductions
Based on the Ghana Income Tax Act, 2015 (Act 896), users can claim all tax reliefs they are entitled to. The Personal Relief (GH¢4,320/year) is automatically applied for every registered taxpayer. Users can then select any additional reliefs that apply to their situation. Child Education Relief (GH¢600 per child, up to 3 children), Marriage/Spouse Dependent Relief (GH¢200/year), Old Age/Senior Tax Relief (GH¢1,500/year for those 60 and above), and Disability Relief (25% of employment/business income). A real-time running total shows the combined deductible amount that will be subtracted from the user's chargeable income.

<img width="1898" height="987" alt="Screenshot (128)" src="https://github.com/user-attachments/assets/20190f8c-6d24-4f6b-9995-50cb9921066a" />


## Tax Computation Breakdown
The most detailed screen in the app, this step presents a full tax assessment based on the 2024 GRA annual tax schedule. It displays four key figures at a glance; Total Income, Total Reliefs, Chargeable Income, and Computed Tax Liability followed by a detailed GRA Tax Band Computation table showing exactly how each portion of the user's chargeable income is taxed across Ghana's six tax brackets (0% through 35%). An Income vs. Tax Composition chart visualizes the relationship between gross income, reliefs, chargeable income, already paid PAYE, and final tax liability. The screen concludes with the calculated balance due or refund owed after deducting any PAYE already paid by the employer.

<img width="1901" height="987" alt="Screenshot (129)" src="https://github.com/user-attachments/assets/226a621c-fb48-4f0f-bdd7-11703de4365a" />


## Personalized Document Checklist
Before heading to GRA's portal, users are shown a tailored checklist of all documents they need to have on hand, generated based on their income type and tax situation. Each item can be ticked off as it is gathered, with a live preparation progress bar tracking completion. For salaried employees, the checklist includes the National ID/Ghana Card or active TIN, yearly bank statements or accounting summaries, and the GRA P9 Tax Certificate from their employer. Once all items are checked, a confirmation banner appears and the user is prompted to proceed to the Filing Guide.

<img width="1893" height="992" alt="Screenshot (130)" src="https://github.com/user-attachments/assets/6a1699d7-121a-447b-b43f-63cfa2347547" />


## GRA Portal Filing Guide
The final step bridges the app and GRA's official portal. Users are walked through five clear steps to submit their return on taxpayersportal.com from accessing the portal and logging in with their Ghana Card PIN or TIN, to initiating the return, entering their figures, and submitting. A Portal Copy Convenience Desk displays all the user's computed values (Full Name, Ghana Card PIN, Assessment Year, Total Income, Tax Reliefs, Chargeable Income, Tax Liability, PAYE Already Paid, and Balance Payable) with individual one-click copy buttons for each field, making it effortless to transfer figures into GRA's forms without errors. Users can then proceed directly to the GRA portal or start over to file another return.

<img width="1893" height="994" alt="Screenshot (131)" src="https://github.com/user-attachments/assets/1142b137-e3f6-4dfb-8e53-03c493b54a55" />










