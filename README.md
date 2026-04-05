# Product Management App

A modern product management web app built with Next.js and React. The app supports creating, editing, deleting, searching, filtering, and viewing products in both table and card layouts with responsive UI and animated interactions.

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Abdullah-Rifak/Product-management.git
cd Product-management/product-management
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the app in development

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

Note: If port 3000 is already in use, Next.js automatically starts on another available port (for example 3001).

### 4. Lint the code

```bash
npm run lint
```

### 5. Production build (optional)

```bash
npm run build
npm run start
```

## Tech Stack Used

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- Lucide React icons
- Sonner (toast notifications)
- UUID for product IDs
- Browser localStorage for data persistence

## Current Features

- Add, edit, and delete products
- Required image upload for each product
- Product preview modal (eye action)
- Delete confirmation dialogs
- Search by product name/description
- Filters:
	- Min/Max price
	- With/without image
	- Sorting (newest, oldest, price asc/desc)
- Table and card view switch
- Light/Dark mode toggle with animated label
- Responsive layout with mobile-friendly adjustments
- Animated UI transitions for cards, sections, and dialogs

## Assumptions

- This is a frontend-only app with no backend API.
- Product data is intentionally stored in localStorage for quick demo/prototype usage.
- Uploaded images are stored as Data URLs in localStorage (suitable for small/medium usage, not ideal for large-scale production).
- Users run the app in a modern browser with JavaScript enabled.

## Improvements / Future Enhancements

- Mobile responsiveness improvements:
	- Better table-to-card fallback behavior on very small screens
	- Touch-friendly spacing and larger interactive targets
	- Sticky bottom action controls for key workflows
- AI chatbot assistant:
	- In-app AI helper for searching products with natural language
	- Smart product description generation and rewrite suggestions
	- AI-driven product categorization/tags
- Backend integration:
	- Replace localStorage with database-backed APIs
	- User accounts, authentication, and role-based access
- Image handling improvements:
	- Cloud storage uploads (S3/Cloudinary)
	- Compression/resizing pipeline
- Quality and reliability:
	- Unit and integration tests
	- E2E testing for add/edit/delete/filter flows
	- Error monitoring and analytics

## Project Structure

```text
src/
	app/            # Next.js app router files
	components/     # UI and feature components
	hooks/          # Custom React hooks
	types/          # TypeScript types
	lib/            # Shared utilities
```

## License

This project is intended for Internship assesment provided by Arc React Innovations.
