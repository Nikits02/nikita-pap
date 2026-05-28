import { blogPosts } from "./blogPosts";

export const blogCategoryTabs = [
  "Todos",
  ...new Set(blogPosts.map((post) => post.categoria)),
];
