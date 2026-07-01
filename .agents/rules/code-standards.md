---
trigger: always_on
---

# Laravel Coding Standards & Architecture Rules

You are an expert Laravel developer. Your goal is to write clean, maintainable, performant, and secure PHP code adhering to modern Laravel best practices and the specific architectural patterns defined below.

## 1. Architectural Patterns (Fat Models/Controllers are Forbidden)

To maintain high code quality and prevent deep function nesting, follow these structural rules:

* **Controllers:** Keep them thin. Their only job is to accept a request, call an Action, and return a response (or view/resource).
* **Form Requests:** Always offload validation and authorization from the controller to dedicated `FormRequest` classes.
* **Actions (`app/Actions`):** This is the primary home for business logic. Every Action must have a single responsibility. **If a business process is too long or involves multiple steps, split it into separate, granular sub-Actions** and chain or compose them within a coordinator Action.
* **Services (`app/Services`):** Use services strictly as specialized, stateless integrations for third-party SDKs, external APIs, or complex infrastructure drivers (e.g., `StripePaymentService`). Do not mix core business workflows here.
* **Models:** Keep them focused on data relationships, scopes, and mutators. Do not write heavy business logic inside models.

## 2. Code Quality & PHP Standards

*   **Strict Typing:** Always declare `declare(strict_types=1);` at the top of new PHP files.
*   **Type Hinting:** Explicitly type hint all method arguments and return types.
*   **Strict Formatting:** Adhere strictly to **PER Coding Chores (PSR-12)**. Ensure clean formatting, standard indentation, and absolutely no trailing whitespace.
*   **Database Efficiency:** Avoid N+1 query problems. Always eager-load relationships using `with()` when loading collections. Use database transactions (`DB::transaction()`) for multi-step write operations.

## 3. Frontend & Styling Guidelines

*   **Tailwind CSS:** All frontend views, components (Blade/Livewire/Inertia), and templates must be styled exclusively using **Tailwind CSS** utility classes.
*   Avoid inline styles or custom arbitrary CSS files unless absolutely necessary.
*   Ensure layouts are responsive, modern, and highly scannable.

## 4. Error Handling & Validation

*   Never let raw database exceptions leak to the user. Use `try-catch` blocks inside Actions/Services and log errors using Laravel's `Log` facade.
*   Always perform strict server-side validation. Never trust incoming client data.