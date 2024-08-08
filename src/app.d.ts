import type { Service } from '$lib/server/service';
import 'unplugin-icons/types/svelte';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    interface Error {
      title: string;
      message: string;
      stack?: string;
    }
    interface Locals {
      service: Service;
    }
    // interface PageData {}
    interface Platform {
      env: {
        EMA_DB: D1Database;
      };
    }
  }
}

export {};
