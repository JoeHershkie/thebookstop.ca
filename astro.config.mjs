import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  adapter: cloudflare({
    imageService: 'cloudflare',
  }),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          banner: `if (typeof globalThis.MessageChannel === 'undefined') {
  class MessagePortShim {
    onmessage = null;
    postMessage(data) {
      queueMicrotask(() => {
        if (this.onmessage) this.onmessage({ data });
      });
    }
  }
  globalThis.MessageChannel = class {
    constructor() {
      this.port1 = new MessagePortShim();
      this.port2 = new MessagePortShim();
      this.port1.postMessage = (data) => queueMicrotask(() => this.port2.onmessage && this.port2.onmessage({ data }));
      this.port2.postMessage = (data) => queueMicrotask(() => this.port1.onmessage && this.port1.onmessage({ data }));
    }
  };
};`,
        },
      },
    },
  },
});
