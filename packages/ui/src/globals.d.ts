/**
 * Global type declarations for CSS modules and side-effect imports
 */
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.css?url' {
  const content: string;
  export default content;
}

declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.sass' {
  const content: Record<string, string>;
  export default content;
}
