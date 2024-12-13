import test from "@playwright/test";

test.afterAll(async () => {
  console.log('Global after all', new Date().toISOString())
})

// ;([`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
//   console.log(`Listening for ${eventType}`);
//   process.on(eventType, () => {
//     console.log(`Received ${eventType}. Exiting...`);
//   });
// }))

// console.log('Global test')
export const someObject = {}
