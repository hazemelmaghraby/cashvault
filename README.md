# 💰 CashVault

> A modern personal finance management application built to help users track, organize, and understand their financial activity through wallets, transactions, categories, dashboards, and reports.

![CashVault](https://img.shields.io/badge/CashVault-Personal%20Finance-amber)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react\&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript\&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?logo=vite\&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-Latest-06B6D4?logo=tailwindcss\&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase\&logoColor=black)

---

## 📌 Overview

**CashVault** is a full-stack personal finance management application designed around a simple idea:

> **Give users a clear, structured, and reliable view of their money.**

The application allows users to manage their financial wallets, record income and expenses, perform wallet-to-wallet transfers, organize transactions using categories, and monitor their financial activity through a centralized dashboard.

The project focuses heavily on:

* Clean and responsive UI
* Reusable React components
* Strong data relationships
* Financial consistency
* Authentication and user-specific data
* Clear transaction history
* Extensible architecture
* Modern fintech-inspired visual design

CashVault uses a **dark, elegant black-and-gold visual identity** with subtle glassmorphism, gradients, responsive layouts, and carefully structured information hierarchy.

---

# ✨ Features

## 🔐 Authentication

CashVault uses Firebase Authentication to provide secure user authentication.

Users can:

* Sign in to their account
* Access their personal finance data
* Have their data associated with their authenticated account
* Access protected application routes
* Be shown appropriate authentication states when not signed in

Protected areas of the application prevent unauthenticated users from accessing personal financial information.

---

# 💳 Wallet Management

Wallets represent the different places where a user's money is stored.

Examples include:

* Cash
* Bank accounts
* Debit cards
* Savings accounts
* Other financial accounts

### Wallet functionality

CashVault supports:

* Creating wallets
* Reading wallet information
* Updating wallet information
* Deleting wallets
* Wallet validation
* Confirmation before destructive operations
* Persistent wallet data
* Automatic balance management
* Reusable wallet state through custom hooks/context

Each wallet maintains its own balance and can be associated with multiple transactions.

---

# 💸 Transaction Management

Transactions are one of the core features of CashVault.

The application supports three primary transaction types:

### Income

Money entering a wallet.

Example:

```text
Salary → Bank Account
```

### Expense

Money leaving a wallet.

Example:

```text
Bank Account → Food
```

### Transfer

Money moving between two wallets.

Example:

```text
Checking Account → Savings Account
```

Transfers are treated differently from income and expenses because they move money between internal wallets rather than representing an external gain or loss.

---

## Transaction Information

A transaction can contain information such as:

* Transaction ID
* Title
* Type
* Amount
* Currency
* Description
* Category
* Wallet
* Destination wallet
* Transaction date
* Status
* Balance before
* Balance after
* Receipt
* Creation timestamp
* Last update timestamp

The transaction model is designed to support future financial auditing and reporting functionality.

---

# 🔄 Wallet Balance Updates

CashVault automatically updates wallet balances when transactions are created.

For example:

```text
Wallet Balance
      ↓
Transaction
      ↓
Balance Adjustment
      ↓
Updated Wallet Balance
```

### Income

```text
New Balance = Previous Balance + Amount
```

### Expense

```text
New Balance = Previous Balance - Amount
```

### Transfer

```text
Source Wallet
    ↓
Amount deducted

Destination Wallet
    ↓
Amount added
```

Transfers therefore maintain consistency between the source and destination wallets.

---

# 🏷️ Categories

Transactions can be organized using categories.

Examples include:

* Food
* Transportation
* Bills
* Entertainment
* Shopping
* Salary
* Other financial categories

Categories make it easier to:

* Filter transactions
* Understand spending patterns
* Generate reports
* Group financial activity
* Build future analytics functionality

The category system is designed to remain extensible as the application grows.

---

# 📊 Dashboard

The dashboard provides a high-level overview of the user's financial activity.

It is designed to answer questions such as:

* How much money came in?
* How much money was spent?
* What is the current financial activity?
* What are the most recent transactions?
* How are income and expenses changing?

The dashboard includes:

* Financial totals
* Recent transactions
* Income vs. expense visualization
* Wallet information
* Financial activity summaries

Charts are implemented using **Recharts**.

---

# 🔎 Transaction Search & Filtering

The Transactions page provides tools for quickly finding specific transactions.

Users can search by transaction title and filter transactions by:

* Wallet
* Category
* Transaction type

Available transaction types include:

```text
All Types
Income
Expense
Transfer
```

Wallet and category filters dynamically use the user's existing wallets and categories.

---

# ↕️ Transaction Sorting

Transactions can be sorted using multiple methods:

* Newest
* Oldest
* Highest Amount
* Lowest Amount

This makes it easier to inspect large transaction histories.

---

# 🔍 Transaction Details

Each transaction is represented by a compact transaction card.

Instead of displaying every piece of information directly on the card, the card provides a:

> **More Details**

button.

Selecting it opens a detailed transaction modal.

The modal provides a complete view of the transaction, including:

### Transaction information

* Transaction type
* Title
* Amount
* Category
* Wallet
* Destination wallet
* Currency
* Status
* Balance before
* Balance after
* Transaction date

### Description

If a transaction contains a description, it is displayed in a dedicated section.

### System information

The modal also exposes:

* Transaction ID
* Created timestamp
* Last updated timestamp

### Receipt

If a receipt is attached, the user can access it directly from the transaction details modal.

### Actions

Destructive and secondary actions are kept inside the details view:

* View Receipt
* Delete Transaction
* Close

This keeps the transaction list clean while still making complete transaction information available when needed.

---

# 🧾 Receipts

Transactions can contain receipt information.

Receipt functionality is designed to allow users to associate supporting documentation with their financial transactions.

The transaction details view indicates whether a receipt is attached.

When a receipt exists, users can select:

```text
View Receipt
```

which routes to the corresponding receipt view.

---

# 📑 Periodic Reports

CashVault includes a dedicated reports section designed for financial analysis over time.

The Transactions page provides direct access to:

```text
Periodic Reports
```

The reporting system is intended to provide financial summaries across selected periods such as:

* Daily
* Weekly
* Monthly
* Custom periods

Reports are designed to build upon the existing transaction data model.

---

# 🎨 Design System

CashVault follows a dedicated fintech-inspired visual language.

## Color Direction

The primary visual identity is based around:

```text
Black / Dark surfaces
        +
Gold / Amber accent
        +
Subtle gradients
        +
Glass-like surfaces
```

CSS variables are used throughout the application to maintain visual consistency.

Examples include:

```css
--background
--surface
--surface-elevated
--border
--border-hover
--text-primary
--text-secondary
--text-muted
--accent
--accent-hover
--income
--expense
```

This allows the application theme to be changed without manually modifying every component.

---

# 📱 Responsive Design

CashVault is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile

The layout adapts based on screen size.

### Desktop / Tablet

The application uses:

* Sidebar navigation
* Top navigation bar
* Expanded content area

### Mobile

The desktop sidebar is replaced by a:

> Mobile bottom navigation

This keeps the primary navigation accessible without consuming valuable screen space.

---

# 🧭 Application Layout

The main application layout is responsible for:

* Authentication state
* Global navigation
* Sidebar
* Topbar
* Current page information
* User profile information
* Role styling
* Responsive navigation
* Page rendering through React Router

The layout uses React Router's:

```tsx
<Outlet />
```

to render nested application pages.

---

# 👤 User Profiles & Roles

CashVault's interface supports role-aware styling.

The current role styling system supports:

```text
User
Moderator
Staff
Administrator
Owner
```

Each role can have its own:

* Label
* Avatar styling
* Accent color
* Active navigation styling
* Background glow

This architecture leaves room for future role-based permissions and administrative functionality.

---

# 🏗️ Architecture

CashVault follows a feature-oriented React architecture.

A simplified structure looks like:

```text
src/
│
├── assets/
│
├── components/
│   ├── constants/
│   ├── layout/
│   └── ui/
│
├── context/
│
├── features/
│   ├── Dashboard/
│   ├── LandingPage/
│   ├── Transactions/
│   ├── Wallets/
│   └── ...
│
├── hooks/
│
├── utils/
│
├── App.tsx
└── main.tsx
```

The application separates:

* UI components
* Feature-specific logic
* Data models
* Context providers
* Custom hooks
* Utility functions
* Application routing

This makes individual features easier to develop and maintain.

---

# 🧩 Reusable Components

CashVault uses reusable UI components instead of repeatedly implementing UI elements.

Examples include:

```text
Button
Card
Input
Select
Modal
Loading
Sidebar
```

For example:

```tsx
<Button>
  Add Transaction
</Button>
```

rather than recreating button styling throughout the application.

This provides:

* Consistent UI
* Less duplicated code
* Easier maintenance
* Faster feature development
* Centralized styling

---

# 🪝 Custom Hooks

Application-specific logic is separated into reusable hooks.

Examples include:

```tsx
useWallet()
useTransaction()
useCategory()
useAuth()
```

These hooks allow components to access application state without needing to understand the underlying implementation.

For example:

```tsx
const { wallets } = useWallet();
```

or:

```tsx
const {
  transactions,
  addTransaction,
  transferMoney,
  removeTransaction,
} = useTransaction();
```

This keeps feature components focused primarily on presentation and user interaction.

---

# 🔥 Firebase

Firebase is used as the backend infrastructure for CashVault.

The application uses Firebase functionality for:

* Authentication
* Firestore database
* Persistent application data
* User-specific financial information

Firestore provides the persistent storage layer for application entities such as:

```text
Users
Wallets
Transactions
Categories
```

---

# 🗄️ Data Model

The transaction model is structured around relationships between financial entities.

A simplified transaction structure is:

```ts
interface Transaction {
  id: string;
  type: "income" | "expense" | "transfer";
  walletId: string;
  title: string;
  amount: number;
  description?: string;
  categoryId: string;
  date: Date | string;
  toWalletId?: string;
  receiptUrl?: string;
  receiptId?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  currency: string;
  status?: string;
  balanceBefore?: number;
  balanceAfter?: number;
}
```

### Relationships

```text
User
 │
 ├── Wallets
 │     │
 │     └── Transactions
 │
 ├── Categories
 │
 └── Financial activity
```

Transfers additionally connect two wallets:

```text
Source Wallet
      │
      │ Transaction
      ↓
Destination Wallet
```

---

# 🔐 Data Security

Because CashVault handles financial information, data isolation is an important part of the architecture.

Firebase Authentication identifies the current user, while Firestore security rules are intended to ensure users can only access the data they are authorized to access.

The application should never rely solely on frontend checks for security.

Frontend checks such as:

```tsx
if (!user) {
  return <PleaseSignInPage />;
}
```

are primarily for user experience.

Actual authorization must be enforced by backend/database security rules.

---

# ⚙️ Tech Stack

## Frontend

| Technology      | Purpose                   |
| --------------- | ------------------------- |
| React           | UI framework              |
| TypeScript      | Type safety               |
| Vite            | Development/build tooling |
| Tailwind CSS    | Styling                   |
| React Router    | Routing                   |
| Recharts        | Financial charts          |
| GSAP            | Page/list animations      |
| Framer Motion   | UI animation              |
| React Hook Form | Form handling             |

## Backend / Infrastructure

| Technology              | Purpose             |
| ----------------------- | ------------------- |
| Firebase Authentication | User authentication |
| Firebase Firestore      | Database            |
| Firebase Security Rules | Data authorization  |

---

# 📦 Installation

## 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/cashvault.git
```

Enter the project:

```bash
cd cashvault
```

---

## 2. Install dependencies

```bash
npm install
```

---

## 3. Configure Firebase

Create a Firebase project and enable:

* Firebase Authentication
* Cloud Firestore

Create a Firebase web application and obtain its configuration values.

Create a local environment file:

```text
.env
```

Add the required Firebase variables:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> Never commit your `.env` file or private credentials to GitHub.

---

# 🚀 Running the Project

Start the development server:

```bash
npm run dev
```

Vite will provide a local development URL, typically:

```text
http://localhost:5173
```

---

# 🏭 Production Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

# 🧪 Development Philosophy

CashVault is being developed with a focus on maintainability rather than simply making features work.

The project emphasizes:

### Separation of concerns

Business logic should not be tightly coupled to presentation components.

### Reusability

Common UI and application logic should be reusable.

### Type safety

TypeScript is used to reduce runtime errors and make application models explicit.

### Consistency

Financial operations should produce predictable results.

### Responsive design

Features should remain usable across screen sizes.

### Extensibility

The architecture should allow new financial features to be added without rewriting the existing application.

---

# 📈 Current Development Status

CashVault is actively being developed.

## Foundation

* [x] Project setup
* [x] Routing
* [x] Reusable UI components
* [x] Theme/layout system
* [x] Feature-oriented folder structure

## Wallets

* [x] Wallet CRUD
* [x] Wallet validation
* [x] Delete confirmation
* [x] Persistent wallet storage
* [x] Wallet state management
* [x] Balance management

## Transactions

* [x] Transaction data model
* [x] Transaction creation
* [x] Transaction reading
* [x] Wallet selection
* [x] Category selection
* [x] Income transactions
* [x] Expense transactions
* [x] Transfer transactions
* [x] Automatic wallet balance updates
* [x] Persistent transaction data
* [x] Transaction search
* [x] Transaction filtering
* [x] Transaction sorting
* [x] Transaction details modal
* [x] Receipt access
* [x] Transaction deletion

## Dashboard

* [x] Financial totals
* [x] Recent transactions
* [x] Income/expense visualization
* [x] Wallet information

## Reports

* [x] Reports section
* [x] Advanced reporting
* [ ] More detailed financial analytics
* [x] Export functionality

---

# 🗺️ Roadmap

Future development may include:

## Financial Management

* [ ] Budget management
* [ ] Monthly budgets
* [ ] Spending limits
* [ ] Recurring transactions
* [ ] Scheduled transactions
* [ ] Advanced transaction editing
* [ ] Transaction attachments

## Reports & Analytics

* [x] Daily reports
* [x] Weekly reports
* [x] Monthly reports
* [ ] Custom date ranges
* [x] Category spending analysis
* [ ] Wallet performance
* [ ] Income trends
* [ ] Expense trends
* [x] Financial statistics

## Exporting

* [ ] CSV export
* [x] PDF reports
* [x] Transaction export
* [ ] Financial statement generation

## Notifications

* [ ] Budget alerts
* [ ] Spending notifications
* [ ] Transaction notifications
* [ ] Financial reminders

## Advanced Features

* [ ] AI-powered financial insights
* [ ] Financial recommendations
* [ ] Advanced analytics
* [ ] Multi-currency improvements
* [ ] Arabic language support
* [ ] Progressive Web App support
* [ ] Improved offline capabilities

---

# 🧠 Project Goals

CashVault is not intended to be just a CRUD application.

The long-term goal is to build a complete personal finance platform where users can understand their financial behavior rather than simply record transactions.

The project therefore aims to evolve from:

```text
Record Money
     ↓
Organize Money
     ↓
Understand Money
     ↓
Analyze Money
     ↓
Improve Financial Decisions
```

---


# 🐛 Known Development Considerations

CashVault deals with several types of data that require careful handling.

### Dates

Transactions may contain JavaScript `Date` values, strings, or Firestore timestamps.

The application therefore normalizes timestamp values when displaying them.

### Financial precision

Amounts should be handled carefully to avoid unexpected floating-point behavior.

For financial calculations, future versions may benefit from integer-based minor units or a dedicated decimal library.

### Firestore timestamps

Firestore timestamps are not identical to native JavaScript `Date` objects.

The application accounts for Firestore timestamp values when displaying transaction metadata.

---

# 🤝 Contributing

Contributions are welcome.

If you want to contribute:

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/my-feature
```

3. Make your changes.
4. Test the application.
5. Commit your changes.

```bash
git commit -m "feat: add my feature"
```

6. Push the branch.

```bash
git push origin feature/my-feature
```

7. Open a Pull Request.

---

# 📝 Commit Convention

A conventional commit style is recommended:

```text
feat: add transaction filtering
fix: correct wallet balance calculation
refactor: simplify transaction hook
style: improve transaction card
docs: update README
chore: update dependencies
```

---

# 📂 Suggested Project Structure

```text
cashvault/
│
├── public/
│
├── src/
│   │
│   ├── assets/
│   │
│   ├── components/
│   │   ├── constants/
│   │   ├── layout/
│   │   └── ui/
│   │
│   ├── context/
│   │
│   ├── features/
│   │   ├── Dashboard/
│   │   ├── LandingPage/
│   │   ├── Transactions/
│   │   │   ├── components/
│   │   │   ├── types/
│   │   │   └── ...
│   │   ├── Wallets/
│   │   └── ...
│   │
│   ├── hooks/
│   │
│   ├── utils/
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

# 📸 Screenshots

---
# 👨‍💻 Author

**Hazem Muhammed El-Maghraby**

Computer Science student and frontend developer.

CashVault is being developed as a practical fintech project focused on:

* React development
* TypeScript
* Firebase
* Financial data modeling
* Responsive UI
* State management
* Modern frontend architecture

---

# ⭐ Support

If you find the project interesting, consider giving the repository a ⭐ on GitHub.

Feedback, issues, and contributions are welcome.

---

## CashVault

**Secure. Organized. Yours.**
