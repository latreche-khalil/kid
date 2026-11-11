import React from 'react';

interface FormattedTextProps {
  text: string;
  className?: string;
}

/**
 * Renders Arabic educational prose while converting inline `code` segments
 * into clean, high-contrast LTR inline code pills without displaying raw backticks.
 */
export const FormattedText: React.FC<FormattedTextProps> = ({ text, className = '' }) => {
  const parts = text.split(/(`[^`]+`)/g);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
          const code = part.slice(1, -1);
          return (
            <code
              key={index}
              dir="ltr"
              className="inline-block px-1.5 py-0.5 mx-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/80 font-mono text-[0.88em] font-bold align-baseline"
            >
              {code}
            </code>
          );
        }
        return <React.Fragment key={index}>{part.replace(/`/g, '')}</React.Fragment>;
      })}
    </span>
  );
};

