# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


# Error:
1. when trying to set image in background in app.jsx
answer=> 
I see the problem — the reason your code isn’t working is because Tailwind can’t parse that assets.bgImage variable when generating CSS.

Tailwind’s JIT compiler scans your files for class names at build time, and it only recognizes static strings like:

bg-[url('/path/to/image.svg')]


It does not evaluate JS variables (assets.bgImage) inside the class string. So even though Vite/Webpack resolves the path, Tailwind never creates that background-image class in the CSS.

2. in backend
In Mongoose (MongoDB ODM for Node.js), the option new: true is used with update methods like:

findOneAndUpdate()

findByIdAndUpdate()

By default, these methods return the original document before the update, not the updated one.
If you set new: true, Mongoose will return the updated document instead.