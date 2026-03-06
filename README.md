# Cafe Admin Panel

This project is the **Admin Dashboard for Cafe Management System**.
It allows cafe owners to manage menu, orders, customers, payments, and analytics.

The project is built using **React, Vite, Material UI, React Query, and TailwindCSS**.

---

# Tech Stack

- React
- Vite
- Material UI
- React Query
- Axios
- TailwindCSS
- Prettier
- ESLint
- Husky
- GitHub Actions

---

# Project Setup

### 1 Install dependencies

```bash
npm install
```

### 2 Start development server

```bash
npm run dev
```

### 3 Build for production

```bash
npm run build
```

### 4 Preview production build

```bash
npm run preview
```

---

# Code Formatting (Prettier)

This project uses **Prettier** to keep the code formatting consistent across the team.

Formatting is automatically checked in **GitHub CI** and also runs before commit using **Husky + lint-staged**.

## Format all files

Run the following command to format the entire project:

```bash
npm run format:fix
```

or

```bash
npx prettier --write .
```

## Check formatting without changing files

```bash
npx prettier --check .
```

---

# Linting

Run ESLint to check code quality:

```bash
npm run lint
```

---

# Git Hooks

This project uses **Husky** to enforce formatting before commits.

When committing code:

- Prettier automatically formats staged files
- Prevents poorly formatted code from being committed

---

# Continuous Integration

GitHub Actions automatically checks code formatting on:

- Pull Requests
- Push to branches

If formatting is incorrect, the CI pipeline will fail.

---

# Folder Structure

```
src/
  assets/
  components/
  forms/
  layout/
  configs/
public/
.github/
.husky/
```

---

# Recommended Workflow

1. Pull latest code

```
git pull origin main
```

2. Create new branch

```
git checkout -b feature/your-feature-name
```

3. Format code before commit

```
npm run format:fix
```

4. Commit changes

```
git commit -m "feat: add new feature"
```

5. Push branch

```
git push origin feature/your-feature-name
```

6. Create Pull Request

---

# Useful Commands

Install dependencies

```
npm install
```

Start development server

```
npm run dev
```

Format all files

```
npm run format:fix
```

Check formatting

```
npx prettier --check .
```

Run ESLint

```
npm run lint
```

Build project

```
npm run build
```

Preview production build

```
npm run preview
```

---

# License

This project is private and maintained for internal cafe management use.
