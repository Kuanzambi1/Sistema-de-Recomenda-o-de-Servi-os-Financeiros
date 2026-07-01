


import React from 'react';
import clsx from "clsx";

type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'strong' | 'em' | 'code' | 'small' | 'mark' | 'del' | 'ins' | 'sup' | 'sub' | 'p';

const textVariantStyles: Record<TextVariant, string> = {
  h1: 'text-4xl font-bold leading-tight text-foreground',
  h2: 'text-3xl font-bold leading-snug text-foreground',
  h3: 'text-2xl font-semibold leading-snug text-foreground',
  h4: 'text-xl font-semibold text-foreground',
  h5: 'text-lg font-semibold text-foreground',
  h6: 'text-base font-semibold text-foreground',
  span: 'text-base font-normal',
  strong: 'text-base font-bold',
  em: 'text-base italic',
  code: 'text-sm font-mono bg-gray-100 px-1.5 py-0.5 rounded',
  small: 'text-xs font-normal',
  mark: 'text-base bg-yellow-200 px-1 py-0.5',
  del: 'text-base line-through',
  ins: 'text-base underline',
  sup: 'text-xs align-super',
  sub: 'text-xs align-sub',
  p: 'text-base font-normal'
};

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  variant?: TextVariant;
  children?: React.ReactNode;
}

const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    {
      as: Component = "p",
      variant,
      className,
      ...props
    },
    ref
  ) => {
    const appliedVariant = variant || (Component as TextVariant);

    return (
 <Component
        ref={ref}
        className={clsx(
          textVariantStyles[appliedVariant],
          className,
          
        )}
        {...props}
      />
    );
  }
);

Text.displayName = 'Text';

export default Text;
