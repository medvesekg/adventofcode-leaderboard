const pathAliasMap = {
  "@/": "/src/",
};

export default {
  resolvers: [
    {
      alias(path) {
        for (const [slug, res] of Object.entries(pathAliasMap)) {
          if (path.startsWith(slug)) {
            return path.replace(slug, res);
          }
        }
      },
    },
  ],

  optimizeDeps: {
    exclude: ["@fortawesome/fontawesome-free", "glob", "shasum"],
  },

};
