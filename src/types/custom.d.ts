// Module declarations for packages without TypeScript types

declare module 'react-hot-toast' {
  export interface ToastOptions {
    duration?: number;
    position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    className?: string;
    style?: React.CSSProperties;
  }

  export function toast(message: string, options?: ToastOptions): string;
  export function toast(component: React.ReactNode, options?: ToastOptions): string;
  
  export namespace toast {
    export function success(message: string, options?: ToastOptions): string;
    export function error(message: string, options?: ToastOptions): string;
    export function loading(message: string, options?: ToastOptions): string;
    export function dismiss(toastId?: string): void;
  }

  export function Toaster(props: any): JSX.Element;
  
  export default toast;
}

declare module 'lucide-react' {
  import React from 'react';

  export interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    stroke?: string | number;
  }

  export type Icon = React.FC<IconProps>;

  export const X: Icon;
  export const LogIn: Icon;
  export const LogOut: Icon;
  export const UserCircle: Icon;
  export const Menu: Icon;
  export const ShoppingCart: Icon;
} 