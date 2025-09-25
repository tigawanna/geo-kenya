export const logger = {
  log: (message: string, data?: any) => {
    console.log("\n---------");
    console.log(`[LOG] ${message}`, data ? JSON.stringify(data, null, 2) : "");
    console.log("----------\n");
  },

  error: (message: string, error?: any) => {
    console.log("\n---------");
    console.warn(`[ERROR] ${message}`, error ? JSON.stringify(error, null, 2) : "");
    console.log("----------\n");
  },

  warn: (message: string, data?: any) => {
    console.log("\n---------");
    console.warn(`[WARN] ${message}`, data ? JSON.stringify(data, null, 2) : "");
    console.log("----------\n");
  },

  info: (message: string, data?: any) => {
    console.log("\n");
    console.info(`[INFO] ${message}`, data ? JSON.stringify(data, null, 2) : "");
    console.log("----------\n");
  },

  sql: (message: string, query: string) => {
    console.log("\n\n========== SQL ===========");
    console.log(`[SQL] ${message}`);
    console.log("Query:");
    console.log(query.replace(/ FROM /gi, '\nFROM ').replace(/ WHERE /gi, '\nWHERE ').replace(/ ORDER BY /gi, '\nORDER BY '));
    console.log("=========================\n\n");
  }
};
