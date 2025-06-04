import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';

export default [svelte, prettier, ...svelte.configs.prettier];
