import 'lucide-react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Extend lucide-react icon props to accept className
declare module 'lucide-react' {
  export interface LucideProps {
    className?: string;
  }
}

export {};
