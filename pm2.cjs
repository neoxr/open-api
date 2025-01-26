module.exports = {
   apps: [
      {
         name: "open-api",
         script: "yarn",
         args: "start",
         interpreter: "none",
         env: {
            NODE_ENV: "production"
         }
      }
   ]
}