import posthog from "posthog-js";

const SILENT = true;
const IS_VERCEL = window?.location?.href.includes("musehq.vercel.app");
const IS_LOCAL = window?.location?.href.includes("localhost:");

if (!IS_VERCEL && !IS_LOCAL) {
  posthog.init("PCoHEHV8I8etm7-gSY6RT8tcev9M3VWoejzJKjv2Ifw", {
    api_host: "https://app.posthog.com",
  });
}

export const analytics = {
  capture: (id: string, data?: any) => {
    if (!IS_VERCEL && !IS_LOCAL) {
      try {
        posthog.capture(id, data);
      } catch (err) {
        console.log("err making posthog request");
      }
    } else if (!SILENT) {
      console.log(`POSTHOG CAPTURE // ${id} // ${JSON.stringify(data)}`);
    }
  },
  identify: (uniqueId: string, data?: any) => {
    if (!IS_VERCEL && !IS_LOCAL) {
      posthog.identify(uniqueId, data);
    } else if (!SILENT) {
      console.log(`POSTHOG IDENTIFY // ${uniqueId} // ${JSON.stringify(data)}`);
    }
  },
  reset: () => {
    if (!IS_VERCEL && !IS_LOCAL) {
      posthog.reset();
    } else if (!SILENT) {
      console.log(`POSTHOG RESET`);
    }
  },
};
