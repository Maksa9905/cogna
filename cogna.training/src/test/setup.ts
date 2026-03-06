import "@testing-library/jest-dom/vitest";

// Мок fetch — Nuxt UI загружает иконки через fetch, при teardown happy-dom выбрасывает AbortError
globalThis.fetch = () => Promise.resolve(new Response(null, { status: 404 }));
